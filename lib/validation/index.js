import loginSchema from './login'
import registerSchema from './register'
import removalApplicationSchema from './removalApplication'
import { email, password } from './atomicSchemas'
import contactsSchema from './contacts'
// import emailIsUnique from './customValidators/emailIsUnique'

export {
  loginSchema,
  registerSchema,
  removalApplicationSchema,
  email as emailSechema,
  password as passwordSchema,
  contactsSchema,
}
