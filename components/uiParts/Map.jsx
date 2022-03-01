import React, { useRef, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
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

      if (onIdle) {
        map.addListener('idle', () => onIdle(map))
      }
    }
  }, [map, onIdle])

  return (
    <>
      <div className={classes.mapContainer} ref={ref} id="map" />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map })
        }
      })}
    </>
  )
}

export default function Map(props) {
  const { center, zoom = 11, onIdle, children } = props

  if (!center) return <PageLoadingCircle />

  return (
    <MapContainer center={center} zoom={zoom} onIdle={onIdle}>
      {children}
    </MapContainer>
  )
}