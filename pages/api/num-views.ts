import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { eventValidationSchema } from '../../lib/validation/eventFormValidator'
import eventModel from '../../lib/db/models/eventModel'
import {
  errorResponse,
  perFormErrorResponse,
} from '../../lib/helpers/responses'
import dbConnect from '../../lib/db/connection'
import { cookies } from 'next/headers'
import cryptoRandomString from 'crypto-random-string'
import { serialize } from 'mongodb'

export default async function Events(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'POST') {
    await dbConnect()

    const { adType, adId } = req.body // Get the ad ID from the request

    switch (adType) {
      case 'event':
        try {
          // Check if the IP address has already viewed this ad
          const ad = await eventModel.findById(adId)
          if (!ad) {
            return res.status(404).json({ message: 'Ad not found' })
          }

          // Increment the view count if the visitor is unique
          let uid = req.cookies.visitorId //ToDo: check cookie type
          if (!uid) {
            uid = cryptoRandomString({ length: 32 })
            res.setHeader(
              'Set-Cookie',
              'visitorId=visitorId; httpOnly=true; maxAge=31536000',
            )
          }

          if (!ad.viewedBy.includes(uid)) {
            ad.viewedBy.push(uid)
            ad.viewCount += 1
            await ad.save()
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
}
