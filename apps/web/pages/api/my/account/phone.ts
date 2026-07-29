import { NextApiRequest, NextApiResponse } from 'next'
import { METHOD_NOT_ALLOWED } from '../../../../lib/errors'
import { dbConnect, UserModel } from '@recycl/shared/dist/server/db'
import { apiHandler } from '../../../../lib/helpers/errorHelpers'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'

async function userPhoneViewHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).end()
    return
  }

  await dbConnect()
  const user = await UserModel.findById(session.id)
  if (!user) return res.status(404)

  res.json({ phone: user.phone })
}

export default apiHandler(userPhoneViewHandler)
