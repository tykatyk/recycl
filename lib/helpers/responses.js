import mapErrors from '../mapErrors'

export const errorResponse = function (error, res) {
  let mappedErrors = mapErrors(error)
  if (mappedErrors) {
    return res.status(422).json({
      error: {
        type: 'perField',
        message: mappedErrors,
      },
    })
  } else {
    return res.status(500).json({
      error: {
        type: 'perForm',
        message: 'Возникла ошибка при проверке данных формы',
      },
    })
  }
}

export const captchaNotPassedResponse = function (res) {
  return res.status(401).json({
    error: {
      type: 'perForm',
      message: 'Пожалуйста, подтвердите что вы не робот',
    },
  })
}
