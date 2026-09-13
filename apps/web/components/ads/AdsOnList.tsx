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
import AdSidebarHeader from '../uiParts/AdSidebarHeader'
import type { Ad } from '@recycl/shared/dist/server/db/models/ad'
import { useTranslations } from 'next-intl'
import CanonicalUrl from '../uiParts/CanonicalUrl'

const listViewUrl = '/ads/list'
const mapViewUrl = '/ads'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

export type AdsOnListProps =
  | {
      status: 'error'
      message: string
    }
  | {
      status: 'success'
      data: {
        ads: (Ad & { _id: string })[]
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
export default function AdsOnList(props: AdsOnListProps) {
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
  const { locale, locales, defaultLocale, asPath } = router
  const t = useTranslations('AdsOnListPage')
  const tWasteTypes = useTranslations('WasteTypes')

  const getHref = useCallback(
    (options: HrefOptions) => {
      const { page, pageSize } = options

      const queryExists = Object.keys(router.query).length > 0
      if (!queryExists)
        return `${listViewUrl}?page=${page}&pageSize=${pageSize}`

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
      const pageRoute = queryString
        ? `${listViewUrl}?${queryString}`
        : listViewUrl

      return pageRoute
    },
    [router.query],
  )

  const { status } = props

  if (status !== 'success') {
    //ToDo: show err message
    enqueueSnackbar(t('errorMessage'), { variant: 'error' })
    return null
  }

  const { data } = props

  useEffect(() => {
    if (!data) {
      enqueueSnackbar(t('errorMessage'), { variant: 'error' })
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
      const pageRoute = queryString
        ? `${listViewUrl}?${queryString}`
        : listViewUrl

      router.push(pageRoute, undefined, { locale })
    } catch (error) {
      enqueueSnackbar(t('errorMessage'), { variant: 'error' })
    }
  }, [])

  return (
    <>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="description" content={t('metaDescription')} />
        <CanonicalUrl
          asPath={asPath}
          locale={locale}
          defaultLocale={defaultLocale}
          locales={locales}
        />
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
          <AdSidebarHeader headerText={t('sidebarHeader')} />
          <AdSidebarItemsList
            handleSubmit={handleSubmit}
            initialFormValues={initialFormValues}
            howSearchWorks={t('howSearchWorks')}
          />
          <AdSidebarChangeView
            listViewUrl={listViewUrl}
            mapViewUrl={mapViewUrl}
          />
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
                    {data.ads.map((item) => {
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
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                  {item.title}
                                </Typography>
                              </Box>
                              <Box sx={{ pb: 2 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 'fontWeightLight',
                                    color: 'grey.400',
                                  }}
                                >
                                  {t('wasteLocation')}
                                </Typography>
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
                                    label={tWasteTypes(item.wasteType)}
                                  />
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
                                  {`${t('lastUpdate')}: ${formattedDate}`}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography gutterBottom>
                                  <Link
                                    href={`/ads/${item._id}`}
                                    locale={locale}
                                    sx={{
                                      color: 'secondary.dark',
                                      '&:visited': {
                                        color: '#fff',
                                      },
                                    }}
                                  >
                                    {t('viewItem')}
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
                      router.push(href, undefined, { locale })
                    }}
                    handlePageSizeChange={(event: SelectChangeEvent) => {
                      Cookies.set('pageSize', event.target.value.toString())

                      const newPageSize = event.target.value

                      const href = getHref({
                        page: 1,
                        pageSize: parseInt(newPageSize, 10),
                      })

                      router.push(href, undefined, { locale })
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
