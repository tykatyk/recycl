import { Client } from '@googlemaps/google-maps-services-js'

export default async function getCoords(placeId) {
  if (!placeId || typeof placeId !== 'string') return null

  let coords = []
  const client = new Client({})

  return client
    .geocode({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000,
    })
    .then((response) => {
      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0 &&
        response.data.results[0].geometry &&
        response.data.results[0].geometry.location
      ) {
        coords[0] = response.data.results[0].geometry.location.lng
        coords[1] = response.data.results[0].geometry.location.lat
        return coords
      }
      return null
    })
    .catch((error) => {
      console.log(error)
      return null
    })
}
