import Layout from '../../../../components/layouts/Layout'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import PageLoadingCircle from '../../../../components/uiParts/PageLoadingCircle'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import CustomSnackbar from '../../../../components/uiParts/Snackbars'
import SuccessfullUnsubscribe from '../../../../components/subscriptions/SuccsesfulUnsubscribe'
import TokenNotFound from '../../../../components/subscriptions/TokenNotFound'
import TokenExpired from '../../../../components/subscriptions/TokenExpired'

const titleHeading = 'Отписаться от рассылки'
const errorMessge = 'Ошибка при загрузке данных'
const unsubscribeRoute = '/api/subscriptions/unsubscribe'

type TokenData = {
  message: 'tokenNotFound' | 'tokenUsed' | 'tokenExpired' | 'ok'
} | null

const ShowUnsubscibe = ({
  data,
  token,
}: {
  data: TokenData
  token: string
}) => {
  if (!data) {
    return null
  }

  const message = data.message.toLowerCase()

  switch (message) {
    case 'tokennotfound':
      return <TokenNotFound />
    case 'tokenused':
      return <TokenExpired token={token} />
    case 'tokenexpired':
      return <TokenExpired token={token} />
    case 'ok':
      return <SuccessfullUnsubscribe />
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
  const [data, setData] = useState<TokenData>(null)

  const dataFetcher = useCallback(async () => {
    if (typeof token !== 'string') return null

    const queryString = new URLSearchParams({ token }).toString()
    const urlWithParams = `${unsubscribeRoute}?${queryString}`

    const response = await fetch(urlWithParams)
    if (!response.ok) {
      setError(errorMessge)
      return null
    }
    const data = (await response.json()) as TokenData
    return data
  }, [token])

  useEffect(() => {
    if (!token) return

    setLoading(true)
    dataFetcher()
      .then((data) => {
        // setData(data)
        setData({ message: 'tokenExpired' })
      })
      .catch((_) => {
        setError(errorMessge)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  if (loading) {
    content = <PageLoadingCircle />
  } else if (data) {
    const verifiedToken = typeof token === 'string' ? token : ''

    content = <ShowUnsubscibe data={data} token={verifiedToken} />
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
