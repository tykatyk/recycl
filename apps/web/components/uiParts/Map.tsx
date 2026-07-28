import {
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
} from '@vis.gl/react-google-maps'
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { BBox, MapCenter } from '@recycl/shared/dist/server/types'
import PlacesSearchBar from './PlacesSearchBar'

const googleMapId = 'd80f8976374eb93b825a20cf'
export const initialZoom = 11

type MapComponentProps = {
  children: ReactElement
  setVisibleRect: (bbox: BBox) => void
  setZoom: (zoom: number) => void
  center: MapCenter
  setSelectedMarker: Dispatch<SetStateAction<string>>
}

export default function MapComponent(props: MapComponentProps) {
  const [mounted, setMounted] = useState(false)
  const mapRef = useRef<google.maps.Map | null>(null)
  const isResizing = useRef(false)
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null)
  const { setVisibleRect, setZoom, center, children, setSelectedMarker } = props

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
        // restriction={{
        //   latLngBounds: countryBounds,
        // }}
        onIdle={(event) => {
          mapRef.current = event.map

          if (!isResizing.current) {
            updateMapState(event.map)
          }
        }}
        onClick={() => setSelectedMarker('')}
      >
        <MapControl position={ControlPosition.TOP_CENTER}>
          <PlacesSearchBar />
        </MapControl>
        {children}
      </Map>
    </APIProvider>
  )
}
