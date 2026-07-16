import { Client } from '@googlemaps/google-maps-services-js'

export default async function getCoords(placeId: string) {
  if (!placeId || typeof placeId !== 'string') return null

  let coords: number[] = []
  const client = new Client({})

  return client
    .geocode({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_GEOCODING_KEY || '',
      },
      timeout: 1000,
    })
    .then((response) => {
      if (!response) return null
      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0 &&
        response.data.results[0]?.geometry &&
        response.data.results[0].geometry.location
      ) {
        const coords: [number, number] = [
          response.data.results[0].geometry.location.lng,
          response.data.results[0].geometry.location.lat,
        ]
        return coords
      }
      return null
    })
    .catch((error) => {
      console.log(error)
      return null
    })
}
