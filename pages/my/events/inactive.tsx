import React from 'react'
import Events from '../../../components/events/Events'
import type { EventProps } from '../../../lib/types/event'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

export default function InactiveEvents({ variant }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <Events variant={variant} />
}

export const getServerSideProps = (async () => {
  return {
    props: { variant: 'inactive' },
  }
}) satisfies GetServerSideProps<EventProps>
