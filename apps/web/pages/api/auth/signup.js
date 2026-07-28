import { initializeApollo } from '../../../lib/apolloClient/apolloClient'
import {
  CREATE_USER,
  GET_USER_BY_EMAIL,
} from '../../../lib/graphql/queries/user'
import { registerSchema } from '../../../lib/validation'
import { checkCaptcha } from '../../../lib/helpers/checkCaptcha'
import { perFormErrorResponse } from '../../../lib/helpers/responses'
import {
  errorResponse,
  captchaNotPassedResponse,
} from '../../../lib/helpers/responses'
const apolloClient = initializeApollo()

export default async function handler(req, res) {
  if (!req.method === 'POST') {
    console.log('Only POST method is allowed')
    perFormErrorResponse('Only POST method is allowed', res)
  }

  const { name, email, role, recaptcha } = req.body

  const captchaPassed = await checkCaptcha(recaptcha)
  if (!captchaPassed) return captchaNotPassedResponse(res)

  //check correctness of data needed to create a user
  try {
    await registerSchema.validate(
      {
        name,
        email,

        role,
      },
      { abortEarly: false },
    )
  } catch (error) {
    console.log(error)
    return errorResponse(error, res)
  }

  //if data is correct, check if user already exists
  let result = null
  try {
    result = await apolloClient.query({
      query: GET_USER_BY_EMAIL,
      variables: { email },
    })
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
    perFormErrorResponse(
      'Возникла ошибка при проверке существования пользователя',
      res,
    )
    return
  }

  if (result && result.data && result.data.getUserByEmail) {
    //User already exists

    res.status(422).json({
      error: {
        type: 'perField',
        message: {
          email: 'Пользователь с таким email уже зарегистрирован',
        },
      },
    })
    return
  }

  //if user doesn't exist, create one
  let user = null
  try {
    user = await apolloClient.mutate({
      mutation: CREATE_USER,
      variables: {
        user: {
          name,
          email,

          roles: [role],
        },
      },
    })
  } catch (error) {
    console.log(error)
    perFormErrorResponse('Возникла ошибка при создании пользователя', res)
    return
  }

  //check if user created correctly
  if (!user.data || !user.data.createUser) {
    perFormErrorResponse('Неизвестная ошибка сервера', res)
  }

  // send email to complete registration
  const actionUrl = `${process.env.NEXT_PUBLIC_URL}auth/confirm-email/${user.data.createUser.confirmEmailToken}`
  const dynamicTemplateData = {
    name: user.data.createUser.name,
    hostUrl: process.env.NEXT_PUBLIC_URL,
    actionUrl,
    date: new Date().getFullYear(),
  }
  const frontendMessage = 'Регистрация прошла успешно. Теперь вы можете войти'
  res.status(200).json({
    message: frontendMessage,
  })
}
