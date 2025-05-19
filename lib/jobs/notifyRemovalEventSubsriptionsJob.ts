import dbConnect from '../db/connection'
import removalEventModel from '../db/models/eventModel'
import removalEventNotificationModel from '../db/models/removalEventNotification'
import removalEventSubscriptionModel from '../db/models/removalEventSubscription'
import dayjs from 'dayjs'

async function notifyEventSubscription() {
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
  let subscriptionsToNotify: any[] = []
  let counter = 0

  for (
    let subscription = await subscriptionCursor.next();
    subscription != null;
    subscription = await subscriptionCursor.next()
  ) {
    const o: any = {}
    o.user = subscription.user
    o.notifications = []

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
        const { user, date, phone } = removalEvent
        removalEventsForSubscriptionElement.push({ user, date, phone })
      }
      const b = {
        city,
        wasteType,
        removalEvents: removalEventsForSubscriptionElement,
      }

      o.notifications.push(b)
    }

    counter++
    subscriptionsToNotify.push(o)

    // subscriptionsToNotify.push({
    //   user: subscription.user,
    //   notifications: [
    //     {
    //       city,
    //       wasteType,
    //       removalEvents: removalEventsForSubscriptionElement,
    //     },
    //   ],
    // })

    //відправляємо емаіл одразу для 100 підписок, а не для кожної окремо, чим підвищуємо продуктивність
    if (counter == 100) {
      counter = 0
      subscriptionsToNotify = []
      //ToDo: Send emails
    }
  }
}

function processEvents(removalEvent) {}
