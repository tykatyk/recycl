import SingleCollectionPoint from '../../components/collectionPoints/SingleCollectionPoint'
import { CollectionPointModel, dbConnect } from '@recycl/shared/dist/server/db'
import { constants } from '@recycl/shared/dist'
import Layout from '../../components/layouts/Layout'
import { FORBIDDEN } from '../../lib/errors'
import { Box, Button, Typography } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import { useRouter } from 'next/router'
import { isValidObjectId } from 'mongoose'
import Head from 'next/head'

const { documentActivityStatus } = constants
const { active } = documentActivityStatus
const headerText = 'Это объявление не активно'
const backButtonText = 'Назад'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

function ContentNotAvailableView() {
  const router = useRouter()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box
          sx={{
            mb: 1,
          }}
        >
          <BlockIcon fontSize="large" color="error" />
        </Box>
        <Typography component="h1" variant="h5" mb={3}>
          {headerText}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          sx={{ mb: 1 }}
          variant="contained"
          color="secondary"
          onClick={() => router.back()}
        >
          {backButtonText}
        </Button>
      </Box>
    </Box>
  )
}

export default function CollectionPoint(props) {
  const { data, error } = props

  if (error) {
    return (
      <>
        <Head>
          <title>{`Обьявление больше не доступно | ${brand}`}</title>
        </Head>
        <Layout>
          <ContentNotAvailableView />
        </Layout>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{`Пункт приема вторсырья ${data.location.description} | ${brand}`}</title>
        <meta
          name="description"
          content={`Пункт приема вторсырья. ${data.location.description}`}
        />
      </Head>
      <Layout>
        <SingleCollectionPoint data={data} />
      </Layout>
    </>
  )
}

export async function getServerSideProps(context) {
  const { res } = context
  const { id } = context.query

  if (!isValidObjectId(id)) {
    return {
      notFound: true,
    }
  }

  await dbConnect()

  const data = await CollectionPointModel.findById(id)
    .select(
      'status user location.description wasteLocation.structured_formatting.main_text wasteTypes comment createdAt',
    )
    .populate('user', 'name')
    .lean()

  if (!data) {
    return {
      notFound: true,
    }
  }

  if (data.status !== active) {
    res.statusCode = 403
    return {
      props: {
        data: null,
        error: FORBIDDEN,
      },
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
