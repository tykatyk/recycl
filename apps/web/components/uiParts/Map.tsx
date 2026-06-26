import { APIProvider, ControlPosition, Map } from '@vis.gl/react-google-maps'
import {
  ClusterMarker,
  IndividualPointMarker,
  CollectivelPointMarker,
} from './Marker'
import { useEffect, useState } from 'react'

//Ukraine
const countryBounds = {
  north: 52.38,
  south: 44.38,
  west: 22.13,
  east: 40.22,
}

const googleMapId = 'd80f8976374eb93b825a20cf'
const initialZoom = 13

export default function MapComponent(props) {
  const [mounted, setMounted] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState('')
  const { setVisibleRect, data, setZoom, center, children } = props

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !center) {
    return null
  }

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY || ''}
      language="uk"
    >
      <Map
        defaultCenter={center}
        defaultZoom={initialZoom}
        clickableIcons={false}
        mapTypeControl={true}
        mapTypeControlOptions={{
          position: ControlPosition.BOTTOM_LEFT,
        }}
        mapId={googleMapId}
        mapTypeId="roadmap"
        restriction={{
          latLngBounds: countryBounds,
        }}
        onIdle={(event) => {
          const map = event.map
          const bounds = map.getBounds()
          const zoom = map.getZoom()

          if (!bounds || !zoom) {
            console.error('Cannot get map params')
            return
          }

          const ne = bounds.getNorthEast()
          const sw = bounds.getSouthWest()

          const visibleRect = [sw.lng(), sw.lat(), ne.lng(), ne.lat()]
          setVisibleRect(visibleRect)
          setZoom(zoom)
        }}
      >
        <>
          {children}
          {data && data.length > 0
            ? data.map((element, index: number) => {
                const coords = {
                  lat: element.geometry.coordinates[1],
                  lng: element.geometry.coordinates[0],
                }

                if ('cluster' in element.properties) {
                  return (
                    <ClusterMarker
                      key={index}
                      position={coords}
                      totalPoints={element.properties.point_count}
                    ></ClusterMarker>
                  )
                }

                if ('adId' in element.properties) {
                  return (
                    <IndividualPointMarker
                      key={index}
                      position={coords}
                      title={element.properties.title}
                      placeId={element.properties.placeId}
                      placeDescription={element.properties.placeDescription}
                      weight={element.properties.weight}
                      adId={element.properties.adId}
                      selectedMarker={selectedMarker}
                      setSelectedMarker={setSelectedMarker}
                    />
                  )
                }

                return (
                  <CollectivelPointMarker
                    key={index}
                    position={coords}
                    placeId={element.properties.placeId}
                    placeDescription={element.properties.placeDescription}
                    weight={element.properties.weight}
                    selectedMarker={selectedMarker}
                    setSelectedMarker={setSelectedMarker}
                  />
                )
              })
            : null}
        </>
      </Map>
    </APIProvider>
  )
}
