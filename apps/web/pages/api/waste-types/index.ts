import { WasteType, dbConnect } from '@recycl/shared/dist/server/db/'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import type { NextApiRequest, NextApiResponse } from 'next/types'

async function wasteTypes(req: NextApiRequest, res: NextApiResponse) {
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
