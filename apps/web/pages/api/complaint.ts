import { NextApiRequest, NextApiResponse } from 'next'
import { METHOD_NOT_ALLOWED } from '../../lib/errors'
import { dbConnect, ComplaintModel } from '@recycl/shared/dist/server/db'
import { apiHandler } from '../../lib/helpers/errorHelpers'
import { complaintFormSchema } from '../../lib/validation/complaintForm'
import { authOptions } from './auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'

async function complaintHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  const validated = await complaintFormSchema.validate(req.body, {
    abortEarly: false,
  })

  const { complaint, complaintUrl } = validated

  const session = await getServerSession(req, res, authOptions)

  const forwarded = req.headers['x-forwarded-for']
  const userIp =
    typeof forwarded === 'string'
      ? forwarded.split(',')[0]?.trim()
      : req.socket.remoteAddress

  await dbConnect()
  await ComplaintModel.create({
    complaint: complaint.trim(),
    complaintUrl,
    userIp,
    ...(session ? { userId: session.id } : {}),
  })
  res.status(204).end()
}

export default apiHandler(complaintHandler)
