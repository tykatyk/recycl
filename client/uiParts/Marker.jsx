import React, { useState, useEffect } from 'react'
import ReactDOMServer from 'react-dom/server'

export default function Marker(options) {
  const [marker, setMarker] = useState(null)
  const { children, map, ...rest } = options
  const [infoWindow, setInfoWindow] = useState(null)

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker())
    }

    if (children) {
      const content = ReactDOMServer.renderToString(children)
      setInfoWindow(
        new google.maps.InfoWindow({
          content,
        })
      )
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  useEffect(() => {
    if (marker) {
      marker.setOptions({ map, ...rest })
    }
    if (infoWindow) {
      marker.addListener('click', () => {
        
        infoWindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        })
      })
    }
  }, [marker, rest])

  return null
}
