import {
  UserModel,
  WasteAvailableSubscriptionModel,
  WasteRemovalEventModel,
} from '../../db/models'
import type {
  WasteTypeCounters,
  Location,
  WasteAvailableSubscriptionData,
} from '../../types/subscription'
import { redisConnection as redis } from '../../db/redisConnection'
import { buildEncodedEmail } from '../email'
import { getWasteAvailableHtml } from '../email/templates/subscriptionTemplates'

type GetEmailData = {
  userId: string
  userName: string
  userEmail: string
  lastRunDate: Date
}

const getWasteAvailableData = async (
  params: GetEmailData,
): Promise<WasteAvailableSubscriptionData | null> => {
  const { userId, userName, userEmail, lastRunDate } = params

  //ToDo: check if user is not banned

  //ToDo: add subscription type
  //1. Get all user's waste available subscriptions
  //2. For each subscription iterate over it's locations
  //3. For each location in the subscription get all waste types
  //4. For each waste type check Redis the count of the new waste removal proposal where locationId === location._id and wasteType === wasteType
  //5. If there is no record in Redis: get previously mentioned data from the db and put it to Redis

  const items = await WasteAvailableSubscriptionModel.find({
    user: userId,
  })
  if (items.length === 0) return null

  const locations: Location[] = []

  for (const item of items) {
    const { location, wasteTypes } = item

    if (!wasteTypes || wasteTypes.length === 0) continue

    const wasteTypeCounters: WasteTypeCounters[] = []

    for (const wasteType of wasteTypes) {
      let counter = 0
      const key = `WasteAvailableAdsCounter:${wasteType}`

      const redisCounter = await redis.get(key)
      if (redisCounter === null) {
        counter = await WasteRemovalEventModel.countDocuments({
          waste: wasteType,
          createdAt: {
            $gt: lastRunDate,
          },
          date: { $gt: new Date(Date.now() + 12 * 60 * 60 * 1000) },
          isActive: true,
        })
        await redis.set(key, counter)
        await redis.expire(key, 30 * 60) //30 minutes
      } else {
        counter = Number(redisCounter)
      }

      if (!counter) continue
      wasteTypeCounters.push({ wasteName: wasteType, newAdsCount: counter })
    }
    if (wasteTypeCounters.length === 0) continue

    locations.push({
      //ToDo: remove country name from description
      locationName: location.description,
      locationId: location.place_id,
      wasteTypes: wasteTypeCounters,
    })
  }

  if (locations.length === 0) return null
  return {
    receiverName: userName,
    receiverEmail: userEmail,
    locations,
  }
}

export const getWasteAvailableEmail = async (params: GetEmailData) => {
  const { userId, userName, userEmail, lastRunDate } = params
  const data = await getWasteAvailableData({
    userId,
    userName,
    userEmail,
    lastRunDate,
  })
  if (!data) return null

  const { receiverName, receiverEmail } = data
  //ToDo: subject should === title
  const subject = ''
  const html = getWasteAvailableHtml(data)

  return buildEncodedEmail({
    receiverName,
    receiverEmail,
    subject,
    html,
  })
}
