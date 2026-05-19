import { Box, Button, Typography } from '@mui/material'
import Layout from '../../../../components/layouts/Layout'
import RedirectUnathenticatedUser from '../../../../components/uiParts/RedirectUnathenticatedUser'
import PageLoadingCircle from '../../../../components/uiParts/PageLoadingCircle'
import ErrorComponet from '../../../../components/uiParts/Error'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import {
  getValidPage,
  getValidPageSize,
  defaultPageSize,
} from '../../../../lib/helpers/pagination'

const NoData = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography component={'h1'} variant="h6" paragraph align="center">
        Еще нет ни одной подписки
      </Typography>
      <Typography sx={{ mb: 4 }} align="center">
        Добавьте регион поиска и укажите типы вторсырья, которые вас интересуют
      </Typography>
      <Button
        variant="contained"
        href="/my/subscriptions/waste-available/create"
      >
        Добавить
      </Button>
    </Box>
  )
}

const SubscriptionList = () => {
  const [status, setStatus] = useState('')
  const router = useRouter()
  const query = router.query
  const { page: initialPage, pageSize: initialPageSize } = query

  const validPage = getValidPage(initialPage)
  const validPageSize = getValidPageSize(initialPageSize)

  useEffect(() => {
    if (!query) return

    const fetchData = async () => {
      try {
        setStatus('loading')
        const options = {
          page: String(validPage),
          pageSize: String(validPageSize),
        }
        const response = await fetch(
          `/api/subscriptions/waste-available?${new URLSearchParams(options)}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        if (!response.ok) {
          throw new Error('Something went wrong')
        }
        const data = await response.json()
        console.log(data)
        setStatus('ok')
      } catch (error) {
        setStatus('error')
      }
    }

    fetchData()
  }, [query])

  return null
}

let content: ReactElement | null = null

switch (status) {
  case 'loading':
    content = <PageLoadingCircle />
    break

  case 'error':
    content = <ErrorComponet />
    break

  case 'ok':
    content = <SubscriptionList />
    break

  default:
    content = null
}

export default function WasteAvailableSubscriptions() {
  return (
    <Layout title="Подписки на обьявления о наличии вторсырья">
      <RedirectUnathenticatedUser>
        <Box
          sx={{
            margin: 'auto',

            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <NoData />
        </Box>
      </RedirectUnathenticatedUser>
    </Layout>
  )
}
