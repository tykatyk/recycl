import type { Event as RecycleEvent } from '../../lib/types/event'
import ShowSingleEvent from '../../components/events/ShowSingleEvent'
import dbConnect from '../../lib/db/connection'
import eventModel from '../../lib/db/models/eventModel'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { isValidObjectId } from 'mongoose'

interface Params extends ParsedUrlQuery {
  id: string
}

interface NotFoundRedirect {
  notFound: true
}

export default function EventCreateUpdateUI({
  event,
}: {
  event: RecycleEvent | null
}) {
  return <ShowSingleEvent event={event} />
}

export const getServerSideProps = (async (context) => {
  const { id: adId } = context.params as Params
  const notFoundRedirect: NotFoundRedirect = {
    notFound: true,
  }

  if (!isValidObjectId(adId)) {
    return notFoundRedirect
  }

  await dbConnect()

  try {
    // Check if the IP address has already viewed this ad
    const ad = await eventModel.findById(adId).populate(['user', 'waste'])
    if (!ad) {
      return notFoundRedirect
    }

    return {
      props: {
        event: JSON.parse(JSON.stringify(ad)) as RecycleEvent,
      },
    }
  } catch (error) {
    console.log(error)
    return {
      props: {
        event: null,
      },
    }
  }
}) satisfies GetServerSideProps<
  | {
      event: RecycleEvent | null
    }
  | NotFoundRedirect
>
