import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { WasteType, dbConnect } from '@recycl/shared/dist/server/db/'
import { apiHandler } from '../../../lib/helpers/errorHelpers'

async function wasteTypes(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()

  switch (req.method) {
    case 'GET': {
      const data = await WasteType.find().lean()
      return res.json(data)
    }

    default: {
      return res.status(405).end()
    }
  }
}

export default apiHandler(wasteTypes)
