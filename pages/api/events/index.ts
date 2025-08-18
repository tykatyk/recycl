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
import { Variant, SortOrder, OrderBy } from '../../../lib/types/event'

export default async function Events(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed' })

  //check if user is authenticated
  const session = await getServerSession(req, res, authOptions)
  if (!session?.id) return res.status(401).end()

  const userId = session.id

  const querySchema = yup.object({
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
      .transform((value) =>
        validSortOrder.indexOf(value) >= 0 ? value : undefined,
      )
      .default('desc'),
    sortProperty: yup
      .string<OrderBy>()
      .transform((value) =>
        validOrderBy.indexOf(value) >= 0 ? value : undefined,
      )
      .default('createdAt'),
    variant: yup
      .string<Variant>()
      .transform((value) => (eventVariants[value] ? value : undefined))
      .default(eventVariants.active),
  })

  try {
    let validatedQuery = await querySchema.validate(req.query, {
      stripUnknown: true,
    })
    await dbConnect()
    const data = await eventQueries.getAll(validatedQuery, userId)
    return res.json(data)
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return res.status(400).json({ error: err.errors })
    }
    console.log(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
