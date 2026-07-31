import { useEffect, useState } from 'react'
import Map from '../uiParts/Map'
import { Box } from '@mui/material'
import getUserLocation from '../../lib/helpers/getUserLocation'
import { useSnackbar } from 'notistack'
import UserLocation from '../uiParts/UserLocation'
import Supercluster from 'supercluster'
import type {
  BBox,
  WasteAdClusterProperties,
  AdFeature,
  MapCenter,
} from '@recycl/shared/dist/server/types'
import Header from '../uiParts/header/Header'
import Footer from '../uiParts/Footer'
import AdSidebar from '../uiParts/AdSidebar'
import AdSidebarItemsMap from '../uiParts/AdSidebarItemsMap'
import Head from '../uiParts/Head'
import { AdWrapper, drawerWidth } from '../uiParts/AdPageComponents'
import AdSidebarItemsCommon from '../uiParts/AdSidebarItemsCommon'
import { AdMarkers } from '../uiParts/Marker'

const errorMessage = 'Что-то пошло не так'

export default function AdsOnMap() {
  const [selectedValue, setSelectedValue] = useState('')
  const [visibleRect, setVisibleRect] = useState<BBox | null>(null)
  const [clusters, setClusters] = useState<
    (
      | Supercluster.ClusterFeature<WasteAdClusterProperties>
      | Supercluster.PointFeature<AdFeature>
    )[]
  >([])
  const { enqueueSnackbar } = useSnackbar()
  const [zoom, setZoom] = useState(11)
  const [locationError, setLocationError] = useState(false)
  const [center, setCenter] = useState<MapCenter | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [selectedMarker, setSelectedMarker] = useState('')

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  useEffect(() => {
    getUserLocation().then((coordinates) => {
      if (!coordinates) {
        setLocationError(true)
        return
      }
      setCenter(coordinates)
    })
  }, [])

  useEffect(() => {
    if (!visibleRect || !selectedValue) return

    const fetcher = async () => {
      try {
        const query = new URLSearchParams({
          zoom: zoom.toString(),
          bbox: visibleRect.join(','),
          wasteType: selectedValue,
        })

        if (typeof zoom !== 'number') {
          console.log('zoom is not number')
          return
        }
        const response = await fetch(`/api/ads?${query.toString()}`)

        if (!response.ok) {
          throw new Error('Response is not OK')
        }

        const data: {
          clusters: (
            | Supercluster.ClusterFeature<WasteAdClusterProperties>
            | Supercluster.PointFeature<AdFeature>
          )[]
        } = await response.json()

        if (data && data.clusters && data.clusters.length > 0) {
          setClusters(data.clusters)
        } else {
          setClusters([])
        }
      } catch (error) {
        enqueueSnackbar(errorMessage, {
          variant: 'error',
        })
      }
    }

    fetcher()
  }, [visibleRect, selectedValue])

  return (
    <>
      <Head
        title={`Карта наличия вторсырья | ${process.env.NEXT_PUBLIC_BRAND}`}
      />
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        {locationError ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Box
              component="main"
              sx={{
                display: 'flex',
                flexGrow: 1,
                flexDirection: 'column',
                p: 3,
              }}
            >
              <UserLocation
                setCenter={setCenter}
                setLocationError={setLocationError}
              />
            </Box>
            <Footer />
          </Box>
        ) : center ? (
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <AdSidebar
              sx={{
                width: drawerWidth,
              }}
              drawerOpen={drawerOpen}
              drawerWidth={drawerWidth}
              handleDrawerToggle={handleDrawerToggle}
            >
              <AdSidebarItemsMap
                handleChange={setSelectedValue}
                h1={'Карта наличия вторсырья'}
              />
              <AdSidebarItemsCommon
                isMapView={true}
                createElementText="Добавить объявление"
                createElementUrl={'/ads/create'}
                listViewUrl={'/ads/list'}
                mapViewUrl={'/ads'}
              />
            </AdSidebar>

            <AdWrapper
              drawerOpen={drawerOpen}
              sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
            >
              <Box
                component={'main'}
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
                <Map
                  center={center}
                  setVisibleRect={setVisibleRect}
                  setZoom={setZoom}
                  setSelectedMarker={setSelectedMarker}
                >
                  <AdMarkers
                    data={clusters}
                    selectedMarker={selectedMarker}
                    setSelectedMarker={setSelectedMarker}
                    contentVariant="wasteAvailableAds"
                  />
                </Map>
              </Box>
            </AdWrapper>
          </Box>
        ) : null}
      </Box>
    </>
  )
}
