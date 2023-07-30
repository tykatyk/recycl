import * as yup from 'yup'
import { email, password } from './atomicSchemas.mjs'

export default yup.object().concat(password).concat(email)
