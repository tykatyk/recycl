//this component is intended to unsubscribe users by token
//currently not used because unsubscribe is maintained by email provider

import Layout from '../layouts/Layout'
import { Grid } from '@mui/material'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import { ReactElement, useEffect, useState } from 'react'
import CustomSnackbar from '../uiParts/Snackbars'
import SuccessfullUnsubscribe from '../subscriptions/SuccsesfulUnsubscribe'
import TokenNotFound from '../subscriptions/TokenNotFound'
import TokenExpiredOrUsed from '../subscriptions/TokenExpiredOrUsed'
import {
  type ApiResponseStatus,
  responseErrorCodes,
  responseStatuses,
} from '../../lib/helpers/responses'
import Head from 'next/head'
import { useRouter } from 'next/router'

const { NOT_FOUND, EXPIRED } = responseErrorCodes
const { SUCCESS, ERROR } = responseStatuses
const titleHeading = 'Отписаться от рассылки'
const errorMessge = 'Что то пошло не так'
const unsubscribeRoute = '/api/my/subscriptions/unsubscribe'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

const ShowUnsubscibe = ({
  data,
  token,
}: {
  data: ApiResponseStatus
  token: string
}) => {
  switch (data.status) {
    case SUCCESS:
      return <SuccessfullUnsubscribe />

    case ERROR: {
      if (data.error.code === NOT_FOUND) {
        return <TokenNotFound />
      }
      if (data.error.code === EXPIRED) {
        return <TokenExpiredOrUsed token={token} />
      }
      break
    }
    default:
      return null
  }
}

export default function Unsubscribe() {
  const router = useRouter()
  let content: ReactElement | null = null

  const token = router.query.token
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [data, setData] = useState<ApiResponseStatus | null>(null)
  // const t = useTranslations('UnsubscribePage')

  useEffect(() => {
    const handler = async () => {
      if (typeof token !== 'string') return

      try {
        setLoading(true)

        const queryString = new URLSearchParams({ token }).toString()
        const urlWithParams = `${unsubscribeRoute}?${queryString}`

        const response = await fetch(urlWithParams)
        if (!response.ok) {
          setError(errorMessge)
          return
        }
        const data = (await response.json()) as ApiResponseStatus

        setData(data)
      } catch (error) {
        setError(errorMessge)
      } finally {
        setLoading(false)
      }
    }
    handler()
  }, [token])

  if (typeof token !== 'string') return null

  if (loading) {
    content = <PageLoadingCircle />
  } else if (data) {
    content = <ShowUnsubscibe data={data} token={token} />
  } else {
    content = null
  }

  return (
    <>
      <Head>
        <title>{`${titleHeading} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        {/*--maybe use Box instead of Grid--*/}
        <Grid
          container
          direction="column"
          sx={{
            margin: '0 auto',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {content}

          <CustomSnackbar
            severity={'error'}
            open={!!error}
            message={error}
            handleClose={() => {
              setError('')
            }}
          />
        </Grid>
      </Layout>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}`)).default,
    },
  }
}
