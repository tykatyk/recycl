import { NextApiRequest, NextApiResponse } from 'next'
import { METHOD_NOT_ALLOWED } from '../../../lib/errors'
import { dbConnect, AdModel } from '@recycl/shared/dist/server/db'
import { apiHandler } from '../../../lib/helpers/errorHelpers'

async function adsPhoneViewHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  const { adId } = req.body
  if (!adId) return res.status(400).end()

  await dbConnect()
  const data = await AdModel.findById(adId)
  if (!data || data.status !== 'active') return res.status(404)

  res.json(data.contactPhone)
}

export default apiHandler(adsPhoneViewHandler)
