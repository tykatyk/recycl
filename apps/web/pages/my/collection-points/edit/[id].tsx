import CreateUpdate from '../../../../components/collectionPoints/CreateUpdate'
import { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import type { CollectionPoint } from '../../../../lib/types/collectionPoint'
import type { Waste } from '../../../../lib/types/waste'
import queries from '../../../../lib/helpers/queries'
import { CollectionPointModel, dbConnect } from '@recycl/shared/dist/server/db'
import { getSession } from 'next-auth/react'
import { ParsedUrlQuery } from 'querystring'
import { isValidObjectId } from 'mongoose'

interface Params extends ParsedUrlQuery {
  id: string
}

export default function UpdateEvent({
  event,
  wasteTypes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <CreateUpdate event={event} wasteTypes={wasteTypes} />
}

export const getServerSideProps = (async (context) => {
  const session = await getSession({ req: context.req })
  const { resolvedUrl } = context

  if (!session?.user)
    return {
      redirect: {
        permanent: false,
        destination: `/auth/login?from=${encodeURIComponent(resolvedUrl)}`,
      },
    }

  const { id } = context.params as Params
  if (!isValidObjectId(id)) {
    return {
      notFound: true,
    }
  }

  await dbConnect()
  const event = await CollectionPointModel.findOne({
    _id: id,
    user: session.id,
  })
  if (!event) {
    return {
      notFound: true,
    }
  }
  const wasteTypes = await queries.wasteType.getAll()

  return {
    props: {
      event: JSON.parse(JSON.stringify(event)) as CollectionPoint,
      wasteTypes: JSON.parse(JSON.stringify(wasteTypes)) as [Waste],
    },
  }
}) satisfies GetServerSideProps<{
  event: CollectionPoint
  wasteTypes: [Waste]
}>
