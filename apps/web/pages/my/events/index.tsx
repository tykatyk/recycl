import { getSession } from 'next-auth/react'
import MyEvents from '../../../components/events/MyEvents'
import { Variant } from '../../../lib/types/event'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

export default function MyEventsIndexPage({
  variant,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <MyEvents variant={variant} />
}

export const getServerSideProps = (async (context) => {
  const { resolvedUrl, req, query } = context

  const session = await getSession({ req })

  if (!session?.user)
    return {
      redirect: {
        permanent: false,
        destination: `/auth/login?from=${encodeURIComponent(resolvedUrl)}`,
      },
    }

  const { variant } = query

  const validatedVariant: Variant =
    variant === 'inactive' ? 'inactive' : 'active'

  return {
    props: {
      variant: validatedVariant,
    },
  }
}) satisfies GetServerSideProps<{ variant: Variant }>
