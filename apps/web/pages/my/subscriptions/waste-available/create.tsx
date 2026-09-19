import { getServerSession } from 'next-auth'
import CreateUpdateWasteAvailableSubscription from '../../../../components/subscriptions/CreateUpdateWasteAvailableSubscription'
import { authOptions } from '../../../api/auth/[...nextauth]'
export default function SubscriptionCreate() {
  return <CreateUpdateWasteAvailableSubscription action="create" />
}

export async function getServerSideProps({ req, res, locale, resolvedUrl }) {
  //ToDo: add server side data fetching
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?from=${encodeURIComponent(resolvedUrl)}`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      messages: (await import(`../../../../messages/${locale}`)).default,
    },
  }
}
