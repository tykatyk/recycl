import React, { useEffect, useState } from 'react'
import MapLayout from './layouts/MapLayout.jsx'
import Map from './uiParts/Map.jsx'
import Marker from './uiParts/Marker.jsx'
import Snackbars from './uiParts/Snackbars.jsx'
import MapSidebarWasteTypes from './uiParts/MapSidebarWasteTypes'
import MapSidebar from './uiParts/MapSidebar.jsx'
import UserLocation from './uiParts/UserLocation.jsx'
import getUserLocation from '../lib/getUserLocation'
import { GET_REMOVAL_APPLICATIONS_FOR_MAP } from '../lib/graphql/queries/removalApplication'
import { useLazyQuery } from '@apollo/client'

export default function RemovalApplicationsPage() {
  const [center, setCenter] = useState(null)
  const [zoom, setZoom] = useState(11)
  const [locationError, setLocationError] = useState(true)
  const [wasteTypeOpen, setWasteTypeOpen] = useState(true)
  const [checked, setChecked] = useState([])
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
  }, [visibleRect])

  useEffect(() => {
    getApplications({
      variables: {
        visibleRect: visibleRect,
        wasteTypes: checked,
      },
    })
  }, [checked])

  useEffect(() => {
    if (
      data &&
      data.getRemovalApplicationsForMap &&
      data.getRemovalApplicationsForMap.length > 0
    ) {
      const markersToShow = data.getRemovalApplicationsForMap.map(
        (element, index) => {
          const coords = {}
          coords.lat = element.wasteLocation.position.coordinates[1]
          coords.lng = element.wasteLocation.position.coordinates[0]
          return <Marker key={index} position={coords} />
        }
      )
      setMarkers(markersToShow)
    } else {
      setMarkers([])
    }
  }, [data])

  const handleChange = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
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
    getUserLocation()
      .then((coordinates) => {
        setCenter(coordinates)
      })
      .catch((error) => {
        //ToDo: Add UI for requesting a user to set location manually
        setLocationError(true)
      })
  }, [])

  let content
  if (locationError) {
    content = (
      <main style={{ display: 'flex', flex: '1 1 auto' }}>
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
        <main style={{ display: 'flex', flex: '1 1 auto' }}>
          <Map center={center} zoom={zoom} onIdle={onIdle}>
            {markers}
          </Map>
        </main>
      </>
    )
  }

  return <MapLayout title="Сдать отходы | Recycl">{content}</MapLayout>
}
