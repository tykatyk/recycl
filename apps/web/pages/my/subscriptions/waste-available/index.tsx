import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import Layout from '../../../../components/layouts/Layout'
import RedirectUnathenticatedUser from '../../../../components/uiParts/RedirectUnathenticatedUser'
import PageLoadingCircle from '../../../../components/uiParts/PageLoadingCircle'
import ErrorComponet from '../../../../components/uiParts/Error'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  getValidPageNumber,
  getValidPageSize,
  defaultPageSize,
} from '../../../../lib/helpers/pagination'
import Checkbox from '@mui/material/Checkbox'
import { useRef } from 'react'
import ScrollTopButton from '../../../../components/uiParts/ScrollToTopButton'
import { useSnackbar } from 'notistack'
import Modal from '@mui/material/Modal'
import HeadingWithDescription from '../../../../components/uiParts/HeadingWithDescription'
import { subscriptionConfig } from '../../../../lib/helpers/subscription'

const title = 'Мои подписки на уведомления о появлении вторсырья '

const DeletingModal = (params: { open: boolean }) => {
  const { open } = params

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <PageLoadingCircle />
    </Modal>
  )
}

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
        Укажите типы вторсырья, которые вас интересуют и добавьте регион поиска
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
  const [data, setData] = useState<any>(null)
  const router = useRouter()
  const query = router.query
  const { page: initialPage, pageSize: initialPageSize } = query
  const [selected, setSelected] = useState<any>([])
  const [isSticky, setIsSticky] = useState(false)
  const actionsBarRef = useRef<any>(null)
  const firstItemRef = useRef<any>(null)
  const scrollPosRef = useRef<any>(0)
  const { enqueueSnackbar } = useSnackbar()

  const validPage = getValidPageNumber(initialPage)
  const validPageSize = getValidPageSize(initialPageSize)

  const selectAllRowsLabel = {
    slotProps: {
      input: { 'aria-label': 'Выбрать все строки' },
    },
  }
  const selectRowLabel = {
    slotProps: {
      input: { 'aria-label': 'Выбрать строку' },
    },
  }

  const handleDelete = async (id: string) => {
    setStatus('deleting')
    const response = await fetch('/api/subscriptions/waste-available', {
      method: 'DELETE',
      body: JSON.stringify({ documentId: id }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      enqueueSnackbar('Ошибка при удалении элемента', { variant: 'error' })
      return
    }
    setStatus('')
    enqueueSnackbar('Элемент удален', { variant: 'success' })
    fetchData()
  }

  const handleSelect = (id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected)
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((row) => row._id as string)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

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
      setData(data)
      setStatus('ok')
    } catch (error) {
      setStatus('error')
    }
  }

  useEffect(() => {
    if (!query) return
    fetchData()
  }, [query])

  useEffect(() => {
    const handleScroll = () => {
      let currentScroll =
        window.pageYOffset || document.documentElement.scrollTop

      if (!actionsBarRef.current && !firstItemRef.current) return
      const actionsBarRect = actionsBarRef.current.getBoundingClientRect()
      const firstItemRect = firstItemRef.current.getBoundingClientRect()

      if (currentScroll > scrollPosRef.current) {
        if (actionsBarRect.top <= 0) {
          setIsSticky(true)
        }
      } else if (currentScroll < scrollPosRef.current) {
        if (firstItemRect.top >= actionsBarRect.bottom) {
          setIsSticky(false)
        }
      }
      scrollPosRef.current = currentScroll <= 0 ? 0 : currentScroll // For Mobile or negative scrolling
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!actionsBarRef.current) return

    const actionsBar = actionsBarRef.current
    const parent = actionsBar.parentElement

    const minHeight = actionsBar.offsetHeight
    parent.style.minHeight = `${minHeight}px`
  }, [actionsBarRef.current])

  if (status === 'error') return <ErrorComponet />

  if (!data && status === 'loading') return <PageLoadingCircle />

  if (data && data.length === 0) return <NoData />

  if (data)
    return (
      <Box sx={{ width: '100%', height: '100%' }}>
        {status === 'loading' ? (
          <PageLoadingCircle sx={[{ position: 'fixed' }]} />
        ) : null}
        {status === 'deleting' ? <DeletingModal open={true} /> : null}
        <ScrollTopButton />
        <HeadingWithDescription
          detailedDescription={subscriptionConfig.wasteAvailable.description}
        >
          <Typography
            component="h1"
            variant="h5"
            align="center"
            sx={{ mt: 2, mb: 3 }}
          >
            {title}
          </Typography>
        </HeadingWithDescription>

        <Box>
          <Box
            className={'actionsBarRef'}
            ref={actionsBarRef}
            sx={{
              position: isSticky ? 'fixed' : 'sticky',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              backgroundColor: isSticky ? '#1a2b34' : 'background.default',
              boxShadow: isSticky ? '0 2px 4px #3c4b53' : 'none',
              transition: isSticky ? 'background 0.3s' : 'none',
            }}
          >
            <Box
              sx={{
                maxWidth: 900,
                margin: 'auto',
                pl: isSticky ? 5 : 2,
                pr: isSticky ? 5 : 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ p: 2, pl: 0 }}>
                    <Checkbox
                      color="secondary"
                      {...selectAllRowsLabel}
                      onChange={(e) => {
                        handleSelectAll(e)
                      }}
                    />
                  </Box>

                  <Box sx={{ pr: 2 }}>
                    <Typography variant="body2" sx={{ color: 'grey.400' }}>
                      {`Выбрано ${selected.length} из ${data.length}`}
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      size="small"
                      disabled={selected.length === 0}
                      color="secondary"
                    >
                      Удалить выбранные
                    </Button>
                  </Box>
                </Box>

                <Box
                  sx={{ display: 'flex', alignItems: 'center', pr: 2, pl: 2 }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    href="/my/subscriptions/waste-available/create"
                  >
                    Создать
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Stack spacing={2} sx={{ width: '100%' }}>
          {data.map((item, idx) => {
            return (
              <Box
                sx={{ display: 'flex', width: '100%' }}
                key={item._id}
                ref={idx === 0 ? firstItemRef : null}
              >
                <Paper
                  sx={{
                    borderRadius: '8px',
                    display: 'flex',
                    flexGrow: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                  }}
                >
                  <Box sx={{ p: 2, pl: 0 }}>
                    <Checkbox
                      color="secondary"
                      {...selectRowLabel}
                      slotProps={{
                        input: { 'data-id': `${item._id}` } as any,
                      }}
                      onChange={(e) => {
                        const id = e.target.dataset.id
                        if (!id) return
                        handleSelect(id)
                      }}
                      checked={selected.includes(item._id)}
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ pb: 2 }}>
                      <Typography variant="h6">
                        {item.location.description}
                      </Typography>
                    </Box>
                    <Box sx={{ pb: 2 }}>
                      <Stack direction="row" spacing={1}>
                        {item.wasteTypes.map((wasteType, idx) => {
                          return <Chip label={`${wasteType}`} key={idx} />
                        })}
                      </Stack>
                    </Box>
                    <Box sx={{ pb: 2, borderBottom: '1px solid #5a5a5a' }}>
                      <Typography
                        sx={{ color: 'grey.400', fontWeight: 'light' }}
                        variant="body2"
                      >
                        {`Радиус поиска: ${item.radius || 0} км`}
                      </Typography>
                    </Box>
                    <Box sx={{ pt: 1 }}>
                      <Stack direction="row" spacing={2}>
                        <Button
                          href={`/my/subscriptions/waste-available/edit/${item._id}`}
                          size="small"
                          color="secondary"
                        >
                          Редактировать
                        </Button>
                        <Button
                          size="small"
                          color="secondary"
                          onClick={async (_) => {
                            await handleDelete(item._id)
                          }}
                        >
                          Удалить
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )
          })}
        </Stack>
      </Box>
    )
  return null
}

export default function WasteAvailableSubscriptions() {
  return (
    <Layout title={title}>
      <RedirectUnathenticatedUser>
        <Box
          sx={{
            // margin: 'auto',
            width: '100%',
            // height: '100%',
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
