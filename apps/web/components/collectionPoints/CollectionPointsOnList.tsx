import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Chip,
  Container,
  ListItem,
  PaginationItem,
  Paper,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import AdSidebarItemsList from '../uiParts/AdSidebarItemsList'
import AdSidebar from '../uiParts/AdSidebar'
import { AdWrapper, drawerWidth } from '../uiParts/AdPageComponents'
import Link from '../uiParts/Link'
import NoRows from '../uiParts/NoRows'
import Header from '../uiParts/header/Header'
import Footer from '../uiParts/Footer'
import { useRouter } from 'next/router'
import DataGridFooter from '../uiParts/DataGridFooter'
import Cookies from 'js-cookie'
import type { HrefOptions } from '../../lib/types/pagination'
import AdSidebarItemsCommon from '../uiParts/AdSidebarItemsCommon'
import AdSidebarChangeView from '../uiParts/AdSidebarChangeView'
import Head from 'next/head'
import type { CollectionPoint } from '../../lib/types/collectionPoint'
import { collectionPointTypes } from '@recycl/shared/dist/constants'
import AdSidebarHeader from '../uiParts/AdSidebarHeader'

const errorMessage = 'Что-то пошло не так'
const baseUrl = '/collection-points/list'
const mapViewUrl = '/collection-points'
const brand = process.env.NEXT_PUBLIC_BRAND || ''
const howSearchWorksDescription =
  'При поиске по местоположению пункты приема вторсырья ищутся только в указанной точке. Например, при указанном местоположении "Винница", вы увидите пункты приема, для которых местоположение указано как "Винница", но не "ул. Пирогова, Винница", "ул. Келецакая, Винница" и т. д. Для поиска по региону, рекомендуем кроме местоположения также указывать радиус поиска.'

export type CollectionPointsOnListProps =
  | {
      status: 'error'
      message: string
    }
  | {
      status: 'success'
      data: {
        ads: (CollectionPoint & { _id: string })[]
        wasteType: string
        wasteLocation: {
          description: string
          place_id: string
        } | null
        searchRadius: number
        pagination: {
          total: number
          page: number
          pageSize: number
        }
      }
    }

export default function CollectionPointsOnList(
  props: CollectionPointsOnListProps,
) {
  const { enqueueSnackbar } = useSnackbar()
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [initialFormValues, setInitialFormValues] = useState<{
    wasteType: string | null
    wasteLocation: {
      description: string
      place_id: string
    } | null
    searchRadius: number | null
  }>({
    wasteType: null,
    wasteLocation: null,
    searchRadius: null,
  })

  const router = useRouter()

  const getHref = useCallback(
    (options: HrefOptions) => {
      const { page, pageSize } = options

      const queryExists = Object.keys(router.query).length > 0
      if (!queryExists) return `${baseUrl}?page=${page}&pageSize=${pageSize}`

      const { wasteType, locationDescription, locationId, searchRadius } =
        router.query

      const query = new URLSearchParams()

      if (wasteType) {
        query.set('wasteType', wasteType as string)
      }
      if (locationDescription && locationId) {
        query.set('locationDescription', locationDescription as string)
        query.set('locationId', locationId as string)

        if (searchRadius) {
          query.set('searchRadius', searchRadius as string)
        }
      }
      query.set('page', String(page))
      query.set('pageSize', String(pageSize))

      const queryString = query.toString()
      const pageRoute = queryString ? `${baseUrl}?${queryString}` : baseUrl

      return pageRoute
    },
    [router.query],
  )

  const { status } = props

  if (status !== 'success') {
    //ToDo: show err message
    enqueueSnackbar(errorMessage, { variant: 'error' })
    return null
  }

  const { data } = props

  useEffect(() => {
    if (!data) {
      enqueueSnackbar(errorMessage, { variant: 'error' })
      return
    }

    const { wasteType, wasteLocation, searchRadius } = data

    setInitialFormValues({
      wasteType,
      wasteLocation,
      searchRadius,
    })
  }, [data])

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleSubmit = useCallback(async (values) => {
    try {
      const { wasteType, wasteLocation, searchRadius } = values

      const query = new URLSearchParams()

      if (wasteType) {
        query.set('wasteType', wasteType)
      }
      if (wasteLocation) {
        query.set('locationDescription', wasteLocation.description)
        query.set('locationId', wasteLocation.place_id)
        if (searchRadius) {
          query.set('searchRadius', String(searchRadius))
        }
      }

      const queryString = query.toString()
      const pageRoute = queryString ? `${baseUrl}?${queryString}` : baseUrl

      router.push(pageRoute)
    } catch (error) {
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }, [])

  return (
    <>
      <Head>
        <title>{`Список пунктов приема вторсырья | ${brand}`}</title>
        <meta name="description" content="Найти пункт приема вторсырья" />
      </Head>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: 'background.default',
        }}
      >
        <AdSidebar
          sx={{
            width: drawerWidth,
          }}
          drawerOpen={drawerOpen}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
        >
          <AdSidebarHeader headerText={'Пункты приема вторсырья'} />
          <AdSidebarItemsList
            handleSubmit={handleSubmit}
            initialFormValues={initialFormValues}
            howSearchWorksDescription={howSearchWorksDescription}
          />

          <ListItem dense disableGutters divider />
          <AdSidebarChangeView listViewUrl={baseUrl} mapViewUrl={mapViewUrl} />
          <AdSidebarItemsCommon />
        </AdSidebar>

        <AdWrapper drawerOpen={drawerOpen}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Header
              desktopBreakpoints={{ xs: 'none', lg: 'flex' }}
              mobileViewport={{ show: 'xs', hide: 'lg' }}
            />

            <Box
              component={'main'}
              sx={{
                display: 'flex',
                flexGrow: 1,
                justifyContent:
                  data && data.ads && data.ads.length > 0
                    ? 'flex-start'
                    : 'center',
                alignItems:
                  data && data.ads && data.ads.length > 0
                    ? 'flex-start'
                    : 'center',
              }}
            >
              {data && data.ads && data.ads.length > 0 ? (
                <Container maxWidth="md" sx={{ pt: 2, pb: 2 }}>
                  <Stack spacing={2} sx={{ width: '100%' }}>
                    {data.ads.map((item, index) => {
                      return (
                        <Box
                          sx={{ display: 'flex', width: '100%' }}
                          key={item._id}
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
                            <Box sx={{ flexGrow: 1 }}>
                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 'fontWeightLight',
                                    color: 'grey.400',
                                  }}
                                >
                                  Местоположение пункта приема
                                </Typography>
                                <Typography variant="h6" component="div">
                                  {item.location.description}
                                </Typography>
                              </Box>

                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 'fontWeightLight',
                                    color: 'grey.400',
                                  }}
                                  gutterBottom
                                >
                                  Вторсырье, которое принимается
                                </Typography>
                                <Stack spacing={2} direction={'row'}>
                                  {item.wasteTypes.map((waste) => {
                                    return <Chip label={`${waste} кг`} />
                                  })}
                                </Stack>
                              </Box>

                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 'fontWeightLight',
                                    color: 'grey.400',
                                  }}
                                >
                                  Тип пункта приема
                                </Typography>
                                <Typography>
                                  {collectionPointTypes[
                                    item.variant
                                  ].toLowerCase()}
                                </Typography>
                              </Box>

                              <Box>
                                <Typography gutterBottom>
                                  <Link
                                    href={`/collection-points/${item._id}`}
                                    sx={{
                                      color: 'secondary.dark',
                                      '&:visited': {
                                        color: '#fff',
                                      },
                                    }}
                                  >
                                    Посмотреть
                                  </Link>
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </Box>
                      )
                    })}
                  </Stack>
                  <DataGridFooter
                    numRows={data.pagination.total}
                    pageSize={data.pagination.pageSize}
                    page={data.pagination.page}
                    handlePageChange={(
                      _: React.ChangeEvent<unknown>,
                      newPage: number,
                    ) => {
                      const href = getHref({
                        page: newPage,
                        pageSize: data.pagination.pageSize,
                      })
                      router.push(href)
                    }}
                    handlePageSizeChange={(event: SelectChangeEvent) => {
                      Cookies.set('pageSize', event.target.value.toString())

                      const newPageSize = event.target.value

                      const href = getHref({
                        page: 1,
                        pageSize: parseInt(newPageSize, 10),
                      })

                      router.push(href)
                    }}
                    renderItem={(item) => <PaginationItem {...item} />}
                  />
                </Container>
              ) : (
                <NoRows />
              )}
            </Box>
            <Footer />
          </Box>
        </AdWrapper>
      </Box>
    </>
  )
}
