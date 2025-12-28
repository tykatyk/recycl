import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from '../../../lib/db/models'
import dbConnect from '../../../lib/db/connection'
import { apiHandler } from '../../../lib/helpers/errorHelpers'

async function mySubscriptions(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()

  if (req.method === 'GET') {
    const subscriptions = await User.findOne({
      _id: session.id,
    })
      .select('-_id subscriptions')
      .lean()

    return res.json(subscriptions)
  }
}

export default apiHandler(mySubscriptions)
