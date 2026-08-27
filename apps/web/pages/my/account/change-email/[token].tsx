import { dbConnect, UserModel } from '@recycl/shared/dist/server/db'
import LayoutWithoutHeader from '../../../../components/layouts/LayoutWithoutHeader'
import { Box, Alert, Button } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'

type ChangeEmailProps = {
  urlIsValid: boolean
}

const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function ChangeEmail(props: ChangeEmailProps) {
  const { urlIsValid } = props
  const router = useRouter()
  const { locale } = router
  const t = useTranslations('ChangeEmailPage')

  return (
    <>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <LayoutWithoutHeader>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              '&>*': {
                mb: 3,
              },
            }}
          >
            <Box>
              <Alert
                variant="filled"
                severity={urlIsValid ? 'success' : 'error'}
                sx={{ color: '#fff' }}
              >
                {urlIsValid ? t('successMessage') : t('errorMessage')}
              </Alert>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                onClick={() => router.push('/', undefined, { locale })}
                sx={{ color: '#fff' }}
                variant={'outlined'}
              >
                {t('homeBtn')}
              </Button>
            </Box>
          </Box>
        </Box>
      </LayoutWithoutHeader>
    </>
  )
}

export async function getServerSideProps({ query, locale }) {
  await dbConnect()
  const user = await UserModel.findOne({
    resetEmailToken: query.token,
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  const { resetEmailExpires, newEmail } = user
  const urlIsValid =
    resetEmailExpires && new Date(resetEmailExpires) >= new Date()

  user.resetEmailToken = undefined
  user.resetEmailExpires = undefined
  user.newEmail = undefined
  if (newEmail && urlIsValid) {
    user.email = newEmail
  }

  await user.save()

  return {
    props: {
      urlIsValid: true,
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  }
}
