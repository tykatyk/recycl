import axios from 'axios'

export default axios.create({
  baseURL: '/api/g',
  headers: {
    'Content-type': 'application/json',
  },
})
