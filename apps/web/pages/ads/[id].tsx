import SingleWasteAvailableAd from '../../components/ads/SingleWasteAvailableAd'
import { dbConnect, AdModel } from '@recycl/shared/dist/server/db'
import { constants } from '@recycl/shared/dist'
import Layout from '../../components/layouts/Layout'
import { responseErrrorCodes } from '../../lib/helpers/errorHelpers'
import { Box, Button, Typography } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import { useRouter } from 'next/router'
import { isValidObjectId } from 'mongoose'
import Head from 'next/head'
import type { Ad } from '@recycl/shared/dist/server/db/models/ad'
import { useTranslations } from 'next-intl'
const { FORBIDDEN } = responseErrrorCodes

const { documentActivityStatus } = constants
const { active } = documentActivityStatus
const brand = process.env.NEXT_PUBLIC_BRAND || ''

function ContentNotAvailable() {
  const router = useRouter()
  const t = useTranslations('SingleWasteAvailableAdPage.ContentNotAvailable')

  return (
    <>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
      </Head>
      <Layout>
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
            <Typography component="h1" variant="h4" mb={3}>
              {t('title')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              sx={{ mb: 1 }}
              variant="contained"
              color="secondary"
              onClick={() => router.back()}
            >
              {t('backBtn')}
            </Button>
          </Box>
        </Box>
      </Layout>
    </>
  )
}
type WasteAvailableAdProps = {
  data: Ad & { _id: string }
  error: any
}
export default function WasteAvailableAd(props: WasteAvailableAdProps) {
  const { data, error } = props
  const t = useTranslations('SingleWasteAvailableAdPage')

  if (error) return <ContentNotAvailable />

  return (
    <>
      <Head>
        <title>{`${data.title} | ${t('wasteOn')} ${brand}`}</title>
        <meta
          name="description"
          content={`${data.title}. ${data.comment?.slice(0, 150)}`}
        />
      </Head>
      <Layout>
        <SingleWasteAvailableAd data={data} />
      </Layout>
    </>
  )
}

export async function getServerSideProps({ res, query, locale }) {
  const { id } = query

  if (!isValidObjectId(id)) {
    return {
      notFound: true,
    }
  }

  await dbConnect()

  const data = await AdModel.findById(id)
    .select(
      'status title user wasteLocation.description wasteLocation.structured_formatting.main_text wasteType quantity comment createdAt',
    )
    .populate('user', 'name')
    .lean()

  if (!data) {
    return {
      notFound: true,
    }
  }
  const messages = (await import(`../../messages/${locale}.json`)).default
  if (data.status !== active) {
    res.statusCode = 403
    return {
      props: {
        data: null,
        error: FORBIDDEN,
        messages,
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
      messages,
    },
  }
}
