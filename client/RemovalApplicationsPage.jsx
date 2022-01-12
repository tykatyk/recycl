import React, { useEffect, useState } from 'react'
import MapLayout from './layouts/MapLayout.jsx'
import Map from './uiParts/Map.jsx'
import getCoordinates from '../lib/getCoordinates'

export default function RemovalApplicationsPage() {
  const [center, setCenter] = useState(null)
  const [zoom, setZoom] = useState(5)

  useEffect(() => {
    getCoordinates()
      .then((coordinates) => {
        setCenter(coordinates)
        setZoom(11)
      })
      .catch((error) => {
        setCenter({ lat: 49.82, lng: 21.01 })
      })
  }, [])

  return (
    <MapLayout title="Сбор отходов | Recycl">
      <Map center={center} zoom={zoom} />
    </MapLayout>
  )
}
