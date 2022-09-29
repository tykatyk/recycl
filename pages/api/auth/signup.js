import { initializeApollo } from '../../../lib/apolloClient/apolloClient'
import { hash } from 'bcrypt'
import {
  CREATE_USER,
  DELETE_NOT_CONFIRMED_USER,
  GET_USER_BY_EMAIL,
} from '../../../lib/graphql/queries/user'
import { registerSchema } from '../../../lib/validation'
import { checkCaptcha } from '../../../lib/checkCaptcha'
import sendEmail from '../../../lib/sendEmail'
import {
  errorResponse,
  captchaNotPassedResponse,
} from '../../../lib/helpers/responses'
const apolloClient = initializeApollo()

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password, confirmPassword, role, recaptcha } = req.body

    const captchaPassed = await checkCaptcha(recaptcha)
    if (!captchaPassed) return captchaNotPassedResponse(res)

    //check correctness of data needed to create a user
    try {
      await registerSchema.validate(
        {
          name,
          email,
          password,
          confirmPassword,
          role,
        },
        { abortEarly: false }
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
      res.status(500).json({
        error: {
          type: 'perForm',
          message: 'Возникла ошибка при проверке существования пользователя',
        },
      })
      return
    }

    if (result && result.data && result.data.getUserByEmail) {
      const { _id, emailConfirmed, confirmEmailExpires } =
        result.data.getUserByEmail

      //User exists and didn't confrim his email and confirmation time expired
      if (
        !emailConfirmed &&
        typeof confirmEmailExpires != undefined &&
        new Date(confirmEmailExpires * 1000) >= Date.now()
      ) {
        //delete this user
        try {
          await apolloClient.mutate({
            mutation: DELETE_NOT_CONFIRMED_USER,
            variables: { id: _id },
          })
        } catch (error) {
          console.log(error)
          res.status(500).json({
            error: {
              type: 'perForm',
              message: 'Невозможно создать пользователя',
            },
          })
          return
        }
      }

      //User exists but confirmation didn't expired yet
      if (
        emailConfirmed ||
        (!emailConfirmed &&
          typeof confirmEmailExpires != undefined &&
          new Date(confirmEmailExpires * 1000) < Date.now())
      ) {
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
            password: await hash(
              password,
              parseInt(process.env.HASHING_ROUNDS, 10)
            ),
            roles: [role],
          },
        },
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: {
          type: 'perForm',
          message: 'Возникла ошибка при создании пользователя',
        },
      })
    }

    if (user.data && user.data.createUser) {
      // send email
      const actionUrl = `${process.env.NEXT_PUBLIC_URL}auth/confirmemail/${user.data.createUser.confirmEmailToken}`
      const dynamicTemplateData = {
        name: user.data.createUser.name,
        hostUrl: process.env.NEXT_PUBLIC_URL,
        actionUrl,
        date: new Date().getFullYear(),
      }
      const frontendMessage =
        'Для завершения регистрации перейдите по ссылке из письма, которое отправлено на ваш почтовый ящик'

      //ToDo: Maybe don't return to frontend since response may contain sensetive data
      return await sendEmail(res, {
        to: email,
        frontendMessage,
        templateId: 'd-88f884602ecc4588805b1f99d715bd22',
        dynamicTemplateData,
      })
    }

    return res.status(500).json({
      error: {
        type: 'perForm',
        message: 'Неизвестная ошибка сервера',
      },
    })
  } else {
    console.log('Only POST method is allowed')
    return res.status(500).json({
      error: {
        type: 'perForm',
        message: 'Only POST method is allowed',
      },
    })
  }
}
