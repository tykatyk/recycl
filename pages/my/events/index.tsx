import Events from '../../../components/events/Events'
import { EventProps } from '../../../lib/types/event'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

export default function ActiveEvents({
  variant,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <Events variant={variant} />
}

export const getServerSideProps = (async (context) => {
  return {
    props: { variant: 'active' },
  }
}) satisfies GetServerSideProps<EventProps>
