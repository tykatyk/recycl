import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  SubscriptionModel,
  WasteAvailableSubscriptionModel,
  dbConnect,
} from '@recycl/shared/dist/server/db/'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import cryptoRandomString from 'crypto-random-string'
import * as yup from 'yup'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'
import { location as lolcationValidator } from '@recycl/shared/dist/validation'
import getCoords from '../../../lib/helpers/getCoords'
import type { Waste } from '../../../lib/types/waste'
import type { PlaceType } from '../../../lib/types/placeAutocomplete'
import { wasteAvailableSubscriptionSchema } from '../../../lib/validation'

interface WasteAvailableCreateRequest extends NextApiRequest {
  body: yup.InferType<typeof wasteAvailableSubscriptionSchema>
}

async function wasteAvailableSubscriptionApiHandler(
  req: WasteAvailableCreateRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()

  switch (req.method) {
    case 'POST': {
      try {
        await wasteAvailableSubscriptionSchema.validate(req.body)

        const { location, wasteTypes, radius } = req.body
        const coords = await getCoords(location.place_id)
        if (!coords) {
          throw new Error()
        }

        const user = session.id

        await WasteAvailableSubscriptionModel.create({
          user,
          location: {
            position: { type: 'Point', coordinates: coords },
            ...location,
          },
          wasteTypes,
          radius,
        })

        return res.status(200).end()
      } catch (error) {
        console.error(error)
        return res.status(400).end()
      }
    }
    case 'GET': {
      const subscriptions = await SubscriptionModel.find({
        user: session.id,
        subscribed: true,
      })
        .select('-_id variant')
        .lean()

      if (!subscriptions) return res.json([])

      const variantIds = subscriptions.map((sub) => sub.variant)

      return res.json(variantIds)
    }

    default: {
      return res.status(405).end()
    }
  }
}

export default apiHandler(wasteAvailableSubscriptionApiHandler)
