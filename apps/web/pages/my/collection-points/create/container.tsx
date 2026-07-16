import {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  GetServerSideProps,
} from 'next'
import { Waste } from '../../../../lib/types/waste'
import queries from '../../../../lib/helpers/queries'
import { dbConnect } from '@recycl/shared/dist/server/db'
import { getServerSidePropsHandler } from '../../../../lib/helpers/errorHelpers'
import { getSession } from 'next-auth/react'
import Layout from '../../../../components/layouts/Layout'
// import EventCreateUpdateUI from '../../../events/[id]'
import CollectionPointContainerForm from '../../../../components/collectionPoints/CollectionPointContainerForm'

export default function CreateContainerCollectionPoint(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { collectionPoint } = props

  const title = collectionPoint
    ? 'Редактировать пункт приема вторсырья | Recycl'
    : 'Добавить пункт приема вторсырья | Recycl'

  return (
    <Layout title={title}>
      <CollectionPointContainerForm {...props} />
    </Layout>
  )
}

const callback = (async (context: GetServerSidePropsContext) => {
  const session = await getSession({ req: context.req })
  if (!session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/login?from=${encodeURIComponent(context.resolvedUrl)}`,
      },
    }
  }

  await dbConnect()

  const wasteTypes = await queries.wasteType.getAll()
  const userId = session.id
  const user = await queries.user.getById(userId, session.user)
  const userPhone = (user?.phone as string) || ''

  return {
    props: {
      wasteTypes: JSON.parse(JSON.stringify(wasteTypes)) as Waste[],
      userPhone,
    },
  }
}) satisfies GetServerSideProps<{
  wasteTypes: Waste[]
  userPhone: string
}>

export const getServerSideProps = getServerSidePropsHandler(callback)
