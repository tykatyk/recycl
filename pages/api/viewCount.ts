import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import eventModel from '../../lib/db/models/wasteRemovalEvent'
import type { WasteRemovalEvent } from '../../lib/db/models/wasteRemovalEvent'
import dbConnect from '../../lib/db/connection'
import { METHOD_NOT_ALLOWED } from '../../lib/helpers/errorHelpers'
import cryptoRandomString from 'crypto-random-string'
import dayjs from 'dayjs'
import { HydratedDocument } from 'mongoose'

export default async function viewCounter(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.id) return res.status(401).end()

  const incrementViewCount = async (
    ad: HydratedDocument<WasteRemovalEvent>,
    identifier: string,
  ) => {
    ad.viewedBy.push(identifier)
    ad.viewCount += 1
    await ad.save()
  }

  await dbConnect()

  const { adType, adId } = req.body // Get the ad type and ad ID from the request

  switch (adType) {
    case 'event':
      try {
        const ad = await eventModel.findOne({ _id: adId, user: session.id })
        if (!ad) {
          return res.status(404).json({ message: 'Ad not found' })
        }

        if (ad.user.toString() === session?.id) {
          return res.status(200).json({
            message: `Viewing an ad by ad's author doesn't increment view count`,
          })
        }

        //only count views for ads which are not stale
        const maxAge = dayjs(ad.date).diff(dayjs(), 's')
        if (maxAge <= 0) {
          return res.status(200).json({ message: 'Ad is stale' })
        }

        let uid = req.cookies.visitorId
        const sessionId = session?.id

        if (uid && !ad.viewedBy.includes(uid)) {
          await incrementViewCount(ad, uid)
        } else if (!uid && sessionId && !ad.viewedBy.includes(sessionId)) {
          await incrementViewCount(ad, sessionId)
        } else if (!uid && !sessionId) {
          uid = cryptoRandomString({ length: 32 })
          res.setHeader(
            'Set-Cookie',
            `visitorId=${uid}; httpOnly=true; Max-Age=31536000`, // 1-year expiration
          )
          await incrementViewCount(ad, uid)
        }

        return res.status(200).json({ message: 'Ad viewed successfully' })
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    default:
      return res.status(404).json({ message: 'Ad not found' })
  }
}
