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
import { useEffect, useState, useRef, RefObject, useLayoutEffect } from 'react'
import Cookies from 'js-cookie'
import NoRows from '../uiParts/NoRows'
import HeadingWithDescription from '../uiParts/HeadingWithDescription'
import DataGridFooter from '../uiParts/DataGridFooter'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import ErrorComponet from '../uiParts/Error'
import {
  getValidPageNumber,
  getValidPageSize,
} from '../../lib/helpers/pagination'
import type { HrefOptions } from '../../lib/types/pagination'
import type { PaginatedData } from '../../lib/types/pagination'
import type { Ad } from '@recycl/shared/dist/server/db/models/ad'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  collectionPointTypes,
  documentActivityStatus,
} from '@recycl/shared/dist/constants'
import AdTabs from '../uiParts/AdTabs'
import { CollectionPointsDescription } from '../uiParts/CollectionPointComponents' //ToDo: implement for ads
import dayjs from 'dayjs'

const apiUrl = '/api/my/ads'
const baseUrl = '/my/ads'

const inactiveAdsRoute = `${baseUrl}/disabled`

const editButtonText = 'Редактировать'
const deactivateButtonText = 'Деактивировать'
const activateButtonText = 'Активировать'
const deleteButtonText = 'Удалить'
const fetchDataErrorText = 'Не удалось загрузить данные'

const getHref = (
  options: HrefOptions & { variant: keyof typeof documentActivityStatus },
) => {
  const { page, pageSize, variant } = options
  const url = variant === 'disabled' ? `${baseUrl}/disabled` : `${baseUrl}`
  const href = `${url}?page=${page}&pageSize=${pageSize}`

  return href
}

const handleVariantChange = (
  _: React.SyntheticEvent,
  newVariant: keyof typeof documentActivityStatus,
) => {
  if (newVariant === 'active') {
    router.push(baseUrl)
  } else if (newVariant === 'disabled') {
    router.push(inactiveAdsRoute)
  }
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

const Header = (props) => {
  return (
    <HeadingWithDescription
      detailedDescription={<CollectionPointsDescription />}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{ mt: 2, mb: 3, width: '100%' }}
      >
        {props.title}
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
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

type MyAdsProps = {
  variant: keyof typeof documentActivityStatus
  h1: string
}
export default function MyAdsList(props: MyAdsProps) {
  const { h1, variant } = props
  const [status, setStatus] = useState('')
  const [data, setData] = useState<PaginatedData<Ad & { _id: string }> | null>(
    null,
  )
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
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      body: JSON.stringify({ documentIds }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      enqueueSnackbar('Ошибка при удалении элемента', { variant: 'error' })
    } else {
      enqueueSnackbar('Элемент удален', { variant: 'success' })
      await fetchData()
    }
    setStatus('')
  }

  const handleActivation = async (id: string) => {
    setStatus('deleting') //ToDo: rename status
    const action = variant === 'active' ? 'deactivate' : 'activate'
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ id, action }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      enqueueSnackbar(
        variant === 'active'
          ? 'Не могу деактивировать объявление'
          : 'Не могу активировать объявление',
        { variant: 'error' },
      )
    } else {
      enqueueSnackbar(
        variant === 'active'
          ? 'Объявление деактивировано'
          : 'Объявление активировано',
        { variant: 'success' },
      )
      await fetchData()
    }
    setStatus('')
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
        const href = getHref({ variant, page: lastPage, pageSize })

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

  // if (data && data.pagination && data.pagination.total === 0) return <NoData />

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
        <Header title={h1} />

        <AdTabs value={variant} handleChange={handleVariantChange}>
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
                        <Box
                          sx={{
                            flexGrow: 1,
                            '& > *': {
                              mb: 1,
                            },
                            '& > :last-child': {
                              mb: 0,
                            },
                          }}
                        >
                          <Box>
                            <Typography variant="h6">{item.title}</Typography>
                          </Box>

                          <Box>
                            <Typography
                              component={'span'}
                              sx={{ color: 'grey.400', fontWeight: 'light' }}
                              variant="body2"
                            >
                              {'Местоположение вторсырья: '}
                            </Typography>
                            <Typography component={'span'} variant="body2">
                              {item.wasteLocation.description}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              component={'span'}
                              sx={{ color: 'grey.400', fontWeight: 'light' }}
                              variant="body2"
                            >
                              {'Вид вторсырья: '}
                            </Typography>
                            <Typography component={'span'} variant="body2">
                              {`${item.wasteType}`}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              component={'span'}
                              sx={{ color: 'grey.400', fontWeight: 'light' }}
                              variant="body2"
                            >
                              {'Вес вторсырья: '}
                            </Typography>
                            <Typography component={'span'} variant="body2">
                              {`${item.quantity} кг`}
                            </Typography>
                          </Box>
                          {variant === 'active' && (
                            <Box>
                              <Typography
                                component={'span'}
                                sx={{ color: 'grey.400', fontWeight: 'light' }}
                                variant="body2"
                              >
                                {'Объявление активно до: '}
                              </Typography>
                              <Typography component={'span'} variant="body2">
                                {dayjs(item.expires).format('DD.MM.YYYY HH:MM')}
                              </Typography>
                            </Box>
                          )}

                          <Box>
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
                                  await handleActivation(item._id)
                                }}
                              >
                                {variant === 'active'
                                  ? deactivateButtonText
                                  : activateButtonText}
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
        </AdTabs>

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
                variant,
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
                variant,
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
