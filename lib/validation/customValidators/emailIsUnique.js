import * as yup from 'yup'
import appoloClient from '../../appoloClient/appoloClient'
import { USER_EXISTS } from '../../graphql/queries/user'

const defaultMessage = 'Этот адрес электронной почты уже используется'

yup.addMethod(yup.string, 'emailIsUnique', function (message = defaultMessage) {
  return this.transform(function (value, originalValue) {
    return this.isType(value) && value !== null ? value.toLowerCase() : value
  }).test('emailIsUnique', message, function (value) {
    const { path, createError } = this

    return new Promise((resolve, reject) => {
      appoloClient
        .query({
          query: USER_EXISTS,
          variables: { email: value },
        })
        .then((result) => {
          if (result.data && result.data.userExists) {
            // reject(this.createError({ path, message }))
            resolve(false)
          }

          resolve(true)
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })
})

export default yup.object().shape({
  email: yup.string().emailIsUnique(),
})
