import { APIProvider, ControlPosition, Map } from '@vis.gl/react-google-maps'
import {
  ClusterMarker,
  IndividualPointMarker,
  CollectivelPointMarker,
} from './Marker'
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import type {
  FeatureProperties,
  BBox,
  MapCenter,
} from '@recycl/shared/dist/server/types'
import Supercluster, { ClusterProperties } from 'supercluster'

//Ukraine
const countryBounds = {
  north: 52.38,
  south: 44.38,
  west: 22.13,
  east: 40.22,
}

const googleMapId = 'd80f8976374eb93b825a20cf'
const initialZoom = 13

type MapComponentProps = {
  data: (
    | Supercluster.ClusterFeature<ClusterProperties>
    | Supercluster.PointFeature<FeatureProperties>
  )[]
  children: ReactElement
  setVisibleRect: (bbox: BBox) => void
  setZoom: (zoom: number) => void
  center: MapCenter
}

export default function MapComponent(props: MapComponentProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState('')
  const mapRef = useRef<google.maps.Map | null>(null)
  const isResizing = useRef(false)
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null)
  const { setVisibleRect, data, setZoom, center, children } = props

  const updateMapState = useCallback((map: google.maps.Map) => {
    const bounds = map.getBounds()
    const zoom = map.getZoom()

    if (!bounds || zoom == null) return

    const ne = bounds.getNorthEast()
    const sw = bounds.getSouthWest()

    setVisibleRect([sw.lng(), sw.lat(), ne.lng(), ne.lat()] as BBox)

    setZoom(zoom)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      isResizing.current = true

      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current)
      }

      resizeTimeout.current = setTimeout(() => {
        if (mapRef.current) {
          updateMapState(mapRef.current)
        }
        isResizing.current = false
      }, 300)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current)
      }
    }
  }, [updateMapState])

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
          mapRef.current = event.map

          if (!isResizing.current) {
            updateMapState(event.map)
          }
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
                    wasteType={element.properties.wasteType}
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
