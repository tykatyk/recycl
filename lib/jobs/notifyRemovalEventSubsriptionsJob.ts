import dbConnect from '../db/connection'
import removalEventModel from '../db/models/eventModel'
import removalEventSubscriptionModel from '../db/models/removalEventSubscription'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration' // ES 2015
import sendpulse from 'sendpulse-api'

dayjs.extend(duration)

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
    removalEvents = [
      { wasteName, agents: [{ removalAgent, eventDate }, {}, {}] },
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
      eventsPerLocation.locationName = city
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
          const { user: removalAgent, date, phone } = ev
          agents.push({ removalAgent, date, phone })
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

function sendEmail(notification) {}
