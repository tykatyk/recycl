import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  Paper,
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

const errorMessage = 'Что-то пошло не так'

//ToDo: add ads type
export default function AdsOnList({ ads }) {
  const [selectedValue, setSelectedValue] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const handleChange = (value: string) => setSelectedValue(value)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const router = useRouter()

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const {
    wasteType: queryWasteType,
    wasteLocation: queryWasteLocation,
    searchRadius: querySearchRadius,
    page: queryPage,
    limit: queryLimit,
  } = router.query

  const validSearchRadius =
    Number.parseInt(
      querySearchRadius && typeof querySearchRadius === 'string'
        ? querySearchRadius
        : '',
      10,
    ) || 0

  const handleSubmit = useCallback(async (values) => {
    try {
      const { wasteType, wasteLocation, searchRadius } = values

      const query = new URLSearchParams()

      if (wasteType) {
        query.set('wasteType', wasteType)
      }
      if (wasteLocation) {
        query.set('wasteLocation', wasteLocation.place_id)
      }

      if (searchRadius) {
        query.set('searchRadius', String(searchRadius))
      }

      const queryString = query.toString()
      const pageRoute = queryString ? `/ads/list?${queryString}` : '/ads/list'

      router.push(pageRoute)
    } catch (error) {
      // console.log(error)
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }, [])

  useEffect(() => {
    if (!selectedValue) return

    // const fetcher = async () => {
    //   try {
    //     const query = new URLSearchParams({
    //       wasteType: selectedValue,
    //     })

    //     const response = await fetch(`/api/ads?${query.toString()}`)

    //     if (!response.ok) {
    //       throw new Error('Response is not OK')
    //     }

    //     const data  = await response.json()

    //     if (data) {
    //       //ToDo: implement
    //     } else {
    //       //ToDo: implement
    //     }
    //   } catch (error) {
    //     console.log(error)
    //     enqueueSnackbar(errorMessage, {
    //       variant: 'error',
    //     })
    //   }
    // }

    // fetcher()
  }, [selectedValue])

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
          id="22"
          sx={{
            width: drawerWidth,
          }}
          drawerOpen={drawerOpen}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
        >
          <AdSidebarItemsList
            handleChange={setSelectedValue}
            handleSubmit={handleSubmit}
            initialFormValues={{ searchRadius: validSearchRadius }}
          />
        </AdSidebar>

        <AdWrapper drawerOpen={drawerOpen} id="21">
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
                justifyContent: ads.length > 0 ? 'flex-start' : 'center',
                alignItems: ads.length > 0 ? 'flex-start' : 'center',
              }}
            >
              {ads.length > 0 ? (
                <Container maxWidth="md" sx={{ pt: 2, pb: 2 }}>
                  <Stack spacing={2} sx={{ width: '100%' }}>
                    {ads.map((item, index) => {
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
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 'fontWeightLight',
                                    color: 'grey.400',
                                  }}
                                >
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
