import React, { useState, useEffect } from 'react'
import ReactDOMServer from 'react-dom/server'

export default function Marker(options) {
  const [marker, setMarker] = useState(null)
  const { children, map, ...rest } = options
  const [infoWindow, setInfoWindow] = useState(null)
  const [listenerAdded, setListenerAdded] = useState(false)

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker())
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  useEffect(() => {
    if (children && !infoWindow) {
      setInfoWindow(
        new google.maps.InfoWindow({
          content,
        })
      )
    }
  }, [children])

  useEffect(() => {
    if (marker) {
      marker.setOptions({ map, ...rest })
    }
    if (infoWindow && !listenerAdded) {
      marker.addListener('click', () => {
        
        infoWindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        })
      })
      setListenerAdded(true)
    }
  }, [marker, rest])

  return null
}
