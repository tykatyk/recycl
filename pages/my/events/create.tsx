import CreateUpdate from '../../../components/events/CreateUpdate'
import { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { Waste } from '../../../lib/types/waste'
import queries from '../../../lib/db/queries'
import dbConnect from '../../../lib/db/connection'
import { getSession } from 'next-auth/react'

export default function CreateEvent({
  wasteTypes,
  userPhone,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <CreateUpdate wasteTypes={wasteTypes} userPhone={userPhone} />
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

  await dbConnect()

  const wasteTypes = await queries.wasteType.getAll()
  const userId = session?.id
  const user = await queries.user.getById(userId, session.user)
  const userPhone = user.phone as string

  return {
    props: {
      wasteTypes: JSON.parse(JSON.stringify(wasteTypes)) as [Waste],
      userPhone,
    },
  }
}) satisfies GetServerSideProps<{
  wasteTypes: [Waste]
  userPhone?: string
}>
