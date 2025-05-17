import dbConnect from '../db/connection'
import eventModel from '../db/models/eventModel'
import removalEventNotificationModel from '../db/models/removalEventNotification'
import removalEventSubscriptionModel from '../db/models/removalEventSubscription'

async function notifyEventSubscription() {
  await dbConnect()

  removalEventSubscriptionModel
    .find()
    .cursor()
    .on('data', (subscription) => {})
    .on('end', () => {
      console.log('All subscriptions notified')
    })

  //retrieve last processed event
  const removalEventNotification = await removalEventNotificationModel
    .findOne()
    .sort({ _id: -1 })

  let lastProcessedEventId = removalEventNotification.lastProcessedEvent

  if (lastProcessedEventId) {
    const eventsCursor = await eventModel.find({
      _id: { $gt: lastProcessedEventId },
    })

    eventsCursor.forEach((event) => {})
  }

  eventModel.find()
}
