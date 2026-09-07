import { dbConnect, CollectionPointModel } from '@recycl/shared/dist/server/db'
import { responseErrorCodes } from '../../lib/helpers/responses'
import {
  adSearchFormSchema,
  paginationPageNumberSchema,
  paginationPageSizeSchema,
} from '../../lib/validation'
import getCoords from '../../lib/helpers/getCoords'
import { rowsPerPageOptions } from '../../lib/helpers/eventHelpers'
import * as yup from 'yup'
import { documentActivityStatus } from '@recycl/shared/dist/constants'
import Header from '../../components/uiParts/header/Header'
import {
  Box,
  ListItem,
  Container,
  Stack,
  Paper,
  Typography,
  Chip,
  SelectChangeEvent,
  PaginationItem,
} from '@mui/material'
import Cookies from 'js-cookie'
import Head from 'next/head'
import Link from '../../components/uiParts/Link'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useState, useCallback, useEffect } from 'react'
import {
  drawerWidth,
  AdWrapper,
} from '../../components/uiParts/AdPageComponents'
import AdSidebar from '../../components/uiParts/AdSidebar'
import AdSidebarChangeView from '../../components/uiParts/AdSidebarChangeView'
import AdSidebarHeader from '../../components/uiParts/AdSidebarHeader'
import AdSidebarItemsCommon from '../../components/uiParts/AdSidebarItemsCommon'
import AdSidebarItemsList from '../../components/uiParts/AdSidebarItemsList'
import DataGridFooter from '../../components/uiParts/DataGridFooter'
import Footer from '../../components/uiParts/Footer'
import NoRows from '../../components/uiParts/NoRows'
import { HrefOptions } from '../../lib/types/pagination'
import { useTranslations } from 'next-intl'
import type { CollectionPoint } from '../../lib/types/collectionPoint'
import CanonicalUrl from '../../components/uiParts/CanonicalUrl'

const { INTERNAL_SERVER_ERROR } = responseErrorCodes

const baseUrl = '/collection-points/list'
const mapViewUrl = '/collection-points'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

async function getPlaceCoordinates(placeId: string) {
  await dbConnect()
  const existing = await CollectionPointModel.findOne({
    'wasteLocation.place_id': placeId,
  })

  if (existing) {
    return existing.location.position.coordinates
  }

  return getCoords(placeId)
}

type CollectionPointsOnListProps =
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

export default function CollectionPointsListView(
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
  const t = useTranslations('CollectionPointsListViewPage')
  const tCollectionPointTypes = useTranslations('CollectionPointTypes')
  const router = useRouter()
  const { locale, locales, defaultLocale, asPath } = router

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
      const pageRoute = queryString ? `${baseUrl}?${queryString}` : baseUrl

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
                                  {t('collectionPointLocation')}
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
                                  {t('wasteTypes')}
                                </Typography>
                                <Stack spacing={2} direction={'row'}>
                                  {item.wasteTypes.map((waste) => {
                                    return (
                                      <Chip
                                        label={`${waste} ${t('quantityDimension')}`}
                                      />
                                    )
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
                                  {t('collectionPointType')}
                                </Typography>
                                <Typography>
                                  {tCollectionPointTypes(item.variant)}
                                </Typography>
                              </Box>

                              {item.variant === 'mobile' && (
                                <Box sx={{ mb: 2 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 'fontWeightLight',
                                      color: 'grey.400',
                                    }}
                                  >
                                    {t('startingDate')}
                                  </Typography>
                                  <Typography>
                                    {new Intl.DateTimeFormat('ru-RU', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                    }).format(new Date(item.date))}
                                  </Typography>
                                </Box>
                              )}

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
                                    {t('view')}
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

export async function getServerSideProps({ query, locale }) {
  //ToDo: add verification that locationDescription really belongs to locationId
  const messages = (await import(`../../messages/${locale}.json`)).default

  try {
    const {
      searchRadius = 0,
      locationDescription = '',
      locationId = '',
      wasteType = '',
      page = 1,
      pageSize = rowsPerPageOptions[0],
    } = query

    await adSearchFormSchema.validate(
      { searchRadius, wasteLocation: locationDescription, wasteType },
      {
        stripUnknown: true,
      },
    )

    const paginationValidationSchema = yup.object({
      page: paginationPageNumberSchema,
      pageSize: paginationPageSizeSchema,
    })

    const validatedQuery = await paginationValidationSchema.validate(
      { page, pageSize },
      {
        stripUnknown: true,
      },
    )

    const { page: validPage, pageSize: validPageSize } = validatedQuery

    const filter: Record<string, unknown> = {
      status: documentActivityStatus.active,
    }

    if (wasteType) {
      filter.wasteTypes = wasteType
    }

    const wasteLocation =
      locationDescription && locationId
        ? {
            description: locationDescription,
            place_id: locationId,
          }
        : null

    if (wasteLocation) {
      const coordinates = await getPlaceCoordinates(locationId)

      if (!coordinates || coordinates.length < 2) {
        throw new Error('Coordinates are incorrect')
      }

      if (searchRadius) {
        filter['location.position'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates,
            },
            $maxDistance: searchRadius * 1000, // Distance in meters
          },
        }
      } else {
        filter['location.place_id'] = locationId
      }
    }

    await dbConnect()
    const skip = Math.max(validPage - 1, 0) * validPageSize
    const collectionPoints = await CollectionPointModel.find(filter)
      .skip(skip)
      .limit(validPageSize)
      .sort({ updatedAt: -1 })
      .select('user location wasteTypes date variant')
      .lean()

    return {
      props: {
        status: 'success',
        data: {
          ads: JSON.parse(JSON.stringify(collectionPoints)),
          wasteType,
          wasteLocation:
            locationDescription && locationId
              ? {
                  description: locationDescription,
                  place_id: locationId,
                }
              : null,
          searchRadius,
          pagination: {
            total: collectionPoints.length,
            page: validPage,
            pageSize: validPageSize,
          },
        },
        messages,
      },
    }
  } catch (error) {
    return {
      props: {
        status: 'error',
        message: INTERNAL_SERVER_ERROR,
        messages,
      },
    }
  }
}
