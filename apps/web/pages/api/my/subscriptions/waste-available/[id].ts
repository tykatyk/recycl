import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../api/auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  WasteAvailableSubscriptionModel,
  dbConnect,
} from '@recycl/shared/dist/server/db/'
import { apiHandler } from '../../../../../lib/helpers/errorHelpers'
import getCoords from '../../../../../lib/helpers/getCoords'
import { wasteAvailableSubscriptionSchema } from '../../../../../lib/validation'

async function singleWasteAvailableSubscriptionApiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()

  switch (req.method) {
    case 'GET': {
      const { id } = req.query
      const subscription =
        await WasteAvailableSubscriptionModel.findById(id).lean()

      return res.json(subscription)
    }

    case 'PUT': {
      await wasteAvailableSubscriptionSchema.validate(req.body, {
        abortEarly: false,
      })

      const { location, wasteTypes, radius, _id } = req.body

      const wasteAvailableSubscription =
        await WasteAvailableSubscriptionModel.findById(_id)

      if (!wasteAvailableSubscription) {
        throw new Error('Subscription not foud')
      }

      if (wasteAvailableSubscription.location.place_id !== location.place_id) {
        const coords = await getCoords(location.place_id)
        if (!coords) {
          throw new Error('Cannot retrieve coordinates')
        }
        wasteAvailableSubscription.location = {
          position: { type: 'Point', coordinates: coords },
          ...location,
        }
      }

      wasteAvailableSubscription.wasteTypes = wasteTypes
      wasteAvailableSubscription.radius = radius
      wasteAvailableSubscription.wasteTypes = wasteTypes

      await wasteAvailableSubscription.save()

      return res.json({ status: 'success', message: 'Subscription created' })
    }

    default: {
      return res.status(405).end()
    }
  }
}

export default apiHandler(singleWasteAvailableSubscriptionApiHandler, true)
