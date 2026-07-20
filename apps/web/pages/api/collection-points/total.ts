import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect, CollectionPointModel } from '@recycl/shared/dist/server/db'
import type { Variant } from '../../../lib/types/pagination'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { METHOD_NOT_ALLOWED } from '../../../lib/errors'
import { documentActivityStatus } from '@recycl/shared/dist/constants'
const { active } = documentActivityStatus

interface CountQuery {
  user: string
  isActive: boolean
}

const getCountQuery = (variant: Variant, user: string): CountQuery => {
  const status = variant === active ? true : false
  let countQuery: CountQuery = { user, isActive: status }

  return countQuery
}

async function countTotalCollectionPoints(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  const { variant } = req.query

  const countAll = getCountQuery(variant as Variant, session.id)

  await dbConnect()
  const total = await CollectionPointModel.countDocuments(countAll)
  return res.json(total)
}

export default apiHandler(countTotalCollectionPoints)
