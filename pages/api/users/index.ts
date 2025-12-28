import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from '../../../lib/db/models'
import dbConnect from '../../../lib/db/connection'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { array, string } from 'yup'

async function users(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()
  await dbConnect()

  switch (req.method) {
    case 'POST': {
      const validationSchema = array().of(string())
      if (!validationSchema.isValid(req.body.updatedSubs)) {
        return res.status(400).end()
      }
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: session.id,
        },
        {
          subscriptions: req.body.updatedSubs,
        },
      )
        .select('subscriptions')
        .lean()
      console.log(updatedUser)
      return res.json(updatedUser)
    }

    default: {
      return res.status(405).end()
    }
  }
}

export default apiHandler(users)
