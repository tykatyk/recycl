import MyEvents from '../../../components/events/MyEvents'
import { Variant } from '../../../lib/types/event'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

export default function ShowMyEvents({
  variant,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <MyEvents variant={variant} />
}

export const getServerSideProps = (async () => {
  return {
    props: { variant: 'active' },
  }
}) satisfies GetServerSideProps<{ variant: Variant }>
