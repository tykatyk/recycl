import dbConnect from '../db/connection'
import removalEventModel from '../db/models/eventModel'
import removalEventSubscriptionModel from '../db/models/removalEventSubscription'
import { emailSenderSendpulse } from '../helpers/email/sendEmailSendpulse'

class Dispatcher {
  hourLimit: number
  minuteLimit: number
  timestamps: number[]
  queue: any[]
  timeout: any

  constructor() {
    this.hourLimit = 2500 //запитів за годину
    this.minuteLimit = 1000 //запитів за хвилину
    this.timestamps = []
    this.queue = []
    this.timeout = null
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

  addTask(task: any) {
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

export async function processSubscriptions() {
  await dbConnect()
  const subscriptionCursor = removalEventSubscriptionModel
    .find({ isActive: true })
    .cursor()
  const dispatcher = new Dispatcher()

  //Орієнтовна структура елемента масиву в  notification.locations
  /*const obj = {
    locationName,
    locationId,
    removalEvents = [
      { wasteName, agents: [{_id, name, street, removalDate, phone, }, {}, {}] },
    ],
  }*/

  await subscriptionCursor.eachAsync(async (subscription) => {
    subscription.populate('user', 'email')
    const notification: any = {}
    notification.receiver = subscription.user
    notification.locations = []

    //Підписка складається з елементів. Кожен елемент це окремий населений пункт
    for (const element of subscription.elements) {
      const { city, wasteTypes } = element

      const eventsPerLocation: any = {}
      eventsPerLocation.locationName = city.description
      eventsPerLocation.locationId = city.place_id
      eventsPerLocation.removalEvents = []

      //В кожному населеному пункті користувач може бути підписаний на вивіз різних типів відходів
      for (const wasteType in wasteTypes) {
        const removalEventsCursor = removalEventModel
          .find({ wasteType, city, date: { $gte: Date.now() }, isActive: true })
          .cursor()

        const agents: any[] = []

        //Певний тип відходів може вивозитись різними переробниками, які публікують оголошення про вивіз відходів (removalEvent)
        for (
          //ці івенти бажано закинути одразу в redis і потім витягувати з кешу для підвищення продуктивності
          let ev = await removalEventsCursor.next(), counter = 0;
          ev != null && counter <= 2;
          ev = await removalEventsCursor.next(), counter++
        ) {
          agents.push({
            _id: ev.user._id,
            name: ev.user.name,
            street: ev.street,
            removalDate: ev.date,
            phone: ev.phone,
          })
        }

        const eventstPerWasteType: any = {}
        eventstPerWasteType.wasteName = wasteType
        eventstPerWasteType.agents = agents

        eventsPerLocation.removalEvents.push(eventstPerWasteType)
      }
      notification.locations.push(eventsPerLocation)
    }
    dispatcher.addTask(sendEmail(notification))
  })
}

function prepareEmailText(notification) {
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

  notification.locations.forEach((location) => {
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
              <th style="font-size: 32px; padding-bottom: 24px">${location.description.split(',')[0]}</th>
            </tr>
      `
    location.removalEvents.forEach((re) => {
      const { wasteName, agents } = { ...re }
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
                     ${wasteName}
                    </th>
                  </tr>
                `

      let counter = 0
      agents.forEach((agnt) => {
        const { removalEvent, date, name } = { ...agnt }
        emailHtml += `  <tr>
                    <td style="${counter === agents.length - 1 ? '' : 'padding-bottom: 16px'}; padding-left: 16px">
                      <table>
                        <tr>
                          <td>${removalEvent.date}</td>
                        </tr>
                        <tr>
                          <td>${removalEvent.street}</td>
                        </tr>
                        <tr>
                          <td>${agnt.name}</td>
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
                              href="${host}/removalEvents/?agent=${agnt.name}&city=${location}"
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
    })
    emailHtml += `</table>
        </td>
      </tr>`
  })
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
  return emailHtml
}

async function sendEmail(notification) {
  const emailHtml = prepareEmailText(notification)
  await emailSenderSendpulse(emailHtml)
}
