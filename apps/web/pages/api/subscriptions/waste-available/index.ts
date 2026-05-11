import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  WasteAvailableSubscriptionModel,
  dbConnect,
} from '@recycl/shared/dist/server/db/'
import { apiHandler } from '../../../../lib/helpers/errorHelpers'
import getCoords from '../../../../lib/helpers/getCoords'
import { wasteAvailableSubscriptionSchema } from '../../../../lib/validation'

async function wasteAvailableSubscriptionApiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()

  switch (req.method) {
    case 'POST': {
      await wasteAvailableSubscriptionSchema.validate(req.body, {
        abortEarly: false,
      })

      const { location, wasteTypes, radius } = req.body
      const coords = await getCoords(location.place_id)
      if (!coords) {
        throw new Error('Cannot retrieve coordinates')
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
    }

    default: {
      return res.status(405).end()
    }
  }
}

export default apiHandler(wasteAvailableSubscriptionApiHandler, true)
