import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
  PaginationRenderItemParams,
  SelectChangeEvent,
  Modal,
  PaginationItem,
  Checkbox,
  CircularProgress,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef, RefObject, useLayoutEffect } from 'react'
import Cookies from 'js-cookie'
import Layout from '../../../../components/layouts/Layout'
import ScrollTopButton from '../../../../components/uiParts/ScrollToTopButton'
import NoRows from '../../../../components/uiParts/NoRows'
import HeadingWithDescription, {
  HeadingDetails,
} from '../../../../components/uiParts/HeadingWithDescription'
import DataGridFooter from '../../../../components/uiParts/DataGridFooter'
import RedirectUnathenticatedUser from '../../../../components/uiParts/RedirectUnathenticatedUser'
import PageLoadingCircle from '../../../../components/uiParts/PageLoadingCircle'
import ErrorComponet from '../../../../components/uiParts/Error'
import { subscriptionConfig } from '../../../../lib/helpers/subscription'
import {
  getValidPageNumber,
  getValidPageSize,
} from '../../../../lib/helpers/pagination'
import type { HrefOptions } from '../../../../lib/types/pagination'
import { WasteAvailableSubscription } from '@recycl/shared/dist/server/db/models/wasteAvailableSubsciption'
import type { PaginatedData } from '../../../../lib/types/pagination'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const title = 'Мои подписки на уведомления о появлении вторсырья '
const apiUrl = '/api/subscriptions/waste-available'
const baseUrl = '/my/subscriptions/waste-available'
const createSubscriptionUrl = `${baseUrl}/create`

const noDataHeaderText = 'Еще нет ни одной подписки'
const noDataHelperText =
  'Укажите типы вторсырья, которые вас интересуют и добавьте регион поиска'
const addItemButtonText = 'Добавить'
const editButtonText = 'Редактировать'
const deleteButtonText = 'Удалить'
const fetchDataErrorText = 'Не удалось загрузить данные'

const getSearchRadiusText = (radius: number) => {
  return `Радиус поиска: ${radius} км`
}

const getHref = (options: HrefOptions) => {
  const { page, pageSize } = options
  const href = `${baseUrl}?page=${page}&pageSize=${pageSize}`

  return href
}

const renderItem = (item: PaginationRenderItemParams) => {
  return <PaginationItem {...item} />
}

const DeletingModal = (params: { open: boolean }) => {
  const { open } = params

  return (
    <Modal open={open}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress size={40} color="warning" />
      </Box>
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
      <Typography component={'h1'} variant="h6" sx={{ mb: 2 }} align="center">
        {noDataHeaderText}
      </Typography>
      <Typography sx={{ mb: 4 }} align="center">
        {noDataHelperText}
      </Typography>
      <Button variant="contained" href={createSubscriptionUrl}>
        {addItemButtonText}
      </Button>
    </Box>
  )
}

const Header = () => {
  return (
    <HeadingWithDescription
      detailedDescription={
        <HeadingDetails
          details={subscriptionConfig.wasteAvailable.description}
        />
      }
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
  )
}
type ActionsBarProps = {
  actionsBarRef: RefObject<HTMLDivElement | null>
  isSticky: boolean
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleDeleteMany: () => Promise<void>
  selectedCount: number
  total: number
}

const ActionsBar = (props: ActionsBarProps) => {
  const {
    actionsBarRef,
    isSticky,
    handleSelectAll,
    handleDeleteMany,
    selectedCount,
    total,
  } = props
  const selectAllRowsLabel = {
    slotProps: {
      input: { 'aria-label': 'Выбрать все строки' },
    },
  }

  return (
    <Box>
      <Box
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
                  checked={selectedCount > 0}
                  color="secondary"
                  {...selectAllRowsLabel}
                  onChange={(e) => {
                    handleSelectAll(e)
                  }}
                />
              </Box>

              <Box sx={{ pr: 2 }}>
                <Typography variant="body2" sx={{ color: 'grey.400' }}>
                  {`Выбрано ${selectedCount} из ${total}`}
                </Typography>
              </Box>
              <Box>
                <Button
                  size="small"
                  disabled={selectedCount === 0}
                  color="secondary"
                  onClick={handleDeleteMany}
                >
                  Удалить выбранные
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', pr: 2, pl: 2 }}>
              <Button
                size="small"
                variant="outlined"
                href={createSubscriptionUrl}
              >
                {addItemButtonText}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const SubscriptionList = () => {
  const [status, setStatus] = useState('')
  const [data, setData] = useState<PaginatedData<
    WasteAvailableSubscription & { _id: string }
  > | null>(null)
  const router = useRouter()
  const query = router.query
  const [selected, setSelected] = useState<string[]>([])
  const [isSticky, setIsSticky] = useState(false)
  const actionsBarRef = useRef<HTMLDivElement>(null)
  const firstItemRef = useRef<HTMLDivElement>(null)
  const scrollPosRef = useRef<number>(0)
  const { enqueueSnackbar } = useSnackbar()

  const selectRowLabel = {
    slotProps: {
      input: { 'aria-label': 'Выбрать строку' },
    },
  }

  const handleDelete = async (documentIds: string[]) => {
    setStatus('deleting')
    const response = await fetch('/api/subscriptions/waste-available', {
      method: 'DELETE',
      body: JSON.stringify({ documentIds }),
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

  const deleteMany = async () => {
    await handleDelete(selected)
    setSelected([])
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
      if (!data) return

      const newSelected = data.items.map((row) => row._id as string)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const fetchData = async () => {
    try {
      setStatus('loading')

      const validPage = getValidPageNumber(query.page)
      const validPageSize = getValidPageSize(query.pageSize)

      const response = await fetch(
        `${apiUrl}?${new URLSearchParams({
          page: String(validPage),
          pageSize: String(validPageSize),
        })}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error(fetchDataErrorText)
      }
      const data = await response.json()
      const page = data.pagination.page
      const pageSize = data.pagination.pageSize
      const total = data.pagination.total
      const skip = (page - 1) * pageSize

      if (skip && skip >= total) {
        const lastPage = Math.ceil(total / pageSize)
        const href = getHref({ page: lastPage, pageSize })

        return router.push(href)
      }

      setData(data)
      setStatus('')
    } catch (error) {
      setStatus('error')
    }
  }

  useEffect(() => {
    fetchData()
  }, [query.page, query.pageSize])

  useEffect(() => {
    const handleScroll = () => {
      let currentScroll =
        window.pageYOffset || document.documentElement.scrollTop

      if (!actionsBarRef.current || !firstItemRef.current) return
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

  useLayoutEffect(() => {
    if (!actionsBarRef.current) return

    const node = actionsBarRef.current
    const parent = node.parentElement

    if (!parent) return

    const updateHeight = () => {
      parent.style.minHeight = `${node.offsetHeight}px`
    }

    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  if (status === 'error') return <ErrorComponet />

  if (!data && status === 'loading') return <PageLoadingCircle />

  if (data && data.pagination && data.pagination.total === 0) return <NoData />

  if (data && data.items) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {status === 'loading' ? (
          <PageLoadingCircle sx={[{ position: 'fixed' }]} />
        ) : null}
        {status === 'deleting' ? <DeletingModal open={true} /> : null}
        <Header />

        {data.items.length === 0 && data.pagination.total > 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexGrow: '1',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <NoRows />
          </Box>
        ) : (
          <>
            <ActionsBar
              actionsBarRef={actionsBarRef}
              isSticky={isSticky}
              handleSelectAll={handleSelectAll}
              handleDeleteMany={deleteMany}
              selectedCount={selected.length}
              total={Math.min(data.pagination.pageSize, data.items.length)}
            />
            <Stack spacing={2} sx={{ width: '100%' }}>
              {data.items.map((item, idx: number) => {
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
                            {item.wasteTypes.map(
                              (wasteType: string, idx: number) => {
                                return <Chip label={`${wasteType}`} key={idx} />
                              },
                            )}
                          </Stack>
                        </Box>
                        <Box sx={{ pb: 2, borderBottom: '1px solid #5a5a5a' }}>
                          <Typography
                            sx={{ color: 'grey.400', fontWeight: 'light' }}
                            variant="body2"
                          >
                            {getSearchRadiusText(item.radius)}
                          </Typography>
                        </Box>
                        <Box sx={{ pt: 1 }}>
                          <Stack direction="row" spacing={2}>
                            <Button
                              href={`${baseUrl}/edit/${item._id}`}
                              size="small"
                              color="secondary"
                              startIcon={<EditIcon />}
                            >
                              {editButtonText}
                            </Button>
                            <Button
                              size="small"
                              color="secondary"
                              startIcon={<DeleteIcon />}
                              onClick={async (_) => {
                                await handleDelete([item._id])
                              }}
                            >
                              {deleteButtonText}
                            </Button>
                          </Stack>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                )
              })}
            </Stack>
          </>
        )}

        <DataGridFooter
          numRows={data.pagination.total}
          pageSize={data.pagination.pageSize}
          page={data.pagination.page}
          handlePageChange={(
            _: React.ChangeEvent<unknown>,
            newPage: number,
          ) => {
            setSelected([])
            const href = getHref({
              page: newPage,
              pageSize: data.pagination.pageSize,
            })
            router.push(href)
          }}
          handlePageSizeChange={(event: SelectChangeEvent) => {
            setSelected([])
            Cookies.set('pageSize', event.target.value.toString())

            const newPageSize = event.target.value

            const href = getHref({
              page: 1,
              pageSize: parseInt(newPageSize, 10),
            })

            router.push(href)
          }}
          renderItem={renderItem}
        />
      </Box>
    )
  }
  return null
}

export default function WasteAvailableSubscriptions() {
  return (
    <Layout title={title}>
      <RedirectUnathenticatedUser>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SubscriptionList />
          <ScrollTopButton />
        </Box>
      </RedirectUnathenticatedUser>
    </Layout>
  )
}
