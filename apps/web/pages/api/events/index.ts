import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import eventQueries from '../../../lib/helpers/queries/eventQuery'
import { dbConnect } from '@recycl/shared/dist/server/db'
import * as yup from 'yup'
import {
  validOrderBy,
  validSortOrder,
  eventVariants,
} from '../../../lib/helpers/eventHelpers'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { METHOD_NOT_ALLOWED } from '../../../lib/errors'
import { Variant, SortOrder, OrderBy } from '../../../lib/types/event'
import {
  paginationPageNumberSchema,
  paginationPageSizeSchema,
} from '../../../lib/validation'

const queryValidationSchema = yup.object({
  page: paginationPageNumberSchema,
  pageSize: paginationPageSizeSchema,
  sortOrder: yup
    .string<SortOrder>()
    .transform((value) => (validSortOrder[value] ? value : undefined))
    .default(validSortOrder.desc),
  sortProperty: yup
    .string<OrderBy>()
    .transform((value) => (validOrderBy[value] ? value : undefined))
    .default(validOrderBy.createdAt),
  variant: yup
    .string<Variant>()
    .transform((value) => (eventVariants[value] ? value : undefined))
    .default(eventVariants.active),
})

async function eventsHanlder(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })

  //check if user is authenticated
  const session = await getServerSession(req, res, authOptions)
  if (!session?.id) return res.status(401).end()

  const userId = session.id

  let validatedQuery = await queryValidationSchema.validate(req.query, {
    stripUnknown: true,
  })
  await dbConnect()
  const data = await eventQueries.getAll(validatedQuery, userId)
  res.json(data)
}

export default apiHandler(eventsHanlder)
