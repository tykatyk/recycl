import { NextApiRequest, NextApiResponse } from 'next'
import { METHOD_NOT_ALLOWED } from '../../../../lib/errors'
import {
  dbConnect,
  UserModel,
  AdModel,
  CollectionPointModel,
  SubscriptionModel,
} from '@recycl/shared/dist/server/db'
import { apiHandler } from '../../../../lib/helpers/errorHelpers'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'

async function deleteUserHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).end()
    return
  }
  const userId = session.id
  await dbConnect()
  await Promise.all([
    AdModel.deleteMany({ user: userId }).exec(),
    CollectionPointModel.deleteMany({ user: userId }).exec(),
    SubscriptionModel.deleteMany({ user: userId }).exec(),
  ])

  const result = await UserModel.deleteOne({ _id: userId })

  if (result.deletedCount === 0) {
    return res.status(404).end()
  }

  res.status(204).end()
}

export default apiHandler(deleteUserHandler)
