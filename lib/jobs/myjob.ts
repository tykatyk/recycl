import dbConnect from '../db/connection'
import removalEventModel from '../db/models/eventModel'
import removalApplicationModel from '../db/models/removalApplication'
import { Subscription } from '../db/models'
import { UserType } from '../db/models/user'
import { emailSenderSendpulse } from '../helpers/email/sendEmailSendpulse'
import mongoose, { Types } from 'mongoose'
import fs from 'fs'
import { CronJob } from 'cron'
import { wasteLocation } from '../helpers/dbModelCommons'
import subscription from '../db/models/subscription'

const path = 'subscriptionNotification.lock'
const dbUrl = 'mongodb://127.0.0.1:27017/recycldb2'

interface Agent {
  agentId: Types.ObjectId
  agentName: string
  date: Date
}

type Removal = {
  [wasteName: string]: Agent[]
}

type Locations = {
  [locationId: string]: {
    locationName: string
    wasteTypes: Removal
  }
}

type Notification = {
  receiverEmail: string
  receiverName: string
  locations: Locations
}

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
//
function prepareEmailText(notification: Notification) {
  const host = 'http://localhost:3000'
  const yellow = ' #f8bc45'
  const logoPath = '../public/images/logo.png'
  // const logoPath = 'http://localhost:3000/logo.png'
  let emailHtml = `<html>
  <head>
    <meta charset="utf-8" />
    <title>Список событий по приему вторсырья </title>
  </head>
  <body style="font-family: Arial, Helvetica, sans-serif; color: #fff">
    <table
      role="presentation"
      width="100%"
      border="0"
      cellspacing="20"
      cellpadding="0"
      style="
        border-radius: 10px;
        background: #223c4a;
        max-width: 600px;
        margin: auto;
      "
    >
      <tr>
        <td align="center" style="padding: 10px 0px; color: #fff">
         <a href="${host}" style="display: inline-block; text-decoration: none; color: #adce5d;">
          <table role="presentation">
            <tr>
              <td>
                <img
                  src="${logoPath}"
                  alt="Logo"
                  width="30"
                  style="display: block; border: 0"
                />
              </td>
              <td
                style="
                  font-size: 24px;
                  font-weight: bold;
                  letter-spacing: 0;
                "
              >
                Recycl
              </td>
            </tr>
          </table>
         
         </a>
         
        </td>
      </tr>
      <tr>
        <td
          align="center"
          style="font-size: 32px; font-weight: bold;"
        >
          Информируем вас о предстоящих событиях по сбору вторсырья в вашем населенном пункте
        </td>
      </tr>
`

  for (const place_id in notification.locations) {
    emailHtml += `<!--city row-->
      <tr>
        <td style="padding: 24px 0">
          <!--city table-->
          <table
            role="presentation"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="color: #fff; text-align: left"
            width="100%"
          >
            <tr>
              <th style="font-size: 24px; padding-bottom: 16px">Населенный пункт: ${notification.locations[place_id].locationName}</th>
            </tr>
      `

    for (const waste_type in notification.locations[place_id].wasteTypes) {
      emailHtml += ` <!--waste type row-->
            <tr>
              <td style="padding-bottom: 8px">
                <!--waste type table-->
                <table style="font-size: 16px; color: #fff;">
                 <tr>
                    <th
                      align="left"
                      style="padding: 0 0 16px 8px;"
                    >
                     Тип собираемого вторсырья: ${waste_type}
                    </th>
                  </tr>
                `

      let counter = 0
      const removals = notification.locations[place_id].wasteTypes[waste_type]
      const locationName = notification.locations[place_id].locationName

      removals.forEach((ev) => {
        const { date: agentDate, agentName } = { ...ev }
        const detailsHref = new URL(`${host}/removalEvents`)
        detailsHref.searchParams.set('agent', agentName)
        detailsHref.searchParams.set('location', locationName)
        const year = agentDate.getFullYear()
        const month = (agentDate.getMonth() + 1).toString().padStart(2, '0')
        const day = agentDate.getDate().toString().padStart(2, '0')
        const hours = agentDate.getHours().toString().padStart(2, '0')
        const minutes = agentDate.getMinutes().toString().padStart(2, '0')

        emailHtml += `<tr style="color: #ccc; line-height: 1.1">
                        <td style="${counter === removals.length - 1 ? '' : 'padding-bottom: 16px'};padding-left: 8px">
                          <table>
                            <tr>
                              <td>Дата и время: ${day}-${month}-${year}, ${hours}:${minutes}</td>
                            </tr>
                            <tr>
                              <td>Организатор: ${agentName}</td>
                            </tr>
                            <tr>
                              <td>
                                <a
                                  style="
                                    display: inline-block;
                                    padding-top: 4px;
                                    text-decoration: none;
                                    color:${yellow};
                                  "
                                  href="${detailsHref}"
                                  >Подробнее</a
                                >
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>`
        counter++
      })

      emailHtml += `</table>
              </td>
            </tr>`
    }

    emailHtml += `</table>
        </td>
      </tr>`

    emailHtml += `
      <tr>
        <td
          align="center"
          style="padding: 0px 0px 10px 0px; font-size: 14px; color: #ccc"
        >
          Если вы не хотите получать подобные уведомления, нажмите
          <br /><a
            href="#"
            style="
              display: inline-block;
              padding-top: 4px;
              color: #ccc;
              text-decoration: underline;
            "
            >отписаться</a
          >.
        </td>
      </tr>
    </table>
  </body>
</html>`
  }
  return emailHtml
}

async function sendEmail(notification: Notification) {
  if (!notification.receiverEmail) {
    console.log('No receiver email')
    return
  }

  const emailHtml = prepareEmailText(notification)
  const emailObj = {
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
  await emailSenderSendpulse(emailObj)
}

async function processSubscriptions() {
  await dbConnect(dbUrl)
  const subscriptions = await Subscription.find({
    elements: 'mobileStationAvailable',
  })

    .populate<{ user: UserType & { _id: mongoose.ObjectId } }>('user', 'email') //include only the email field
    .select('-_id user')

  const users = subscriptions.map((s) => s.user._id)
  const userMap = new Map(
    subscriptions.map((s) => [
      s.user._id.toString(),
      { email: s.user.email, name: s.user.name },
    ]),
  )

  const dispatcher = new Dispatcher()

  //Орієнтовна структура елемента масиву в  notification.locations
  /*const obj = {
    locationName,
    locationId,
    removals = [
      { wasteName, events: [{_id, name, street, removalDate, phone, }, {}, {}] },
    ],
  }*/
  interface AggregatedApplication {
    userId: mongoose.Types.ObjectId
    // email: string
    docs: [{ locationId: string; locationName: string; wasteTypes: string[] }]
  }
  const aggregatedRemovalApplications =
    await removalApplicationModel.aggregate<AggregatedApplication>([
      {
        $match: { user: { $in: subscriptions.map((s) => s.user._id) } },
      }, // isActive: true,//<---Should add isActive or expires filter for removal applications
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
        // date: { $gte: new Date() },
        'location.structured_formatting.main_text': 'Сумы',
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
          $slice: ['$agentsByWasteType', 3], //only 3 agents to avoid long emails
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
    const locations: Locations = {}
    const notification: Notification = {
      receiverEmail: application.userEmail,
      receiverName: application.userName,
      locations,
    }

    for (const doc of application.docs) {
      const locationId = doc.locationId
      let agents: Agent[] | undefined = []

      const allEventsByLocation = removalEventsMap.get(doc.locationId)
      if (!allEventsByLocation) continue

      const removalbleWasteTypes: Record<string, Agent[]> = {}
      for (const wasteType of doc.wasteTypes) {
        agents = allEventsByLocation.eventsMap.get(wasteType)
        if (!agents || agents.length === 0) continue

        if (!locations[locationId]) {
          locations[locationId] = {
            locationName: doc.locationName,
            wasteTypes: {} as Removal,
          }
        }

        removalbleWasteTypes[wasteType] = agents

        locations[locationId].wasteTypes = removalbleWasteTypes
      }
      //ToDo: check if wasteTypes has smth.
    }

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
