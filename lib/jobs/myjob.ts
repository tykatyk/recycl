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

type RemovalEventForNotification = {
  agentId: Types.ObjectId
  agentName: string
  agentStreet: string
  agentDate: Date
  agentPhone: string
}

type Removal = {
  [wasteName: string]: RemovalEventForNotification[]
}

type Locations = {
  [place_id: string]: {
    structured_formatting: {
      main_text: string
    }
    waste_types: Removal
  }
}

type Notification = {
  receiverEmail: string
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

function prepareEmailText(notification: Notification) {
  const host = 'localhost:3000'
  const yellow = ' #f8bc45'
  let emailHtml = `<html>
  <head>
    <meta charset="utf-8" />
    <title>Список событий вывоза отходов </title>
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
          <a
            href="http://localhost:3000"
            style="display: inline-block; text-decoration: none"
          >
            <table role="presentation">
              <tr>
                <td style="color: #fff">
                  <img
                    src="../../../public/images/logo.png"
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
                    color: #adce5d;
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
          style="font-size: 24px; font-weight: bold; color: #ccc"
        >
          Информируем вас о событиях по вывозу отходов, на которые вы подписаны
        </td>
      </tr>
`

  for (const place_id in notification.locations) {
    emailHtml += `      <!--city row-->
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
              <th style="font-size: 32px; padding-bottom: 24px">${notification.locations[place_id].structured_formatting.main_text}</th>
            </tr>
      `

    for (const waste_type in notification.locations[place_id].waste_types) {
      emailHtml += ` <!--waste type row-->
            <tr>
              <td style="padding-bottom: 16px">
                <!--waste type table-->
                <table>
                 <tr>
                    <th
                      align="left"
                      style="
                        font-size: 24px;
                        padding: 0 0 16px 8px;
                        color: #fff;
                      "
                    >
                     ${waste_type}
                    </th>
                  </tr>
                `

      let counter = 0
      const removals = notification.locations[place_id].waste_types[waste_type]

      removals.forEach((ev) => {
        const { agentDate, agentName, agentStreet } = { ...ev }
        emailHtml += `  <tr>
                    <td style="${counter === removals.length - 1 ? '' : 'padding-bottom: 16px'}; padding-left: 16px">
                      <table>
                        <tr>
                          <td>${agentDate}</td>
                        </tr>
                        <tr>
                          <td>${agentStreet}</td>
                        </tr>
                        <tr>
                          <td>${agentName}</td>
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
                              href="${host}/removalEvents/?agent=${agentName}&city=${location}"
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
  const emailHtml = prepareEmailText(notification)
  await emailSenderSendpulse(emailHtml)
}

async function processSubscriptions() {
  await dbConnect(dbUrl)
  const subscriptions = await Subscription.find({
    elements: 'mobileStationAvailable',
  })

    .populate<{ user: UserType & { _id: mongoose.ObjectId } }>('user', 'email') // populate user but only include the email field
    .select('-_id user') // select only the user field from Subscription

  const users = subscriptions.map((s) => s.user._id)
  const userMap = new Map(
    subscriptions.map((s) => [s.user._id.toString(), s.user.email]),
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

  const removalApplications = await removalApplicationModel.aggregate([
    {
      $match: { user: { $in: subscriptions.map((s) => s.user._id) } },
    }, // isActive: true,//<---Should add isActive or expires filter for removal applications
    {
      $group: {
        _id: {
          user: '$user',
          wasteLocation: '$wasteLocation.structured_formatting.main_text',
        },
        docs: {
          $push: { wasteType: '$wasteType' },
        },
      },
    },

    {
      $group: {
        _id: '$_id.user',
        docs: { $push: { wasteLocation: '$_id.wasteLocation', subs: '$docs' } },
      },
    },
  ])

  const result = removalApplications.map((r) => ({
    ...r,
    email: userMap.get(r._id.toString()),
  }))

  console.log(result)

  /*await users.eachAsync(async (subscription) => {
    const populatedSubscription = await subscription.populate<{
      user: { email: string }
    }>('user', 'email')

    const locations: Locations = {}
    const notification: Notification = {
      receiverEmail: populatedSubscription.user.email,
      locations,
    }

 

    //need to group removal applications by place and waste type before processing
    for (const ra of removalApplications) {
      const place_id = ra.wasteLocation.place_id
      const wasteType = ra.wasteType

      if (
        locations.place_id &&
        locations.place_id.waste_types &&
        locations.place_id.waste_types.waste_type
      )
        continue

      const removalEventsCursor = removalEventModel
        .find({
          wasteType: wasteType,
          city: place_id,
          date: { $gte: Date.now() },
          isActive: true,
        })
        .cursor()

      const events: any[] = [] //ToDo: change any to smth more meaningful

      //Певний тип відходів може вивозитись різними переробниками, які публікують оголошення про вивіз відходів (removalEvent)
      for (
        //ці івенти бажано закинути одразу в redis і потім витягувати з кешу для підвищення продуктивності
        let ev = await removalEventsCursor.next(), counter = 0;
        ev != null && counter <= 2;
        ev = await removalEventsCursor.next(), counter++
      ) {
        const populatedEv = await ev.populate<{ user: { name: string } }>(
          'user',
          'name',
        )
        events.push({
          _id: ev.user._id,
          name: populatedEv.user.name,
          street: ev.street,
          removalDate: ev.date,
          phone: ev.phone,
        })
      }

      if (events.length === 0) continue

      if (!locations[place_id]) {
        locations[place_id] = {
          structured_formatting: {
            main_text: ra.wasteLocation.structured_formatting.main_text,
          },
          waste_types: {},
        }
      }
      locations[place_id]['waste_types'][wasteType] = events
    }

    dispatcher.addTask(() => {
      sendEmail(notification)
    })
  })*/
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
