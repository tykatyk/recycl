import registerSchema from './register'
import adSchema from './ad'
import {
  password,
  userLocation,
  paginationPageNumberSchema,
  paginationPageSizeSchema,
} from './atomicSchemas'
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
  registerSchema,
  adSchema,
  password as passwordSchema,
  userLocation as userLocationSchema,
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
