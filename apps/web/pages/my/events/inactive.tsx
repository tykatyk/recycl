import Events from '../../../components/events/MyEvents'
import type { Variant } from '../../../lib/types/event'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

export default function InactiveEvents({
  variant,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <Events variant={variant} />
}

export const getServerSideProps = (async () => {
  return {
    props: { variant: 'inactive' },
  }
}) satisfies GetServerSideProps<{ variant: Variant }>
