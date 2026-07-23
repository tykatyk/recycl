import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Chip,
  Container,
  PaginationItem,
  Paper,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import AdSidebarItemsList from '../uiParts/AdSidebarItemsList'
import AdSidebar from '../uiParts/AdSidebar'
import Head from '../uiParts/Head'
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

const errorMessage = 'Что-то пошло не так'
const baseUrl = '/ads/list'

//ToDo: add ads type
export default function AdsOnList(props) {
  const { enqueueSnackbar } = useSnackbar()
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [initialFormValues, setInitialFormValues] = useState({
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
      <Head
        title={`Объявления о наличии вторсырья | ${process.env.NEXT_PUBLIC_BRAND}`}
      />
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
          <AdSidebarItemsList
            handleSubmit={handleSubmit}
            initialFormValues={initialFormValues}
          />
          <AdSidebarItemsCommon
            isMapView={false}
            createElementText="Добавить объявление"
            createElementUrl={'/ads/create'}
            listViewUrl={'/ads/list'}
            mapViewUrl={'/ads'}
          />
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
                      const creationDate = new Date(item.updatedAt)

                      const formattedDate = new Intl.DateTimeFormat('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(creationDate)

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
                              <Box>
                                <Typography variant="h6" gutterBottom>
                                  <Link
                                    href={`/ads/${item._id}`}
                                    sx={{
                                      color: '#fff',
                                      '&:visited': {
                                        color: 'secondary.dark',
                                      },
                                    }}
                                  >
                                    {item.title}
                                  </Link>
                                </Typography>
                              </Box>
                              <Box sx={{ pb: 2 }}>
                                <Typography>
                                  {item.wasteLocation.description}
                                </Typography>
                              </Box>
                              <Box sx={{ pb: 2 }}>
                                <Stack spacing={2} direction={'row'}>
                                  <Chip
                                    size="small"
                                    label={`${item.quantity} кг`}
                                  />
                                  <Chip
                                    size="small"
                                    label={`${item.wasteType}`}
                                  />
                                </Stack>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 'fontWeightLight',
                                    color: 'grey.400',
                                  }}
                                >
                                  {formattedDate}
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
