import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from '../../../lib/db/models'
import dbConnect from '../../../lib/db/connection'
import { apiHandler } from '../../../lib/helpers/errorHelpers'

const subscriptionTypes = ['wasteAvailable', 'mobileStationAvailable']
const allowedView = new Map<string, string[]>()
allowedView.set('subscriptions', subscriptionTypes)

type Projection = {
  name: string | string[] | undefined
  filter: string | string[] | undefined
}

const verifyProjection = (projection: Projection) => {
  const { name, filter } = projection
  if (!name || Array.isArray(name) || !filter || Array.isArray(filter)) {
    return false
  }

  const allowedFilters = allowedView.get(name)
  if (!allowedFilters || !allowedFilters.includes(filter)) return false

  return true
}

const getUsers = async (projection: Projection) => {
  switch (projection.name) {
    case 'subscriptions': {
      return await User.find({
        isBanned: false,
        isActive: true,
        subscriptions: projection.filter,
      })
        .select('_id name email')
        .lean()
    }
  }
}

async function users(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()
  await dbConnect()

  switch (req.method) {
    case 'GET': {
      const { view, filter } = req.query

      const projection = {
        name: view,
        filter,
      }

      if (!verifyProjection(projection)) {
        return res.status(400).json('Unknown view query')
      }

      const users = await getUsers(projection)

      return res.json(users)
    }

    default: {
      return res.status(405).end()
    }
  }
}

export default apiHandler(users)
