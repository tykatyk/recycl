import SingleCollectionPoint from '../../components/collectionPoints/SingleCollectionPoint'
import { CollectionPointModel, dbConnect } from '@recycl/shared/dist/server/db'
import { constants } from '@recycl/shared/dist'
import Layout from '../../components/layouts/Layout'
import { responseErrorCodes } from '../../lib/helpers/responses'
import { Box, Button, Typography } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import { useRouter } from 'next/router'
import { isValidObjectId } from 'mongoose'
import Head from 'next/head'
import Link from '../../components/uiParts/Link'
import { useTranslations } from 'use-intl'
const { FORBIDDEN } = responseErrorCodes

const { documentActivityStatus } = constants
const { active } = documentActivityStatus
const brand = process.env.NEXT_PUBLIC_BRAND || ''
const collectionPointsListUrl = '/collection-points/list'

function ContentNotAvailableView() {
  const router = useRouter()
  const { locale } = router
  const t = useTranslations('CollectionPointPage')

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
          <BlockIcon fontSize="large" />
        </Box>
        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
          {t('errorTitle')}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          component={Link}
          sx={{ mb: 1 }}
          variant="contained"
          color="secondary"
          href={collectionPointsListUrl}
          locale={locale}
        >
          {t('vieOtherBtn')}
        </Button>
      </Box>
    </Box>
  )
}

export default function CollectionPoint(props) {
  const { data, error } = props
  const t = useTranslations('CollectionPointPage')

  if (error) {
    return (
      <>
        <Head>
          <title>{`${t('errorTitle')} | ${brand}`}</title>
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
        <title>{`${t('successTitle', { description: data.location.description })} | ${brand}`}</title>
        <meta name="description" content={t('successTitle')} />
      </Head>
      <Layout>
        <SingleCollectionPoint data={data} />
      </Layout>
    </>
  )
}

export async function getServerSideProps({ res, locale, query }) {
  const { id } = query

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
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  }
}
