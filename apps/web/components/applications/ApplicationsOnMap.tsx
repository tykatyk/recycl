import { useEffect, useState } from 'react'
import MapLayout from '../layouts/MapLayout'
import Map from '../uiParts/Map'
import Marker from '../uiParts/Marker'
import Snackbars from '../uiParts/Snackbars'
import MapSidebarWasteTypes from '../uiParts/MapSidebarWasteTypes'
import MapSidebar from '../uiParts/MapSidebar'
import UserLocation from '../uiParts/UserLocation'
import MapInfoWindow from '../uiParts/MapInfoWindow'
import getUserLocation from '../../lib/helpers/getUserLocation'
import { GET_REMOVAL_APPLICATIONS_FOR_MAP } from '../../lib/graphql/queries/removalApplication'
import { useLazyQuery } from '@apollo/client'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import { css } from '@emotion/react'
import { Box } from '@mui/material'
import type { Position } from '../../lib/types/placeAutocomplete'

const containerCss = {
  maxWidth: 'md',
  display: 'flex',
  flex: '1 1 auto',
}

export default function RemovalApplicationsPage() {
  const [center, setCenter] = useState<Position | null>(null)
  const [zoom, setZoom] = useState(11)
  const [locationError, setLocationError] = useState(false)
  const [wasteTypeOpen, setWasteTypeOpen] = useState(true)
  const [selectedValue, setSelectedValue] = useState('')
  const [visibleRect, setVisibleRect] = useState([])
  const [getApplications, { loading, error, data }] = useLazyQuery(
    GET_REMOVAL_APPLICATIONS_FOR_MAP,
  )
  const [markers, setMarkers] = useState([])
  useEffect(() => {
    if (!getApplications || visibleRect.length == 0) return

    getApplications({
      variables: {
        visibleRect: visibleRect,
        wasteTypes: selectedValue,
      },
    })
  }, [visibleRect, selectedValue, getApplications])

  useEffect(() => {
    if (
      data &&
      data.getRemovalApplicationsForMap &&
      data.getRemovalApplicationsForMap.length > 0
    ) {
      const markersToShow = data.getRemovalApplicationsForMap.map(
        (element, index: number) => {
          const coords = {
            lat: element.wasteLocation[1],
            lng: element.wasteLocation[0],
          }

          return (
            <Marker key={index} position={coords}>
              <MapInfoWindow
                cityId={element._id}
                wasteTypeId={element.wasteTypeId}
                totalProposals={element.totalProposals}
                totalWeight={element.totalWeight}
              />
            </Marker>
          )
        },
      )
      setMarkers(markersToShow)
    } else {
      setMarkers([])
    }
  }, [data])

  const handleChange = (value) => () => {
    setSelectedValue(value)
  }

  const handleWasteTypeToggle = () => {
    setWasteTypeOpen(!wasteTypeOpen)
  }

  const onIdle = (m) => {
    setZoom(m.getZoom())
    setCenter(m.getCenter().toJSON())
    const bounds = m.getBounds()
    const boundsNeLatLng = bounds.getNorthEast()
    const boundsSwLatLng = bounds.getSouthWest()
    const boundsNwLatLng = new google.maps.LatLng(
      boundsNeLatLng.lat(),
      boundsSwLatLng.lng(),
    )
    const boundsSeLatLng = new google.maps.LatLng(
      boundsSwLatLng.lat(),
      boundsNeLatLng.lng(),
    )

    const visibleRect = [
      [
        [boundsNeLatLng.lng(), boundsNeLatLng.lat()],
        [boundsSeLatLng.lng(), boundsSeLatLng.lat()],
        [boundsSwLatLng.lng(), boundsSwLatLng.lat()],
        [boundsNwLatLng.lng(), boundsNwLatLng.lat()],
        // [boundsNeLatLng.lng(), boundsNeLatLng.lat()],
      ],
    ]
    setVisibleRect(visibleRect)
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

  let content

  if (locationError) {
    content = (
      <Box component="main" sx={containerCss}>
        <UserLocation
          setCenter={setCenter}
          setLocationError={setLocationError}
        />
      </Box>
    )
  } else {
    content = (
      <>
        <MapSidebar>
          <MapSidebarWasteTypes
            open={wasteTypeOpen}
            onClick={handleWasteTypeToggle}
            handleChange={handleChange}
            selectedValue={selectedValue}
          />
        </MapSidebar>
        {!!error && (
          <Snackbars
            message="Ошибка при загрузке данных"
            severity="error"
            open={true}
          />
        )}
        <Box component="main" sx={containerCss}>
          <Map center={center} zoom={zoom} onIdle={onIdle}>
            {markers}
          </Map>
        </Box>
      </>
    )
  }

  const render = (status) => {
    if (status === Status.LOADING) return <PageLoadingCircle />

    if (status === Status.FAILURE) {
      return (
        <Snackbars
          severity="error"
          open={true}
          message="Не могу загрузить карту"
        />
      )
    }
    return null
  }

  return (
    <MapLayout title="Сдать отходы | Recycl">
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY || ''}
        render={render}
        libraries={['places', 'geocoding']}
        language="uk"
      >
        {content}
      </Wrapper>
    </MapLayout>
  )
}
