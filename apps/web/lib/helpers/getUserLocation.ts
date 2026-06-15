import type { Position } from '../types/placeAutocomplete'

const getPositionByIp = async () => {
  return await fetch('https://geolocation-db.com/json/')
    .then((response) => response.json())
    .then(function (result) {
      return { lat: result.latitude, lng: result.longitude } as Position
    })
    .catch((error) => {
      console.log(error)
      throw new Error('Cannot get a position by IP')
    })
}

const getPositionByGeolocationAPI = () => {
  return new Promise<Position>((resolve, reject) => {
    if (typeof window === 'undefined' && !('geolocation' in navigator)) {
      reject('Geolocation API is unavailable')
      return
    }

    const geoOptions = {
      maximumAge: 5 * 60 * 1000,
      timeout: 10 * 1000,
      enableHighAccuracy: false,
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({ lat: coords.latitude, lng: coords.longitude } as Position)
      },
      (error) => {
        reject(error)
      },
      geoOptions,
    )
  })
}

export default async function getUserLocation() {
  try {
    return await getPositionByGeolocationAPI()
  } catch (error) {
    console.warn('Geolocation failed:', error)
  }

  try {
    return await getPositionByIp()
  } catch (error) {
    console.warn('IP geolocation failed:', error)
  }

  return null
}
