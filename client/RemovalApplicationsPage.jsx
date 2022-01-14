import React, { useEffect, useState } from 'react'
import { Divider } from '@material-ui/core'
import MapLayout from './layouts/MapLayout.jsx'
import Map from './uiParts/Map.jsx'
import MapSidebarQuantity from './uiParts/MapSidebarQuantity'
import MapSidebarWasteTypes from './uiParts/MapSidebarWasteTypes'
import MapSidebar from './uiParts/MapSidebar.jsx'
import getUserLocation from '../lib/getUserLocation'

import { GET_REMOVAL_APPLICATIONS } from '../lib/graphql/queries/removalApplication'
import { useLazyQuery } from '@apollo/client'

export default function RemovalApplicationsPage() {
  const [center, setCenter] = useState(null)
  const [zoom, setZoom] = useState(null)
  const [min, setMin] = useState(null)
  const [max, setMax] = useState(null)
  const [wasteTypeOpen, setWasteTypeOpen] = useState(true)
  const [quantityOpen, setQuantityOpen] = useState(true)
  const [checked, setChecked] = useState([0])
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
  const handleQuantityToggle = () => {
    setQuantityOpen(!quantityOpen)
  }

  const onIdle = (m) => {
    console.log('onIdle')
    setZoom(m.getZoom())
    setCenter(m.getCenter().toJSON())
  }

  useEffect(() => {
    getUserLocation()
      .then((coordinates) => {
        setCenter(coordinates)
        setZoom(11)
      })
      .catch((error) => {
        //ToDo: Add UI for requesting a user to set location manually
        setCenter({ lat: 49.82, lng: 21.01 })
        setZoom(5)
      })
  }, [])

  return (
    <MapLayout title="Сбор отходов | Recycl">
      <>
        <MapSidebar>
          <MapSidebarQuantity
            min={min}
            max={max}
            open={quantityOpen}
            onClick={handleQuantityToggle}
          />
          <Divider variant="inset" component="li" />
          <MapSidebarWasteTypes
            open={wasteTypeOpen}
            onClick={handleWasteTypeToggle}
            handleChange={handleChange}
            checked={checked}
          />
        </MapSidebar>
        <main style={{ display: 'flex', flex: '1 1 auto' }}>
          <Map center={center} zoom={zoom} onIdle={onIdle} />
        </main>
      </>
    </MapLayout>
  )
}
