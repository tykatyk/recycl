import dbConnect from '../db/connection'
import removalEventModel from '../db/models/eventModel'
import removalEventNotificationModel from '../db/models/removalEventNotification'
import removalEventSubscriptionModel from '../db/models/removalEventSubscription'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration' // ES 2015
import sendpulse from 'sendpulse-api'

dayjs.extend(duration)

const hourLimit = 2500 //email за годину
const minuteLimit = 1000 //запитів за хвилину
const dispatcher = {
  canSendNext: true,
}

export async function notify() {
  await dbConnect()
  const startingQuery = await getStartingQuery()

  const subscriptionCursor = removalEventSubscriptionModel
    .find({ isActive: true })
    .cursor()

  processSubscriptions(subscriptionCursor, startingQuery)
}

async function getStartingQuery() {
  //retrieve last processed event
  const removalEventNotification = await removalEventNotificationModel
    .findOne()
    .sort({ _id: -1 })

  const lastProcessedEventId = removalEventNotification.lastProcessedEvent

  const startingQuery = lastProcessedEventId
    ? {
        _id: { $gt: lastProcessedEventId },
      }
    : {
        date: { $gte: dayjs() },
      }

  return startingQuery
}

async function processSubscriptions(subscriptionCursor, startingQuery) {
  if (!dispatcher.canSendNext) {
    setTimeout(async () => {
      await processSubscriptions(subscriptionCursor, startingQuery)
    }, 100)
    return
  }

  const subscription = await subscriptionCursor.next()

  if (!subscription) return

  subscription.populate('user', 'email')
  const notification: any = {}
  notification.receiver = subscription.user
  notification.locations = []
  const removalEventsPerCity: any = {}

  //користувач може бути підписаний на отримання сповіщень про вивезення різних видів відходів в різних населених пунктах
  for (const element of subscription.elements) {
    const { city, wasteTypes } = element
    const removalEventsPerWasteType: any = {}

    for (const wasteType in wasteTypes) {
      const query = { ...startingQuery, city, wasteType, isActive: true }
      const removalEventsCursor = removalEventModel.find(query).cursor()
      const removalEvents: any[] = []

      //в кожному населеному пункті певний тип відходів може вивозитись декількома переробниками
      for (
        //ці івенти бажано закинути одразу в redis і потім витягувати з кешу для підвищення продуктивності
        let removalEvent = await removalEventsCursor.next(), counter = 0;
        removalEvent != null && counter <= 2;
        removalEvent = await removalEventsCursor.next(), counter++
      ) {
        const { user: removalAgent, date, phone } = removalEvent
        removalEvents.push({ removalAgent, date, phone })
      }

      removalEventsPerWasteType.wasteType = removalEvents
    }
    removalEventsPerCity.city = removalEventsPerWasteType
  }
  notification.locations = removalEventsPerCity
  sendEmail(notification)
  await processSubscriptions(subscriptionCursor, startingQuery)
}

function sendEmail(notification) {}
