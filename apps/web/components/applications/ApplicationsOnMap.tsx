import { useEffect, useState } from 'react'
import MapLayout from '../layouts/MapLayout'
import Map from '../uiParts/Map'
import MapSidebar from '../uiParts/MapSidebar'
import { Box } from '@mui/material'
import getUserLocation from '../../lib/helpers/getUserLocation'
import { useSnackbar } from 'notistack'
import UserLocation from '../uiParts/UserLocation'
import Supercluster from 'supercluster'
import type {
  ClusterProperties,
  FeatureProperties,
} from '@recycl/shared/dist/server/types'
import PlacesSearchBar from './PlacesSearchBar'

const errorMessage = 'Что-то пошло не так'

const mainCss = {
  display: 'flex',
  flex: '1 1 auto',
}

export default function RemovalApplicationsPage() {
  const [selectedValue, setSelectedValue] = useState('')
  const [visibleRect, setVisibleRect] = useState<number[]>([])
  const [clusters, setClusters] = useState<
    (
      | Supercluster.ClusterFeature<ClusterProperties>
      | Supercluster.PointFeature<FeatureProperties>
    )[]
  >([])
  const { enqueueSnackbar } = useSnackbar()
  const [zoom, setZoom] = useState(11)
  const [locationError, setLocationError] = useState(false)
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null,
  )

  const handleChange = (value: string) => setSelectedValue(value)

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
    if (visibleRect.length == 0 || !selectedValue) return

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
            | Supercluster.ClusterFeature<ClusterProperties>
            | Supercluster.PointFeature<FeatureProperties>
          )[]
        } = await response.json()

        if (data && data.clusters && data.clusters.length > 0) {
          setClusters(data.clusters)
        } else {
          setClusters([])
        }
      } catch (error) {
        console.log(error)
        enqueueSnackbar(errorMessage, {
          variant: 'error',
        })
      }
    }

    fetcher()
  }, [visibleRect, selectedValue])

  return (
    <MapLayout
      title={`Объявления о наличии вторсырья | ${process.env.NEXT_PUBLIC_BRAND}`}
    >
      <MapSidebar handleChange={handleChange} selectedValue={selectedValue} />

      <Box component="main" sx={mainCss}>
        {locationError ? (
          <UserLocation
            setCenter={setCenter}
            setLocationError={setLocationError}
          />
        ) : center ? (
          <Map
            center={center}
            setVisibleRect={setVisibleRect}
            data={clusters}
            setZoom={setZoom}
          >
            {<PlacesSearchBar />}
          </Map>
        ) : null}
      </Box>
    </MapLayout>
  )
}
