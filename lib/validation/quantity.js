import * as yup from 'yup'
import messages from './messages'

const { required } = messages
const message = 'Только целые числа больше 0'
const NO_CONTEXT_MIN = 0
const NO_CONTEXT_MAX = 10_000_000

export default yup.object().shape(
  {
    min: yup
      .number()
      .integer('Только целые числа')
      .test('customMin', (value, testContext) => {
        const { options } = testContext
        if (
          options &&
          options.validationContext &&
          options.validationContext.min
        ) {
          const contextMin = options.validationContext.min
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
        is: (v) => {
          return v === 0 || v !== null
        },
        then: (schema) => {
          return schema.max(yup.ref('max'), 'Мин. больше макс.')
        },
      })
      .nullable(true)
      .transform((v, o) => (o === '' ? null : v)),

    max: yup
      .number()
      .integer('Только целые числа')
      .test('customMax', (value, testContext) => {
        const { options } = testContext
        if (
          options &&
          options.validationContext &&
          options.validationContext.min
        ) {
          const contextMax = options.validationContext.max
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
        is: (v) => {
          return v === 0 || v !== null
        },
        then: (schema) => {
          return schema.min(yup.ref('min'), 'Мин. больше Макс.')
        },
      })
      .nullable(true)
      .transform((v, o) => (o === '' ? null : v)),
  },
  [['min', 'max']]
)
