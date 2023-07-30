import loginSchema from './login.mjs'
import registerSchema from './register.mjs'
import removalApplicationSchema from './removalApplication.mjs'
import { email, password, phone, userLocation } from './atomicSchemas.mjs'
import contactsSchema from './contacts.mjs'
import changePasswordSchema from './changePassword.mjs'
import quantitySchema from './quantity.mjs'
import contactUsForm from './contactUsForm.mjs'
import chatForm from './chatForm.mjs'

export {
  loginSchema,
  registerSchema,
  removalApplicationSchema,
  email as emailSchema,
  password as passwordSchema,
  phone as phoneSchema,
  userLocation as userLocationSchema,
  contactsSchema,
  changePasswordSchema,
  quantitySchema,
  contactUsForm as contactUsSchema,
  chatForm as chatSchema,
}
