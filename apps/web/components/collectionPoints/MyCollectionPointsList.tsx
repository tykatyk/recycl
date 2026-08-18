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
import router, { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import Cookies from 'js-cookie'
import NoRows from '../../components/uiParts/NoRows'
import HeadingWithDescription from '../../components/uiParts/HeadingWithDescription'
import DataGridFooter from '../../components/uiParts/DataGridFooter'
import PageLoadingCircle from '../../components/uiParts/PageLoadingCircle'
import ErrorComponet from '../../components/uiParts/Error'
import {
  getValidPageNumber,
  getValidPageSize,
} from '../../lib/helpers/pagination'
import type { HrefOptions } from '../../lib/types/pagination'
import type { PaginatedData } from '../../lib/types/pagination'
import type { CollectionPoint } from '../../lib/types/collectionPoint'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { collectionPointTypes } from '@recycl/shared/dist/constants'
import CollectionPointTabs from '../uiParts/CollectionPointTabs'
import { CollectionPointsDescription } from '../../components/uiParts/CollectionPointComponents'
import dayjs from 'dayjs'
import ActionsBar from '../uiParts/ActionsBar'

const apiUrl = '/api/my/collection-points'
const baseUrl = '/my/collection-points'

const stationeryCollectionPointsRoute = `${baseUrl}/stationery`
const mobileCollectionPointsRoute = `${baseUrl}/mobile`

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

type MyCollectionPointsListProps = {
  variant?: keyof typeof collectionPointTypes
  h1: string
}
export default function MyCollectionPointsList(
  props: MyCollectionPointsListProps,
) {
  const { variant = 'container', h1 } = props
  const [status, setStatus] = useState('')
  const [data, setData] = useState<PaginatedData<
    CollectionPoint & { _id: string }
  > | null>(null)
  const router = useRouter()
  const query = router.query
  const [selected, setSelected] = useState<string[]>([])
  const [isSticky, setIsSticky] = useState(false)
  const actionsBarRef = useRef<HTMLDivElement>(null)
  const firstItemRef = useRef<HTMLDivElement>(null)
  const scrollPosRef = useRef<number>(0)
  const { enqueueSnackbar } = useSnackbar()

  const handleDelete = async (documentIds: string[]) => {
    setStatus('actionPerforming')
    const response = await fetch(apiUrl, {
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
    await fetchData()
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
      const searchParams = new URLSearchParams({
        page: String(validPage),
        pageSize: String(validPageSize),
        variant,
      })

      const response = await fetch(`${apiUrl}?${searchParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

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

  useEffect(() => {
    //ToDo: get rid of the actionsBarRef in the dependency array
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
  }, [actionsBarRef.current])

  if (status === 'error') return <ErrorComponet />

  if (!data && status === 'loading') return <PageLoadingCircle />

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
        {status === 'actionPerforming' && (
          <Modal open={true}>
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
        )}
        <HeadingWithDescription
          detailedDescription={<CollectionPointsDescription />}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ mt: 2, mb: 3, width: '100%' }}
          >
            {h1}
          </Typography>
        </HeadingWithDescription>

        <CollectionPointTabs
          value={variant ? variant : 'container'}
          handleChange={handleVariantChange}
        >
          {data.items.length === 0 ? (
            <Box
              sx={{
                p: 3,
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
                            slotProps={{
                              input: {
                                'data-id': `${item._id}`,
                                'aria-label': 'Выбрать строку',
                              } as any,
                            }}
                            onChange={(e) => {
                              const id = e.target.dataset.id
                              if (!id) return
                              handleSelect(id)
                            }}
                            checked={selected.includes(item._id)}
                          />
                        </Box>
                        <Box
                          sx={{
                            flexGrow: 1,
                            '& > *': {
                              mb: 2,
                            },
                            '& > :last-child': {
                              mb: 0,
                            },
                          }}
                        >
                          <Box>
                            <Typography variant="h6">
                              {item.location.description}
                            </Typography>
                          </Box>
                          {item.variant === 'mobile' && (
                            <Box>
                              <Typography
                                component={'span'}
                                sx={{ color: 'grey.400', fontWeight: 'light' }}
                                variant="body2"
                              >
                                {'Дата и время события: '}
                              </Typography>
                              <Typography component={'span'} variant="body2">
                                {dayjs(item.date).format('DD.MM.YYYY HH:mm')}
                              </Typography>
                            </Box>
                          )}

                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                pb: 1,
                                color: 'grey.400',
                                fontWeight: 'light',
                              }}
                            >
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
                          <Box>
                            <Typography
                              component={'span'}
                              sx={{ color: 'grey.400', fontWeight: 'light' }}
                              variant="body2"
                            >
                              {'Тип пункта приема вторсырья: '}
                            </Typography>
                            <Typography component={'span'} variant="body2">
                              {collectionPointTypes[item.variant].toLowerCase()}
                            </Typography>
                          </Box>

                          <Box>
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
        </CollectionPointTabs>

        {data.items.length > 0 && (
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
            renderItem={(item: PaginationRenderItemParams) => {
              return <PaginationItem {...item} />
            }}
          />
        )}
      </Box>
    )
  }
  return null
}
