import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { Event } from '../../../lib/db/models/index'
import dbConnect from '../../../lib/db/connection'
import type { Variant } from '../../../lib/types/event'
import { eventVariants } from '../../../lib/helpers/eventHelpers'
const { active } = eventVariants

interface CountQuery {
  user: string
  isActive: boolean
}

const getCountQuery = (variant: Variant, user: string): CountQuery => {
  console.log(variant)
  const status = variant === active ? true : false
  let countQuery: CountQuery = { user, isActive: status }

  return countQuery
}

export default async function CountTotalEvents(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.id) {
    res.status(401).end()
    return
  }

  const { variant } = req.query

  const countAll = getCountQuery(variant as Variant, session.id)

  try {
    await dbConnect()
    const total = await Event.countDocuments(countAll)
    res.json(total)
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'An error occurred while counting events' })
  }
}
