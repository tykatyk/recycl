import fetchJsonp from 'fetch-jsonp'

const getPositionByIp = () => {
  const position = {}
  return fetchJsonp('https://geolocation-db.com/jsonp', {
    jsonpCallbackFunction: 'callback',
  })
    .then(function (response) {
      return response.json()
    })
    .then(function (json) {
      position.lat = json.latitude
      position.lng = json.longitude
      return position
    })
}

const getPositionByGeolocationAPI = () => {
  if (typeof window != 'undefined' && 'geolocation' in navigator) {
    return new Promise((resolve, reject) => {
      const geoOptions = {
        maximumAge: 5 * 60 * 1000,
        timeout: 10 * 1000,
        enableHighAccuracy: false,
      }

      const position = {}
      const success = (result) => {
        position.lat = result.coords.latitude
        position.lng = result.coords.longitude
        resolve(position)
      }

      const fail = (error) => {
        reject(error)
      }

      navigator.geolocation.getCurrentPosition(success, fail, geoOptions)
    })
  }

  return new Promise((resolve, reject) =>
    reject('Geolocation API is unavailable')
  )
}

export default function getCoordinates() {
  return getPositionByGeolocationAPI()
    .then((result) => {
      return result
    })
    .catch((error) => {
      return getPositionByIp()
    })
}
