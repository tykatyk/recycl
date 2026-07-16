import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  dbConnect,
  WasteRemovalEventModel,
} from '@recycl/shared/dist/server/db'
import type { AdActions } from '../../../lib/types/collectionPoint'
import { eventActions } from '../../../lib/helpers/eventHelpers'
import { METHOD_NOT_ALLOWED } from '../../../lib/errors'

const { activate } = eventActions

export default async function EventMassDeactivation(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).end()
    return
  }

  if (req.method === 'POST') {
    await dbConnect()

    const {
      eventIds,
      action,
    }: {
      eventIds: string[]
      action: keyof Pick<AdActions, 'activate' | 'deactivate'>
    } = req.body

    if (!Array.isArray(eventIds) || eventIds.length < 1) {
      res
        .status(400)
        .json({ error: `Expected an array of ids but got ${eventIds}` })
      return
    }

    try {
      await WasteRemovalEventModel.updateMany(
        { user: session.id, _id: { $in: eventIds } },
        { isActive: action === activate ? true : false },
      )
    } catch (e) {
      console.log(e)
      res
        .status(500)
        .json({ error: 'An error occurred while inactivating ads' })
      return
    }

    res.status(200).json({ message: 'Ads successfully deactivated' })
  } else {
    res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }
}
