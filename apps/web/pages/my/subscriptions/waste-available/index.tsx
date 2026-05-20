import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import Layout from '../../../../components/layouts/Layout'
import RedirectUnathenticatedUser from '../../../../components/uiParts/RedirectUnathenticatedUser'
import PageLoadingCircle from '../../../../components/uiParts/PageLoadingCircle'
import ErrorComponet from '../../../../components/uiParts/Error'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import {
  getValidPageNumber,
  getValidPageSize,
  defaultPageSize,
} from '../../../../lib/helpers/pagination'
import Checkbox from '@mui/material/Checkbox'

const title = 'Мои подписки на получение уведомлений о наличии вторсырья'

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

const SubscriptionItems = (data) => {
  const label = {
    slotProps: {
      input: { 'aria-label': 'Выбрать строку для дальнейших действий' },
    },
  }

  if (!data) return null

  if (data && data.length === 0) return <NoData />
  const id = 1
  return (
    <Box>
      <Typography
        component="h1"
        variant="h5"
        align="center"
        sx={{ mt: 2, mb: 5 }}
      >
        {title}
      </Typography>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Paper
            sx={{
              borderRadius: '8px',
              display: 'flex',
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
            }}
          >
            <Box sx={{ p: 2 }}>
              <Checkbox {...label} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ pb: 2 }}>
                <Typography variant="h6">Населенный пункт</Typography>
              </Box>
              <Box sx={{ pb: 2 }}>
                <Typography
                  gutterBottom
                  variant="body2"
                  sx={{ color: 'grey.400' }}
                >
                  Типы вторсырья:
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label="primary" />
                  <Chip label="primary" />
                  <Chip label="primary" />
                  <Chip label="primary" />
                  <Chip label="primary" />
                  <Chip label="primary" />
                </Stack>
              </Box>
              <Box sx={{ pb: 2 }}>
                <Typography
                  sx={{ color: 'grey.400', fontWeight: 300 }}
                  variant="body2"
                >
                  Радиус поиска: 42 км
                </Typography>
              </Box>
              <Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    href={`/my/subscriptions/waste-available/edit/${id}`}
                    size="small"
                  >
                    Редактировать
                  </Button>
                  <Button size="small">Удалить</Button>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', width: '100%' }}>
          <Paper
            sx={{
              borderRadius: '8px',
              display: 'flex',
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
            }}
          >
            <Box sx={{ p: 1 }}>
              <Checkbox {...label} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ pb: 2 }}>
                <Typography variant="h6">Населенный пункт</Typography>
              </Box>
              <Box sx={{ pb: 2 }}>
                <Typography gutterBottom variant="body2">
                  Типы вторсырья
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label="primary" />
                  <Chip label="primary" />
                  <Chip label="primary" />
                  <Chip label="primary" />
                  <Chip label="primary" />
                  <Chip label="primary" />
                </Stack>
              </Box>
              <Box sx={{ pb: 2 }}>
                <Typography variant="body2">Радиус поиска: 42 км</Typography>
              </Box>
              <Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    href={`/my/subscriptions/waste-available/edit/${id}`}
                    size="small"
                  >
                    Редактировать
                  </Button>
                  <Button size="small">Удалить</Button>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Stack>
    </Box>
  )
}

const SubscriptionList = () => {
  const [status, setStatus] = useState('')
  const [data, setData] = useState<any>(null)
  const router = useRouter()
  const query = router.query
  const { page: initialPage, pageSize: initialPageSize } = query

  const validPage = getValidPageNumber(initialPage)
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

  let content: ReactElement | null = null

  switch (status) {
    case 'loading':
      content = <PageLoadingCircle />
      break

    case 'error':
      content = <ErrorComponet />
      break

    case 'ok':
      content = <SubscriptionItems {...data} />
      break

    default:
      content = null
  }

  return content
}

export default function WasteAvailableSubscriptions() {
  return (
    <Layout title={title}>
      <RedirectUnathenticatedUser>
        <Box
          sx={{
            // margin: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SubscriptionList />
        </Box>
      </RedirectUnathenticatedUser>
    </Layout>
  )
}
