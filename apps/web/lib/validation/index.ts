import loginSchema from './login'
import registerSchema from './register'
import removalApplicationSchema from './removalApplication'
import {
  email,
  password,
  phone,
  userLocation,
  paginationPageNumberSchema,
  paginationPageSizeSchema,
} from './atomicSchemas'
import contactsSchema from './contacts'
import changePasswordSchema from './changePassword'
import quantitySchema from './quantity'
import contactUsForm from './contactUsForm'
import chatForm from './chatForm'
import { proposeWasteTypeSchema } from './proposeWasteType'
import { collectionPointSchema } from './collectionPointForm'
import { adSearchFormSchema } from './adSearchForm'
import {
  wasteAvailableSubscriptionSchema,
  wasteRemovalSubscriptionSchema,
} from './subscription'

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
  collectionPointSchema,
  wasteAvailableSubscriptionSchema,
  wasteRemovalSubscriptionSchema,
  paginationPageNumberSchema,
  paginationPageSizeSchema,
  proposeWasteTypeSchema,
  adSearchFormSchema,
}
