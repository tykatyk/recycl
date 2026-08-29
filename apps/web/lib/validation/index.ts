import registerSchema from './register'
import adSchema from './ad'
import {
  paginationPageNumberSchema,
  paginationPageSizeSchema,
} from './paginationSchema'
import quantitySchema from './quantity'
import contactUsForm from './contactUsForm'
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
  quantitySchema,
  contactUsForm as contactUsSchema,
  collectionPointSchema,
  wasteAvailableSubscriptionSchema,
  wasteRemovalSubscriptionSchema,
  paginationPageNumberSchema,
  paginationPageSizeSchema,
  proposeWasteTypeSchema,
  adSearchFormSchema,
}
