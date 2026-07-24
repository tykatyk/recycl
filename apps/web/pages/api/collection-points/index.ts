import { NextApiRequest, NextApiResponse } from 'next'
import * as yup from 'yup'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { METHOD_NOT_ALLOWED } from '../../../lib/errors'
import { getCollectionPointClusters } from '../../../lib/helpers/collectionPointsClusterMaker'
import type { BBox } from '@recycl/shared/dist/server/types'

const minZoom = 0
const maxZoom = 22

const queryValidationSchema = yup.object({
  bbox: yup
    .array()
    .of(yup.number().required().min(-180).max(180))
    .required()
    .min(4)
    .max(4),
  zoom: yup.number().required().min(minZoom).max(maxZoom),
  wasteType: yup.string().default('all').required().max(255),
})

async function collectionPointsHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  const { bbox: bboxRaw, zoom: zoomRaw, wasteType } = req.query

  if (
    typeof bboxRaw !== 'string' ||
    typeof zoomRaw !== 'string' ||
    typeof wasteType !== 'string'
  ) {
    return res.status(400).end()
  }

  const bbox = bboxRaw.split(',').map(Number) as [
    number,
    number,
    number,
    number,
  ]

  const zoom = Number(zoomRaw)

  await queryValidationSchema.validate(
    { bbox, zoom, wasteType },
    {
      stripUnknown: true,
    },
  )

  const clusters = await getCollectionPointClusters(
    bbox as BBox,
    zoom,
    wasteType,
  )
  console.log('clusters')
  console.log(clusters)
  return res.json({ clusters })
}

export default apiHandler(collectionPointsHandler)
