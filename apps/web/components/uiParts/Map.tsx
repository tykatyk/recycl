import React, { useRef, useEffect, useState } from 'react'
import PageLoadingCircle from './PageLoadingCircle'
import PlacesSearchBar from '../applications/PlacesSearchBar'
import { Box } from '@mui/material'

export default function Map(props) {
  const { center, zoom = 11, onIdle, children } = props
  const mapRef = useRef()
  const [map, setMap] = useState<google.maps.Map | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!mapRef.current || !inputRef.current) return

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'formatted_address'],
    })

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()

      if (!map || !place.geometry?.location) return

      map.panTo(place.geometry.location)
    })

    return () => listener.remove()
  }, [map, mapRef.current, inputRef.current])

  useEffect(() => {
    if (!(window as any).google) return

    if (mapRef.current && !map) {
      setMap(
        new (window as any).google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: 'poi',
              stylers: [{ visibility: 'off' }],
            },
          ],
          clickableIcons: false,
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_LEFT,
          },
        }),
      )
    }
  }, [mapRef, map, center, zoom])

  useEffect(() => {
    if (!(window as any).google || !map) return
    ;['click', 'idle'].forEach((eventName) =>
      (window as any).google.maps.event.clearListeners(map, eventName),
    )

    if (onIdle) {
      map.addListener('idle', () => onIdle(map))
    }
  }, [map, onIdle])

  if (!center) return <PageLoadingCircle />

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
      <PlacesSearchBar map={map} />
      <Box style={{ flexGrow: 1 }} ref={mapRef} id="map" />
      {React.Children.map(children, (child) => {
        if (React.isValidElement<{ map: google.maps.Map }>(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map })
        }
      })}
    </Box>
  )
}
