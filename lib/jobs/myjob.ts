import dbConnect from '../db/connection'
import removalEventModel from '../db/models/eventModel'
import removalApplicationModel from '../db/models/removalApplication'
import { User } from '../db/models'
import type { UserType } from '../db/models/user'
import { emailSenderSendpulse } from '../helpers/email/sendEmailSendpulse'
import prepareEmailText from '../helpers/email/wasteRemovalSubscriptionEmail'
import mongoose, { Types } from 'mongoose'
import fs from 'fs'
import { CronJob } from 'cron'
import { wasteLocation } from '../helpers/dbModelCommons'
import EmailSendingDispatcher from '../helpers/email/emailSendingDispatcher'
import type {
  Agent,
  WasteRemovalEvents,
  WasteRemovalByLocation,
  WasteRemovalNotification,
} from '../helpers/email/types/wasteRemovalNotification'
import type { RequestInit, Response } from 'node-fetch'
import { default as fetch } from 'node-fetch'

const path = 'subscriptionNotification.lock'
const dbUrl = 'mongodb://127.0.0.1:27017/recycldb2'

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
const view = 'subscriptions'

async function getSubscribedUsers() {
  type SubscribedUser = Pick<
    UserType & { _id: string },
    '_id' | 'name' | 'email'
  >

  const userAPIEndpoint = 'http://localhost:3000/api/users'
  const url = new URL(userAPIEndpoint)
  url.search = new URLSearchParams({ view }).toString()

  const response = await fetch(url)

  if (!response.ok) {
    console.error("Can't fetch user data")
    return []
  }
  return (await response.json()) as SubscribedUser[]
}

const getAggregatedRemovalApplications = async () => {}

async function processSubscriptions() {
  // await dbConnect(dbUrl)

  const subscribedUsers = await getSubscribedUsers()

  if (subscribedUsers.length === 0) return

  const userMap = new Map(
    subscribedUsers.map((u) => [
      u._id.toString(),
      { email: u.email, name: u.name },
    ]),
  )

  const dispatcher = new EmailSendingDispatcher()

  interface AggregatedApplication {
    userId: mongoose.Types.ObjectId
    docs: [{ locationId: string; locationName: string; wasteTypes: string[] }]
  }
  const aggregatedRemovalApplications =
    await removalApplicationModel.aggregate<AggregatedApplication>([
      {
        $match: {
          user: { $in: subscribedUsers.map((u) => u._id) },
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
