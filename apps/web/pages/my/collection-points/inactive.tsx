import Events from '../../../components/collectionPoints/MyEvents'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { documentActivityStatus } from '@recycl/shared/dist/constants'

export default function InactiveEvents({
  variant,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <Events variant={variant} />
}

export const getServerSideProps = (async () => {
  return {
    props: { variant: 'disabled' },
  }
}) satisfies GetServerSideProps<{
  variant: keyof typeof documentActivityStatus
}>
