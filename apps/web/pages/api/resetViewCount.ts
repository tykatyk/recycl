import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { responseErrorCodes } from '../../lib/helpers/errorHelpers'
import { apiHandler } from '../../lib/helpers/responses'
import {
  dbConnect,
  CollectionPointModel as eventModel,
} from '@recycl/shared/dist/server/db'
const { INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED } = responseErrorCodes

async function resetViewCount(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.id) return res.status(401).end()

  await dbConnect()

  const { adType, adId } = req.body

  switch (adType) {
    case 'event':
      const ad = await eventModel.findOneAndUpdate(
        {
          _id: adId,
          user: session.id,
        },
        { viewCount: 0, viewedBy: [] },
      )
      if (!ad) {
        return res.status(404).json({ error: 'Document not found' })
      }

      return res.status(200).json({ success: true })

    default:
      res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}

export default apiHandler(resetViewCount)
