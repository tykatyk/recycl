import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { validationMessages: messages } = validation

const { onlyDigits, onlyIntegers } = messages
const NO_CONTEXT_MIN = 0
const NO_CONTEXT_MAX = 10_000_000

// This validation will work only if type of form's min and max inputs is set to "text".
// If type is set to "number" validation will fail
export default yup.object().shape(
  {
    min: yup
      .number()
      .typeError(onlyDigits)
      .integer(onlyIntegers)
      .test('customMin', (value, testContext) => {
        if (!value) return false

        const { options } = testContext
        if (options && options.context && options.context.min) {
          const contextMin = options.context.min
          if (value < contextMin) {
            return testContext.createError({
              message: `Минимум ${contextMin}`,
            })
          }
        } else {
          if (value < NO_CONTEXT_MIN) {
            return testContext.createError({
              message: `Минимум ${NO_CONTEXT_MIN}`,
            })
          }
        }

        return true
      })
      .when('max', {
        is: (v: any) => {
          return v !== null && v != undefined && !isNaN(v)
        },
        then: (schema) => {
          return schema.max(yup.ref('max'), 'Мин. больше макс.')
        },
      })
      .nullable()
      .transform((v, o) => (o === '' ? null : v)),

    max: yup
      .number()
      .typeError(onlyDigits)
      .integer(onlyIntegers)
      .test('customMax', (value, testContext) => {
        if (!value) return false

        const { options } = testContext
        if (options && options.context && options.context.min) {
          const contextMax = options.context.max

          if (value > contextMax) {
            return testContext.createError({
              message: `Максимум ${contextMax}`,
            })
          }
        } else {
          if (value > NO_CONTEXT_MAX) {
            return testContext.createError({
              message: `Максимум ${NO_CONTEXT_MAX}`,
            })
          }
        }

        return true
      })
      .when('min', {
        is: (v: any) => {
          return v !== null && v != undefined && !isNaN(v)
        },
        then: (schema) => {
          return schema.min(yup.ref('min'), 'Макс. меньше мин.')
        },
      })
      .nullable()
      .transform((v, o) => (o === '' ? null : v)),
  },
  [['min', 'max']],
)
