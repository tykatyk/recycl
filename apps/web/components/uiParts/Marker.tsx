import { Box, Typography } from '@mui/material'
import {
  useAdvancedMarkerRef,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps'
import Link from './Link'
import type {
  WasteAdIndividualPoint,
  WasteAdCollectivePoint,
} from '@recycl/shared/src/server/types'

export function IndividualPointMarker({
  title,
  weight,
  adId,
  placeId,
  placeDescription,
  position,
  selectedMarker,
  setSelectedMarker,
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
                  href={`/applications/${adId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                >
                  Посмотреть объявление
                </Link>
              </Typography>
            </Box>
          </Box>
        </InfoWindow>
      )}
    </AdvancedMarker>
  )
}

export function CollectivelPointMarker({
  weight,
  placeId,
  placeDescription,
  position,
  selectedMarker,
  setSelectedMarker,
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
                  href={`/applications`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'blue',
                    '&:visited': {
                      color: 'purple',
                    },
                    textDecoration: 'none',

                    '&:hover': {
                      textDecoration: 'underline',
                      textDecorationColor: 'blue',
                    },

                    '&:visited:hover': {
                      textDecorationColor: 'purple',
                    },
                  }}
                >
                  Посмотреть все объявления
                </Link>
              </Typography>
            </Box>
          </Box>
        </InfoWindow>
      )}
    </AdvancedMarker>
  )
}

export function ClusterMarker({ totalPoints, position }) {
  const map = useMap()
  return (
    <AdvancedMarker
      position={position}
      onClick={() => {
        if (!map) return
        // Smoothly pan to the marker location
        map.panTo(position)
        const currZoom = map.getZoom()
        if (!currZoom) return
        // Set your desired zoom level (e.g., 15)
        map.setZoom(currZoom + 2)
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
