import SingleWasteAvailableAd from '../../components/applications/SingleWasteAvailableAd'
import {
  dbConnect,
  RemovalApplicationModel,
} from '@recycl/shared/dist/server/db'
import Layout from '../../components/layouts/Layout'

export default function wasteAvailableAd(props) {
  const { data } = props
  const { title } = data
  const brand = process.env.NEXT_PUBLIC_BRAND || ''
  const titleDescription = `${title} | Вторсырьё на ${brand}`

  return (
    <Layout title={`${titleDescription}`}>
      <SingleWasteAvailableAd data={data} />
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.query

  await dbConnect()

  const data = await RemovalApplicationModel.findById(id)
    .select(
      'title user wasteLocation.description wasteLocation.structured_formatting.main_text wasteType quantity contactPhone comment createdAt',
    )
    .populate('user', 'name')
    .lean()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      data: {
        ...data,
        _id: data._id.toString(),
        user: {
          ...data.user,
          _id: data.user._id.toString(),
        },
        createdAt: data.createdAt.toDateString(),
      },
    },
  }
}
