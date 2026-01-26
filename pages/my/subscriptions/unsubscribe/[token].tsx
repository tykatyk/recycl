import Layout from '../../../../components/layouts/Layout'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import PageLoadingCircle from '../../../../components/uiParts/PageLoadingCircle'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import CustomSnackbar from '../../../../components/uiParts/Snackbars'
import SuccessfullUnsubscribe from '../../../../components/subscriptions/SuccsesfulUnsubscribe'
import TokenNotFound from '../../../../components/subscriptions/TokenNotFound'
import TokenExpired from '../../../../components/subscriptions/TokenExpiredOrUsed'
import type { UnsubscribeApiResponse } from '../../../../lib/subscriptions/types'

const titleHeading = 'Отписаться от рассылки'
const errorMessge = 'Ошибка при загрузке данных'
const unsubscribeRoute = '/api/subscriptions/unsubscribe'

const ShowUnsubscibe = ({
  data,
  token,
}: {
  data: UnsubscribeApiResponse | null
  token: string
}) => {
  if (!data) {
    return null
  }

  if (data.status === 'SUCCESS') {
    return <SuccessfullUnsubscribe />
  }

  if (data.status === 'ERROR') {
    switch (data.error) {
      case 'TOKEN_NOT_FOUND':
        return <TokenNotFound />
      case 'TOKEN_USED':
        return <TokenExpired token={token} />
      case 'TOKEN_EXPIRED':
        return <TokenExpired token={token} />
      case 'USER_NOT_FOUND':
        return null
      case 'SUBSCRIPTION_NOT_FOUND':
        return null
      default:
        return null
    }
  }
  return null
}

export default function Unsubscribe() {
  const router = useRouter()
  let content: ReactElement | null = null

  const token = router.query.token
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [data, setData] = useState<UnsubscribeApiResponse | null>(null)

  const dataFetcher = useCallback(async () => {
    if (typeof token !== 'string') return null

    const queryString = new URLSearchParams({ token }).toString()
    const urlWithParams = `${unsubscribeRoute}?${queryString}`

    const response = await fetch(urlWithParams)
    if (!response.ok) {
      setError(errorMessge)
      return null
    }
    const data = (await response.json()) as UnsubscribeApiResponse
    return data
  }, [token])

  useEffect(() => {
    if (typeof token !== 'string') return

    setLoading(true)
    dataFetcher()
      .then((data) => {
        // setData(data)
        setData({ status: 'ERROR', error: 'TOKEN_EXPIRED' })
      })
      .catch((_) => {
        setError(errorMessge)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  if (typeof token !== 'string') return null

  if (loading) {
    content = <PageLoadingCircle />
  } else {
    content = <ShowUnsubscibe data={data} token={token} />
  }

  return (
    <Layout title={`${titleHeading} | ${process.env.NEXT_PUBLIC_BRAND}`}>
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
  )
}
