import * as yup from 'yup'
import { email, password } from './atomicSchemas.js'

export default yup.object().concat(password).concat(email)
