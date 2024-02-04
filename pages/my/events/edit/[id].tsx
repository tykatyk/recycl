import CreateUpdate from '../../../../components/events/CreateUpdate'
import { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import type { Event } from '../../../../lib/types/event'
import type { Waste } from '../../../../lib/types/waste'
import queries from '../../../../lib/db/queries'
import eventModel from '../../../../lib/db/models/eventModel'
import dbConnect from '../../../../lib/db/connection'
import { getSession } from 'next-auth/react'
import { ParsedUrlQuery } from 'querystring'

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

  if (!session?.user)
    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
    }

  const { id } = context.params as Params

  await dbConnect()
  const event = await eventModel.findOne({ _id: id, user: session.id })
  if (!event) {
    return {
      notFound: true,
    }
  }
  const wasteTypes = await queries.wasteType.getAll()

  return {
    props: {
      event: JSON.parse(JSON.stringify(event)) as Event,
      wasteTypes: JSON.parse(JSON.stringify(wasteTypes)) as [Waste],
    },
  }
}) satisfies GetServerSideProps<{
  event: Event
  wasteTypes: [Waste]
}>
