import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import MapLayout from './layouts/MapLayout.jsx'
import Map from './uiParts/Map.jsx'
import Marker from './uiParts/Marker.jsx'
import MapSidebarQuantity from './uiParts/MapSidebarQuantity'
import MapSidebarWasteTypes from './uiParts/MapSidebarWasteTypes'
import MapSidebar from './uiParts/MapSidebar.jsx'
import getUserLocation from '../lib/getUserLocation'
import { GET_REMOVAL_APPLICATIONS_FOR_MAP } from '../lib/graphql/queries/removalApplication'
import { useLazyQuery } from '@apollo/client'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: '1 1 auto',
  },
}))

export default function RemovalApplicationsPage() {
  const [center, setCenter] = useState(null)
  const [zoom, setZoom] = useState(null)
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [wasteTypeOpen, setWasteTypeOpen] = useState(true)
  const [quantityOpen, setQuantityOpen] = useState(true)
  const [checked, setChecked] = useState([0])
  const [getApplications, { loading, error, data }] = useLazyQuery(
    GET_REMOVAL_APPLICATIONS_FOR_MAP
  )
  const classes = useStyles()

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
    }
  }, [data])

  if (error) console.log(JSON.stringify(error, null, 2))

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
    getApplications({
      variables: {
        visibleRect: visibleRect,
      },
    })
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
    <MapLayout title="Получить отходы | Recycl">
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
        <main className={classes.root}>
          <Map center={center} zoom={zoom} onIdle={onIdle}>
            {markers}
          </Map>
        </main>
      </>
    </MapLayout>
  )
}
