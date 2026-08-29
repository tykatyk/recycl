import * as yup from 'yup'
import { wasteArray, location, radius } from '@recycl/shared/dist/validation'

export const wasteAvailableSubscriptionSchema = yup.object({
  location,
  wasteTypes: wasteArray,
  radius,
})

export const wasteRemovalSubscriptionSchema = yup.object({
  radius,
})
