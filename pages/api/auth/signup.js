import appoloClient from '../../../lib/appoloClient/appoloClient'
import { hash } from 'bcrypt'
import {
  CREATE_USER,
  GET_USER_BY_EMAIL,
} from '../../../lib/graphql/queries/user'
import { registerSchema } from '../../../lib/validation'
import mapErrors from '../../../lib/mapErrors'
import { checkCaptcha } from '../../../lib/checkCaptcha'
import sendEmail from '../../../lib/sendEmail'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password, confirmPassword, role, recaptcha } = req.body

    const captchaPassed = await checkCaptcha(recaptcha)

    if (!captchaPassed) {
      res.status(401).json({
        error: {
          type: 'perForm',
          message: 'Пожалуйста, подтвердите что вы не робот',
        },
      })
      return
    }

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
      console.log('Error during validation request body')

      let mappedErrors = mapErrors(error)
      if (mappedErrors) {
        res
          .status(422)
          .json({ error: { type: 'perField', message: mappedErrors } })
        return
      } else {
        res.status(500).json({
          error: {
            type: 'perForm',
            message: 'Возникла ошибка при проверке данных формы',
          },
        })
        return
      }
    }

    //if data is correct, check if user already exists
    try {
      let result = await appoloClient.query({
        query: GET_USER_BY_EMAIL,
        variables: { email },
      })

      if (result.data.getUserByEmail) {
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
    } catch (error) {
      res.status(500).json({
        error: {
          type: 'perForm',
          message: 'Возникла ошибка при проверке существования пользователя',
        },
      })
      console.log(error)
      return
    }

    //if user doesn't exist, create one
    let user = null
    try {
      user = await appoloClient.mutate({
        mutation: CREATE_USER,
        variables: {
          user: {
            name,
            email,
            password: await hash(password, 12),
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
      const to = email
      const subject = 'Подтверждение регистрации'

      const link = `${process.env.NEXT_PUBLIC_URL}auth/confirmemail/${user.data.createUser.confirmEmailToken}`
      const message = `Здравствуйте.\r\n
  Для завершения регистрации перейдите по ссылке ${link}\r\n
              Cсылка действительна на протяжении часа.\r\n
              Если вы не совершали это действие, просто проигнорируйте это письмо.\r\n`
      const frontendMessage =
        'Для завершения регистрации перейдите по ссылке, которая отправлена на ваш почтовый ящик'

      return await sendEmail(res, {
        to,
        subject,
        message,
        frontendMessage,
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
