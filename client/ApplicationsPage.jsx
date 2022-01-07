import React, { useRef, useEffect, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import Snackbar from './uiParts/Snackbars.jsx'
import MapLayout from './layouts/MapLayout.jsx'
import PageLoadingCircle from './uiParts/PageLoadingCircle.jsx'

const render = (status) => {
  if (status === Status.LOADING) return <PageLoadingCircle />

  if (status === Status.FAILURE) {
    return (
      <Snackbar
        severity="error"
        open={true}
        message="Не могу загрузить карту"
      />
    )
  }
  return null
}

const ApplicationsMap = (props) => {
  const { center, zoom } = props
  const ref = useRef()
  useEffect(() => {
    new window.google.maps.Map(ref.current, {
      center,
      zoom,
    })
  })

  return (
    <div
      style={{
        flex: '1 1 auto',
        width: '100%',
      }}
      ref={ref}
      id="map"
    />
  )
}

export default function ApplicationsPage() {
  const zoom = 11
  const [center, setCenter] = useState(null)
  useEffect(() => {
    if (typeof window != 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const centerPos = {}
          centerPos.lat = position.coords.latitude
          centerPos.lng = position.coords.longitude
          setCenter(centerPos)
        },
        (error) => {
          console.log('error is')
          console.log(error)
        }
      )
    } else if (typeof window != 'undefined' && !('geolocation' in navigator)) {
      console.log('Geolocation is not supported')
    }
  }, [])
  return (
    <MapLayout title="Recycl | Сбор отходов">
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        render={render}
      >
        <ApplicationsMap center={center} zoom={zoom} />
      </Wrapper>
    </MapLayout>
  )
}
