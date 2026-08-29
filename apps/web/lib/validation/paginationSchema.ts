import * as yup from 'yup'
import { rowsPerPageOptions } from '../helpers/eventHelpers'

const ONE_HUNDRED = 100
const min = rowsPerPageOptions[0]
const max = rowsPerPageOptions[rowsPerPageOptions.length - 1] ?? ONE_HUNDRED

export const paginationPageNumberSchema = yup
  .number()
  .transform((value) =>
    value === '' || isNaN(value) ? undefined : Math.max(value, 1),
  )
  .integer()
  .min(1)
  .default(1)

export const paginationPageSizeSchema = yup
  .number()
  .transform((value) => {
    if (value === '' || isNaN(value)) {
      return undefined
    }

    return Math.min(Math.max(value, min), max)
  })
  .integer()
  .default(min)
