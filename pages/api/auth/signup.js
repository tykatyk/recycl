import appoloClient from '../../../lib/appoloClient/appoloClient'
import { hash } from 'bcrypt'
import { CREATE_USER, USER_EXISTS } from '../../../lib/graphql/queries/user'
import { registerSchema } from '../../../lib/validation'
import mapErrors from '../../../lib/mapErrors'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password, confirmPassword, role } = req.body

    //check correctness of data needed to create a user
    try {
      await registerSchema.validate(
        {
          username,
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
        query: USER_EXISTS,
        variables: { email },
      })

      if (result.data.userExists) {
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
            username,
            email,
            password: await hash(password, 12),
            roles: [role],
            isActive: true,
          },
        },
      })
      res.status(201).json({ user: result.data.createUser })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: {
          type: 'perForm',
          message: 'Возникла ошибка при создании пользователя',
        },
      })
    }
  } else {
    console.log('Only POST method is allowed')
    res.status(500).json({
      error: {
        type: 'perForm',
        message: 'Only POST method is allowed',
      },
    })
  }
}
