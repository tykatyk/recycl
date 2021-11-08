import appoloClient from '../../../lib/appoloClient/appoloClient'
import { hash } from 'bcrypt'
import { CREATE_USER, USER_EXISTS } from '../../../lib/graphql/queries/user'
import registerSchema from '../../../lib/validation'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password, confirmPassword, role } = req.body

    //check correctness of data needed to create a user
    try {
      await registerSchema.validate({
        username,
        email,
        password,
        confirmPassword,
        role,
      })
    } catch (error) {
      res.status(422).json({ errors: err.errors })
      return
    }

    //if data is correct, check if user already exists
    try {
      let userExists = appoloClient
        .query(USER_EXISTS, { variables: { email } })
        .then((result) => {
          return result.data.userExists
        })

      if (userExists) {
        res
          .status(422)
          .json({ errors: ['Пользователь с таким email уже зарегистрирован'] })
        return
      }
    } catch (error) {
      res.status(500).json({
        errors: ['Возникла ошибка при проверке существования пользователя'],
      })
      console.log(JSON.stringify(error, null, 2))
      return
    }

    //if user doesn't exist create one
    try {
      appoloClient
        .mutate({
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
        .then((result) => {
          res.status(201).json({ user: result.data.createUser })
        })
    } catch (error) {
      res.status(500).json({
        errors: ['Возникла ошибка при создании пользователя'],
      })
      console.log(JSON.stringify(error, null, 2))
      return
    }
  } else {
    res.status(500).json({ errors: ['Only POST method is allowed'] })
  }
}
