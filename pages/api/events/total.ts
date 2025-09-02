import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { Event } from '../../../lib/db/models/index'
import dbConnect from '../../../lib/db/connection'
import type { Variant } from '../../../lib/types/event'
import { eventVariants } from '../../../lib/helpers/eventHelpers'
import {
  apiHandler,
  METHOD_NOT_ALLOWED,
} from '../../../lib/helpers/errorHelpers'
const { active } = eventVariants

interface CountQuery {
  user: string
  isActive: boolean
}

const getCountQuery = (variant: Variant, user: string): CountQuery => {
  const status = variant === active ? true : false
  let countQuery: CountQuery = { user, isActive: status }

  return countQuery
}

async function countTotalEvents(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  const { variant } = req.query

  const countAll = getCountQuery(variant as Variant, session.id)

  await dbConnect()
  const total = await Event.countDocuments(countAll)
  return res.json(total)
}

export default apiHandler(countTotalEvents)
