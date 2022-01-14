import React, { useRef, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import Snackbar from './Snackbars.jsx'
import PageLoadingCircle from './PageLoadingCircle.jsx'

const useStyles = makeStyles((theme) => ({
  mapContainer: {
    flexGrow: 1,
  },
}))

const MapContainer = (props) => {
  const classes = useStyles()
  const ref = useRef()
  const [map, setMap] = useState(null)
  const { center, zoom, onIdle, children } = props

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center,
          zoom,
        })
      )
    }
  }, [ref, map])

  useEffect(() => {
    if (map) {
      ;[('click', 'idle')].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      )

      /*if (onClick) {
        map.addListener("click", onClick);
      }*/

      if (onIdle) {
        map.addListener('idle', () => onIdle(map))
      }
    }
  }, [onIdle])

  return (
    <>
      <div className={classes.mapContainer} ref={ref} id="map" />
      {children}
    </>
  )
}

export default function Map(props) {
  const { center, zoom, onIdle } = props
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

  if (!center || !zoom) return <PageLoadingCircle />

  return (
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      render={render}
    >
      <MapContainer center={center} zoom={zoom} onIdle={onIdle} />
    </Wrapper>
  )
}
