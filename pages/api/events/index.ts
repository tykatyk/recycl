import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import eventQueries from '../../../lib/db/queries/eventQuery'
import dbConnect from '../../../lib/db/connection'
import * as yup from 'yup'
import {
  rowsPerPageOptions,
  validOrderBy,
  validSortOrder,
  eventVariants,
} from '../../../lib/helpers/eventHelpers'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { Variant, SortOrder, OrderBy } from '../../../lib/types/event'

const queryValidationSchema = yup.object({
  page: yup
    .number()
    .transform((value) => (value === '' || isNaN(value) ? undefined : value))
    .integer()
    .min(0)
    .default(0),
  pageSize: yup
    .number()
    .transform((value) => (value === '' || isNaN(value) ? undefined : value))
    .integer()
    .min(rowsPerPageOptions[0])
    .max(rowsPerPageOptions[Math.max(rowsPerPageOptions.length - 1, 0)])
    .default(rowsPerPageOptions[0]),
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
    return res.status(405).json({ error: 'Method not allowed' })

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
