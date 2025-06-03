import { min } from 'lodash'
import dbConnect from '../db/connection'
import removalEventModel from '../db/models/eventModel'
import removalEventNotificationModel from '../db/models/removalEventNotification'
import removalEventSubscriptionModel from '../db/models/removalEventSubscription'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration' // ES 2015

dayjs.extend(duration)

import sendpulse from 'sendpulse-api'

const hourLimit = 2500 //email за годину
const minuteLimit = 1000 //запитів за хвилину

export async function notifyEventSubscription() {
  await dbConnect()
  const startingQuery = await getStartingQuery()

  const subscriptionCursor = removalEventSubscriptionModel.find().cursor()

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
  let minuteCounter = 0
  let hourCounter = 0
  let minuteAgo = dayjs()
  let hourAgo = minuteAgo
  const oneMinute = 60
  const oneHour = 60 * 60

  for (
    let subscription = await subscriptionCursor.next();
    subscription != null;
    subscription = await subscriptionCursor.next()
  ) {
    //Структура subscriptionNotification
    //  {
    //     user: {
    //       _id
    //       email
    //    },
    //     notifications: [
    //       {
    //         city,
    //         wasteType,
    //         removalEvents: removalEventsForSubscriptionElement,
    //       },
    //     ]
    //   },
    subscription.populate('user', 'email')
    const subscriptionNotification: any = {}
    subscriptionNotification.user = subscription.user
    subscriptionNotification.notifications = []

    //користувач може бути підписаний на отримання сповіщень про вивезення різних видів відходів в різних населених пунктах
    for (const element of subscription.elements) {
      const { city, wasteType } = element
      const query = { ...startingQuery, city, wasteType }

      const removalEventsForSubscriptionElement: any[] = []

      //ці івенти бажано закинути одразу в redis і потім витягувати з кешу для підвищення продуктивності
      const removalEventsCursor = removalEventModel.find(query).cursor()

      //в кожному населеному пункті певний тип відходів може вивозитись декількома переробниками
      for (
        let removalEvent = await removalEventsCursor.next();
        removalEvent != null;
        removalEvent = await removalEventsCursor.next()
      ) {
        const { user: removalAgent, date, phone } = removalEvent
        removalEventsForSubscriptionElement.push({ removalAgent, date, phone })
      }
      const notification = {
        city,
        wasteType,
        removalEvents: removalEventsForSubscriptionElement,
      }

      subscriptionNotification.notifications.push(notification)
    }

    const deltaMinutes = dayjs.duration(dayjs().diff(minuteAgo)).seconds()
    if (deltaMinutes <= oneMinute) {
      if (minuteCounter >= minuteLimit) {
        //ToDo: wait
        minuteCounter = 0
        minuteAgo = dayjs()
      }
    } else {
      minuteCounter = 0
      minuteAgo = dayjs()
    }

    const deltaHours = dayjs.duration(dayjs().diff(hourAgo)).seconds()
    // subscriptionNotification
    if (deltaHours <= oneHour) {
      if (hourCounter >= hourLimit) {
        //ToDo: wait
        hourCounter = 0
        hourAgo = dayjs()
      }
    } else {
      hourCounter = 0
      hourAgo = dayjs()
    }

    sendRemovalSubscriptionEmails(subscriptionNotification)
  }
}

//  if (minuteCounter < minuteLimit) {
//         if (hourCounter < hourLimit) {
//           //process
//         } else {
//           //ToDo: wait
//           hourCounter = 0
//           hourAgo = dayjs()
//         }
//       } else {
//         //ToDo: wait
//         minuteCounter = 0
//         minuteAgo = dayjs()
//       }

function sendRemovalSubscriptionEmails(subscriptionNotification) {}
