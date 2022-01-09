import React, { useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import Snackbar from './Snackbars.jsx'
import PageLoadingCircle from './PageLoadingCircle.jsx'

const useStyles = makeStyles((theme) => ({
  mapContainer: {
    flex: '1 1 auto',
    width: '100%',
  },
}))

const MapContainer = (props) => {
  const classes = useStyles()
  const { center, zoom } = props
  const ref = useRef()
  useEffect(() => {
    new window.google.maps.Map(ref.current, {
      center,
      zoom,
    })
  })
  return <div className={classes.mapContainer} ref={ref} id="map" />
}

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

export default function Map(props) {
  const { center, zoom } = props

  return (
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      render={render}
    >
      <MapContainer center={center} zoom={zoom} />
    </Wrapper>
  )
}
