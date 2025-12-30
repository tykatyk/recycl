import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from '../../../lib/db/models'
import dbConnect from '../../../lib/db/connection'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { array, string } from 'yup'
const subscriptionTypes = ['wasteAvailable', 'mobileStationAvailable'] as const
const subscriptionFields = '-_id subscriptions'

async function mySubscriptions(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()

  switch (req.method) {
    case 'POST': {
      const validationSchema = array()
        .of(string().oneOf(subscriptionTypes))
        .defined()

      const subscriptions = req.body.updatedSubs

      if (!(await validationSchema.isValid(subscriptions))) {
        return res.status(400).end()
      }

      await User.findOneAndUpdate(
        {
          _id: session.id,
        },
        {
          subscriptions,
        },
      )
        .select(subscriptionFields)
        .lean()

      return res.status(200).json("User's subscriptions updated")
    }
    case 'GET': {
      const subscriptions = await User.findOne({
        _id: session.id,
      })
        .select(subscriptionFields)
        .lean()

      return res.json(subscriptions)
    }

    default: {
      return res.status(405).end()
    }
  }
}

export default apiHandler(mySubscriptions)
