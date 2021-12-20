import appoloClient from '../../../lib/appoloClient/appoloClient'
import { hash } from 'bcrypt'
import {
  CREATE_USER,
  GET_USER_BY_EMAIL,
} from '../../../lib/graphql/queries/user'
import { registerSchema } from '../../../lib/validation'
import mapErrors from '../../../lib/mapErrors'
import { checkCaptcha } from '../../../lib/checkCaptcha'

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
    try {
      let result = await appoloClient.mutate({
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
      res.status(201).json({ user: result.data.createUser })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: {
          type: 'perForm',
          message: 'Возникла ошибка при создании пользователя',
        },
      })
    }
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
