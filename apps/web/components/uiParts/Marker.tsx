import { Box, Typography } from '@mui/material'
import {
  useAdvancedMarkerRef,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps'
import Link from './Link'
import {
  CollectionPointFeatureProperties,
  FeatureProperties,
} from '@recycl/shared/dist/server/types'
import { useState } from 'react'
import Supercluster, { ClusterProperties } from 'supercluster'

export const IndividualAdContent = ({
  adId,
  placeDescription,
  title,
  weight,
}) => {
  return (
    <Box sx={{ color: 'grey.800' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">{title}</Typography>
        <Typography>{placeDescription}</Typography>
      </Box>

      <Box mb={2}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 'light' }}
        >{`Вес вторсырья в объявлении: ${weight} кг.`}</Typography>
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: ' grey.800' }}>
          <Link
            href={`/ads/${adId}`}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            Посмотреть объявление
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export const IndividualCollectionPointContent = ({
  adId,
  placeDescription,
  // title,
}) => {
  return (
    <Box sx={{ color: 'grey.800' }}>
      <Box sx={{ mb: 2 }}>
        {/* <Typography variant="h5">{title}</Typography> */}
        <Typography>{placeDescription}</Typography>
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: ' grey.800' }}>
          <Link
            href={`/collection-points/${adId}`}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            Посмотреть объявление
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export function IndividualPointMarker({
  placeId,
  position,
  selectedMarker,
  setSelectedMarker,
  children,
}) {
  const [markerRef, marker] = useAdvancedMarkerRef()

  return (
    <AdvancedMarker
      position={position}
      ref={markerRef}
      onClick={() => {
        setSelectedMarker(placeId)
      }}
    >
      <Pin
        background={selectedMarker === placeId ? 'orange' : '#1a2b34'}
        borderColor={selectedMarker === placeId ? '#FF7518' : '#fff'}
        glyphColor={selectedMarker === placeId ? 'red' : '#fff'}
      />
      {selectedMarker === placeId && (
        <InfoWindow onCloseClick={() => setSelectedMarker('')} anchor={marker}>
          {children}
        </InfoWindow>
      )}
    </AdvancedMarker>
  )
}

const collectiveMarkerStyles = {
  '&:link': { color: 'blue', textDecoration: 'none' },
  '&:visited': { color: 'purple' },
  '&:hover': { textDecoration: 'underline' }, // Applies to both unless overridden
  '&:visited:hover': {
    textDecoration: 'underline',
    textDecorationColor: 'purple',
  },
}

export const AggregatedAdContent = ({
  placeDescription,
  weight,
  wasteType,
  placeId,
}) => {
  return (
    <Box sx={{ color: 'grey.800' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">
          {'В данной локации несколько объявлений'}
        </Typography>
        <Typography>{placeDescription}</Typography>
      </Box>

      <Box mb={2}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 'light' }}
        >{`Вес вторсырья в данной локации: ${weight} кг.`}</Typography>
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: 'blue' }}>
          <Link
            href={`/ads/list?wasteType=${wasteType}&locationDescription=${placeDescription}&locationId=${placeId}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={collectiveMarkerStyles}
          >
            Посмотреть все объявления
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export const AggregatedCollectionPointContent = ({
  placeDescription,
  wasteType,
  placeId,
}) => {
  return (
    <Box sx={{ color: 'grey.800' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">
          {'В данной локации несколько объявлений'}
        </Typography>
        <Typography>{placeDescription}</Typography>
      </Box>

      <Box>
        <Typography variant="body2" sx={{ color: 'blue' }}>
          <Link
            href={`/collection-points/list?wasteType=${wasteType}&locationDescription=${placeDescription}&locationId=${placeId}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={collectiveMarkerStyles}
          >
            Посмотреть все объявления
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export function AggregatedPointMarker({
  placeId,
  position,
  selectedMarker,
  setSelectedMarker,
  children,
}) {
  const [markerRef, marker] = useAdvancedMarkerRef()

  return (
    <AdvancedMarker
      position={position}
      ref={markerRef}
      onClick={() => {
        setSelectedMarker(placeId)
      }}
    >
      <Pin
        background={selectedMarker === placeId ? 'orange' : '#1a2b34'}
        borderColor={selectedMarker === placeId ? '#FF7518' : '#fff'}
        glyphColor={selectedMarker === placeId ? 'red' : '#fff'}
      />
      {selectedMarker === placeId && (
        <InfoWindow onCloseClick={() => setSelectedMarker('')} anchor={marker}>
          {children}
        </InfoWindow>
      )}
    </AdvancedMarker>
  )
}

export function AdMarkers(props: {
  data: (
    | Supercluster.ClusterFeature<ClusterProperties>
    | Supercluster.PointFeature<FeatureProperties>
  )[]
}) {
  const [selectedMarker, setSelectedMarker] = useState('')
  const { data } = props
  return data && data.length > 0
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
              placeId={element.properties.placeId}
              selectedMarker={selectedMarker}
              setSelectedMarker={setSelectedMarker}
            >
              <IndividualAdContent
                title={element.properties.title}
                placeDescription={element.properties.placeDescription}
                weight={element.properties.weight}
                adId={element.properties.adId}
              />
            </IndividualPointMarker>
          )
        }

        return (
          <AggregatedPointMarker
            key={index}
            position={coords}
            placeId={element.properties.placeId}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
          >
            <AggregatedAdContent
              placeId={element.properties.placeId}
              placeDescription={element.properties.placeDescription}
              wasteType={element.properties.wasteType}
              weight={element.properties.weight}
            />
          </AggregatedPointMarker>
        )
      })
    : null
}

export function CollectionPointMarkers(props: {
  data: (
    | Supercluster.ClusterFeature<ClusterProperties>
    | Supercluster.PointFeature<CollectionPointFeatureProperties>
  )[]
}) {
  const [selectedMarker, setSelectedMarker] = useState('')
  const { data } = props
  return data && data.length > 0
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
              placeId={element.properties.placeId}
              selectedMarker={selectedMarker}
              setSelectedMarker={setSelectedMarker}
            >
              <IndividualCollectionPointContent
                // title={element.properties.title}
                placeDescription={element.properties.placeDescription}
                // weight={element.properties.weight}
                adId={element.properties.adId}
              />
            </IndividualPointMarker>
          )
        }

        return (
          <AggregatedPointMarker
            key={index}
            position={coords}
            placeId={element.properties.placeId}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
          >
            <AggregatedCollectionPointContent
              placeId={element.properties.placeId}
              placeDescription={element.properties.placeDescription}
              wasteType={element.properties.wasteType}
              // weight={element.properties.weight}
            />
          </AggregatedPointMarker>
        )
      })
    : null
}

export function ClusterMarker({ totalPoints, position }) {
  const map = useMap()
  return (
    <AdvancedMarker
      position={position}
      onClick={() => {
        if (!map) return

        const currZoom = map.getZoom()
        if (!currZoom) return
        map.setZoom(currZoom + 2)
        map.panTo(position)
      }}
    >
      <>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: '#1a2b34',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            border: `3px solid #FF7518`,
          }}
        >
          {totalPoints}
        </Box>
      </>
    </AdvancedMarker>
  )
}
