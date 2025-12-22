import dbConnect from '../db/connection'
import removalEventModel from '../db/models/eventModel'
import removalApplicationModel from '../db/models/removalApplication'
import { Subscription } from '../db/models'
import { UserType } from '../db/models/user'
import { emailSenderSendpulse } from '../helpers/email/sendEmailSendpulse'
import prepareEmailText from '../helpers/email/wasteRemovalSubscriptionEmail'
import mongoose, { Types } from 'mongoose'
import fs from 'fs'
import { CronJob } from 'cron'
import { wasteLocation } from '../helpers/dbModelCommons'
import subscription from '../db/models/subscription'
import type {
  Agent,
  WasteRemovalEvents,
  WasteRemovalByLocation,
  WasteRemovalNotification,
} from '../helpers/email/types/wasteRemovalNotification'

const path = 'subscriptionNotification.lock'
const dbUrl = 'mongodb://127.0.0.1:27017/recycldb2'

class Dispatcher {
  hourLimit: number
  minuteLimit: number
  timestamps: number[]
  queue: any[]
  timeout: NodeJS.Timeout | undefined

  constructor() {
    this.hourLimit = 2500 //запитів за годину
    this.minuteLimit = 1000 //запитів за хвилину
    this.timestamps = []
    this.queue = []
    this.timeout = undefined
  }

  canSendNext() {
    this.timestamps = this.timestamps.filter((timestamp) => {
      Date.now() - timestamp <= 3600 * 1000
    })
    const lastMinuteCount = this.timestamps.filter((timestamp) => {
      Date.now() - timestamp <= 60 * 1000
    }).length
    const lastHourCount = this.timestamps.length
    return lastMinuteCount < this.minuteLimit && lastHourCount < this.hourLimit
  }

  addTask(task: (...args: [any]) => any): void {
    this.queue.push(task)
    this.processTask()
  }

  processTask() {
    if (this.queue.length === 0) {
      clearTimeout(this.timeout)
      return
    }

    if (this.canSendNext()) {
      const task = this.queue.shift()
      this.timestamps.push(Date.now())
      task()
    }

    clearTimeout(this.timeout)

    this.timeout = setTimeout(() => {
      this.processTask()
    }, 100)
  }
}

async function sendEmail(notification: WasteRemovalNotification) {
  return
  if (!notification.receiverEmail) {
    console.log('No receiver email')
    return
  }

  if (!notification.receiverName) {
    notification.receiverName = notification.receiverEmail
  }

  const emailHtml = prepareEmailText(notification)
  const email = {
    html: emailHtml,
    subject: 'Предстоящие события по сбору вторсырья в вашем городе',
    from: {
      name: 'Recycl',
      email: 'notify@yoused.com.ua',
    },
    to: [
      {
        name: notification.receiverName,
        email: notification.receiverEmail,
      },
    ],
  }
  await emailSenderSendpulse(email)
}

async function processSubscriptions() {
  await dbConnect(dbUrl)
  const subscriptions = await Subscription.find({
    elements: 'mobileStationAvailable',
  })

    .populate<{ user: UserType & { _id: mongoose.ObjectId } }>('user', 'email') //include only the email field
    .select('-_id user')

  const userMap = new Map(
    subscriptions.map((s) => [
      s.user._id.toString(),
      { email: s.user.email, name: s.user.name },
    ]),
  )

  const dispatcher = new Dispatcher()

  interface AggregatedApplication {
    userId: mongoose.Types.ObjectId
    docs: [{ locationId: string; locationName: string; wasteTypes: string[] }]
  }
  const aggregatedRemovalApplications =
    await removalApplicationModel.aggregate<AggregatedApplication>([
      {
        $match: {
          user: { $in: subscriptions.map((s) => s.user._id) },
          expires: { $gte: new Date() },
        },
      },
      {
        $group: {
          _id: {
            userId: '$user',
            locationId: '$wasteLocation.place_id',
          },
          locationName: {
            $first: '$wasteLocation.structured_formatting.main_text',
          },
          docs: {
            $addToSet: '$wasteType',
          },
        },
      },

      {
        $group: {
          _id: '$_id.userId',
          docs: {
            $push: {
              locationId: '$_id.locationId',
              locationName: '$locationName',
              wasteTypes: '$docs',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          docs: '$docs',
        },
      },
    ])

  const removalApplications = aggregatedRemovalApplications.map((r) => {
    const user = userMap.get(r.userId.toString())
    return {
      ...r,
      userEmail: user?.email || '',
      userName: user?.name || '',
    }
  })

  interface EventByWasteType {
    wasteType: string
    agents: Agent[]
  }

  interface AggregatedEvent {
    locationId: string
    locationName: string
    eventsByWasteType: EventByWasteType[]
  }
  const removalEvents = await removalEventModel.aggregate<AggregatedEvent>([
    {
      $match: {
        isActive: true,
        date: { $gte: new Date() },
      },
    },

    {
      $sort: {
        date: 1,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'populatedUser',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },
    { $unwind: '$populatedUser' },
    {
      $group: {
        _id: {
          userId: '$user',
          locationId: '$location.place_id',
          wasteType: '$waste',
        },
        locationName: { $first: '$location.structured_formatting.main_text' },
        agentName: { $first: '$populatedUser.name' },
        date: { $first: '$date' },
      },
    },
    {
      $group: {
        _id: {
          locationId: '$_id.locationId',
          wasteType: '$_id.wasteType',
        },
        locationName: { $first: '$locationName' },
        agentsByWasteType: {
          $push: {
            agentId: '$_id.userId',
            agentName: '$agentName',
            date: '$date',
          },
        },
      },
    },
    {
      $project: {
        _id: '$_id',
        locationName: '$locationName',
        agentsByWasteType: {
          $slice: ['$agentsByWasteType', 3], //max 3 agents to avoid long emails
        },
      },
    },
    {
      $group: {
        _id: '$_id.locationId',
        locationName: { $first: '$locationName' },
        docs: {
          $push: { wasteType: '$_id.wasteType', agents: '$agentsByWasteType' },
        },
      },
    },

    {
      $project: {
        _id: 0,
        locationId: '$_id',
        locationName: '$locationName',
        eventsByWasteType: '$docs',
      },
    },
  ])

  const removalEventsMap = new Map(
    removalEvents.map((re) => {
      const { locationId, eventsByWasteType, locationName } = re
      const eventsMap = new Map(
        eventsByWasteType.map((doc) => [doc.wasteType, doc.agents]),
      )
      return [locationId, { eventsMap, locationName }]
    }),
  )

  removalApplications.forEach(async (application) => {
    const locations: WasteRemovalByLocation = {}
    const notification: WasteRemovalNotification = {
      receiverEmail: application.userEmail,
      receiverName: application.userName,
      locations,
    }

    for (const doc of application.docs) {
      const locationId = doc.locationId

      const allEventsByLocation = removalEventsMap.get(doc.locationId)
      if (!allEventsByLocation) continue

      const removalbleWasteTypes: Record<string, Agent[]> = {}
      for (const wasteType of doc.wasteTypes) {
        const agents = allEventsByLocation.eventsMap.get(wasteType)
        if (!agents || agents.length === 0) continue

        if (!locations[locationId]) {
          locations[locationId] = {
            locationName: doc.locationName,
            wasteRemovalEvents: {} as WasteRemovalEvents,
          }
        }

        removalbleWasteTypes[wasteType] = agents

        locations[locationId].wasteRemovalEvents = removalbleWasteTypes
      }
    }

    if (Object.keys(notification.locations).length === 0) return

    dispatcher.addTask(() => {
      sendEmail(notification)
    })
  })
}

/*function createLock() {
  try {
    fs.writeFileSync(path, '', { flag: 'wx' })
    return true
  } catch (err: any) {
    if (err.code === 'EEXIST') {
      console.log('Lock file already exists')
    }
    return false
  }
}

function removeLock() {
  if (fs.existsSync(path)) fs.unlinkSync(path)
}

process.on('SIGINT', removeLock) // Ctrl+C
process.on('SIGTERM', removeLock) // kill
process.on('exit', removeLock) // graceful exit

async function runJob() {
  if (!createLock()) return

  try {
    console.log('Job started.')

    await processSubscriptions()

    console.log('Job finished.')
  } catch (err) {
    console.error('Job failed:', err)
  } finally {
    removeLock()
  }
}

const notifyRemovalSubscriptionsJob = new CronJob(
  '0 * * * * *', // cronTime
  async function () {
    await runJob()
  }, // onTick
  null, // onComplete
  true, // start
)

// export default notifyRemovalSubscriptionsJob
// export default runJob()
*/

export default processSubscriptions()
