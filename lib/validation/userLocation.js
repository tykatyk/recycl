import * as yup from 'yup'
import { location } from './atomicSchemas'

export default yup.object().shape({
  userLocation: location,
})
