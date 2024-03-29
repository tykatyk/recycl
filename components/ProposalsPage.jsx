import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'

import MapLayout from './layouts/MapLayout'
import Map from './uiParts/Map'
import Marker from './uiParts/Marker'
import Snackbars from './uiParts/Snackbars'
import MapSidebarWasteTypes from './uiParts/MapSidebarWasteTypes'
import MapSidebar from './uiParts/MapSidebar'
import UserLocation from './uiParts/UserLocation'
import getUserLocation from '../lib/helpers/getUserLocation.js'
import { GET_REMOVAL_APPLICATIONS_FOR_MAP } from '../lib/graphql/queries/removalApplication'
import { useLazyQuery } from '@apollo/client'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import PageLoadingCircle from './uiParts/PageLoadingCircle'

const PREFIX = 'ProposalsPage'

const classes = {
  root: `${PREFIX}-root`,
}

const StyledMapLayout = styled(MapLayout)(({ theme }) => ({
  [`& .${classes.root}`]: {
    display: 'flex',
    flex: '1 1 auto',
  },
}))

export default function ProposalsPage() {
  const [center, setCenter] = useState(null)
  const [zoom, setZoom] = useState(11)
  const [locationError, setLocationError] = useState(false)
  const [wasteTypeOpen, setWasteTypeOpen] = useState(true)
  const [checked, setChecked] = useState('')
  const [visibleRect, setVisibleRect] = useState([])
  const [getApplications, { loading, error, data }] = useLazyQuery(
    GET_REMOVAL_APPLICATIONS_FOR_MAP
  )
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    if (visibleRect.length == 0) return

    getApplications({
      variables: {
        visibleRect: visibleRect,
        wasteTypes: checked,
      },
    })
  }, [visibleRect, checked, getApplications])

  useEffect(() => {
    if (
      data &&
      data.getRemovalApplicationsForMap &&
      data.getRemovalApplicationsForMap.length > 0
    ) {
      const markersToShow = data.getRemovalApplicationsForMap.map(
        (element, index) => {
          const coords = {}
          coords.lat = element.wasteLocation[1]
          coords.lng = element.wasteLocation[0]
          return <Marker key={index} position={coords} />
        }
      )
      setMarkers(markersToShow)
    } else {
      setMarkers([])
    }
  }, [data])

  const handleChange = (value) => () => {
    setChecked(value)
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
      boundsSwLatLng.lng()
    )
    const boundsSeLatLng = new google.maps.LatLng(
      boundsSwLatLng.lat(),
      boundsNeLatLng.lng()
    )

    const visibleRect = [
      [
        [boundsNeLatLng.lng(), boundsNeLatLng.lat()],
        [boundsSeLatLng.lng(), boundsSeLatLng.lat()],
        [boundsSwLatLng.lng(), boundsSwLatLng.lat()],
        [boundsNwLatLng.lng(), boundsNwLatLng.lat()],
        [boundsNeLatLng.lng(), boundsNeLatLng.lat()],
      ],
    ]
    setVisibleRect(visibleRect)
  }

  useEffect(() => {
    getUserLocation().then((coordinates) => {
      if (!coordinates.lat || !coordinates.lng) {
        setLocationError(true)
        return
      }
      setCenter(coordinates)
    })
  }, [])

  let content

  if (locationError) {
    content = (
      <main className={classes.root}>
        <UserLocation
          setCenter={setCenter}
          setLocationError={setLocationError}
        />
      </main>
    )
  } else {
    content = (
      <>
        <MapSidebar>
          <MapSidebarWasteTypes
            open={wasteTypeOpen}
            onClick={handleWasteTypeToggle}
            handleChange={handleChange}
            checked={checked}
          />
        </MapSidebar>
        {!!error && (
          <Snackbars
            message="Ошибка при загрузке данных"
            severity="error"
            open={true}
          />
        )}
        <main className={classes.root}>
          <Map center={center} zoom={zoom} onIdle={onIdle}>
            {markers}
          </Map>
        </main>
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
    <StyledMapLayout title="Сдать отходы | Recycl">
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY}
        render={render}
        libraries={['places', 'geocoding']}
      >
        {content}
      </Wrapper>
    </StyledMapLayout>
  )
}
