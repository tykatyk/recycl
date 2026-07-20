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
} from '@mui/material'
import { useSnackbar } from 'notistack'
import router, { useRouter } from 'next/router'
import { useEffect, useState, useRef, RefObject } from 'react'
import Cookies from 'js-cookie'
import Layout from '../../../components/layouts/Layout'
import ScrollTopButton from '../../../components/uiParts/ScrollToTopButton'
import NoRows from '../../../components/uiParts/NoRows'
import HeadingWithDescription from '../../../components/uiParts/HeadingWithDescription'
import DataGridFooter from '../../../components/uiParts/DataGridFooter'
import RedirectUnathenticatedUser from '../../../components/uiParts/RedirectUnathenticatedUser'
import PageLoadingCircle from '../../../components/uiParts/PageLoadingCircle'
import ErrorComponet from '../../../components/uiParts/Error'
import { subscriptionConfig } from '../../../lib/helpers/subscription'
import {
  getValidPageNumber,
  getValidPageSize,
} from '../../../lib/helpers/pagination'
import type { HrefOptions, Variant } from '../../../lib/types/pagination'
import { WasteAvailableSubscription } from '@recycl/shared/dist/server/db/models/wasteAvailableSubsciption'
import type { PaginatedData } from '../../../lib/types/pagination'
import type { CollectionPointContainer } from '../../../lib/types/collectionPoint'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { collectionPointTypes } from '@recycl/shared/dist/constants'
import AdTabs from '../../../components/uiParts/Tabs'
// import { documentActivityStatus } from '@recycl/shared/dist/constants'
import { CollectionPointsDescription } from '../../../components/uiParts/CollectionPointComponents'

const title = 'Мои пункты приема вторсырья'
const apiUrl = '/api/collection-points'
const baseUrl = '/my/collection-points'
const stationeryCollectionPointsRoute = `${baseUrl}/stationery`
const mobileCollectionPointsRoute = `${baseUrl}/mobile`

const createUrl = `${baseUrl}/create`

const noDataHeaderText = 'Еще нет ни одной подписки'
const noDataHelperText =
  'Укажите типы вторсырья, которые вас интересуют и добавьте регион поиска'
const addItemButtonText = 'Добавить'
const editButtonText = 'Редактировать'
const deleteButtonText = 'Удалить'
const fetchDataErrorText = 'Не удалось загрузить данные'

const getHref = (options: HrefOptions) => {
  const { page, pageSize } = options
  const href = `${baseUrl}?page=${page}&pageSize=${pageSize}`

  return href
}

const handleVariantChange = (
  _: React.SyntheticEvent,
  newVariant: keyof typeof collectionPointTypes,
) => {
  if (newVariant === 'container') {
    router.push(baseUrl)
  } else if (newVariant === 'mobile') {
    router.push(mobileCollectionPointsRoute)
  } else if (newVariant === 'stationery') {
    router.push(stationeryCollectionPointsRoute)
  }
}

const renderItem = (item: PaginationRenderItemParams) => {
  return <PaginationItem {...item} />
}

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
      <Typography component={'h1'} variant="h6" sx={{ mb: 2 }} align="center">
        {noDataHeaderText}
      </Typography>
      <Typography sx={{ mb: 4 }} align="center">
        {noDataHelperText}
      </Typography>
      <Button variant="contained" href={createUrl}>
        {addItemButtonText}
      </Button>
    </Box>
  )
}

const Header = () => {
  return (
    <HeadingWithDescription
      detailedDescription={<CollectionPointsDescription />}
    >
      <Typography
        component="h1"
        variant="h4"
        // align="center"
        sx={{ mt: 2, mb: 3, width: '100%' }}
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
  selectedCount: number
  total: number
}

const ActionsBar = (props: ActionsBarProps) => {
  const { actionsBarRef, isSticky, handleSelectAll, selectedCount, total } =
    props
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
                >
                  Удалить выбранные
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', pr: 2, pl: 2 }}>
              <Button size="small" variant="outlined" href={createUrl}>
                {addItemButtonText}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const MyCollectionPointsList = () => {
  const [status, setStatus] = useState('')
  const [data, setData] = useState<PaginatedData<
    CollectionPointContainer & { _id: string }
  > | null>(null)
  const router = useRouter()
  const query = router.query
  const [selected, setSelected] = useState<string[]>([])
  const [isSticky, setIsSticky] = useState(false)
  const [variant, setVariant] = useState('container')
  const actionsBarRef = useRef<HTMLDivElement>(null)
  const firstItemRef = useRef<HTMLDivElement>(null)
  const scrollPosRef = useRef<number>(0)
  const { enqueueSnackbar } = useSnackbar()

  const selectRowLabel = {
    slotProps: {
      input: { 'aria-label': 'Выбрать строку' },
    },
  }

  const handleDelete = async (id: string) => {
    setStatus('deleting')
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      body: JSON.stringify({ documentIds: [id] }),
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

      if (skip >= total) {
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

  useEffect(() => {
    if (!actionsBarRef.current) return

    const actionsBar = actionsBarRef.current
    const parent = actionsBar.parentElement

    if (!parent) return

    const minHeight = actionsBar.offsetHeight
    parent.style.minHeight = `${minHeight}px`
  }, [actionsBarRef.current])

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

        <AdTabs value={'container'} handleChange={handleVariantChange}>
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
                          <Box sx={{ pb: 1 }}>
                            <Typography variant="h6">
                              {item.location.description}
                            </Typography>
                          </Box>
                          <Box sx={{ pb: 2 }}>
                            <Typography component={'span'} variant="body2">
                              {'Тип пункта приема вторсырья: '}
                            </Typography>
                            <Typography
                              component={'span'}
                              sx={{ color: 'grey.400', fontWeight: 'light' }}
                              variant="body2"
                            >
                              {collectionPointTypes[item.variant].toLowerCase()}
                            </Typography>
                          </Box>
                          <Box sx={{ pb: 2 }}>
                            <Typography variant="body2" sx={{ pb: 1 }}>
                              Виды вторсырья, которые принимаются:
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              {item.wasteTypes.map(
                                (wasteType: string, idx: number) => {
                                  return (
                                    <Chip label={`${wasteType}`} key={idx} />
                                  )
                                },
                              )}
                            </Stack>
                          </Box>

                          <Box sx={{ pt: 1 }}>
                            <Stack direction="row" spacing={2}>
                              <Button
                                href={`${baseUrl}/edit/${item.variant}/${item._id}`}
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
                                  await handleDelete(item._id)
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
        </AdTabs>

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

export default function MyCollectionPoints() {
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
          <MyCollectionPointsList />
          <ScrollTopButton />
        </Box>
      </RedirectUnathenticatedUser>
    </Layout>
  )
}
