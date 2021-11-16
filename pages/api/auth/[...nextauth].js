import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

import appoloClient from '../../../lib/appoloClient/appoloClient'
import { compare } from 'bcrypt'
import { GET_USER } from '../../../lib/graphql/queries/user'
import { loginSchema } from '../../../lib/validation'

export default NextAuth({
  session: {
    jwt: true,
  },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        // Any object returned will be saved in `user` property of the JWT
        // If you return null or false then the credentials will be rejected
        // You can also Reject this callback with an Error or with a URL:
        // throw new Error('error message') // Redirect to error page
        // throw '/path/to/redirect'        // Redirect to a URL

        const { email, password } = credentials

        //check correctness of data needed to ligin a user
        try {
          await loginSchema.validate(
            {
              email,
              password,
            },
            { abortEarly: false }
          )
        } catch (error) {
          console.log('Error during validation request body')
          if (error.inner && error.inner.length > 0) {
            let mappedErrors = {}
            error.inner.forEach((item, i) => {
              if (!mappedErrors[item.path])
                mappedErrors[item.path] = item.message
            })
            throw new Error(
              JSON.stringify({
                error: {
                  type: 'perField',
                  message: mappedErrors,
                },
              })
            )
          } else {
            throw new Error(
              JSON.stringify({
                type: 'perForm',
                message: 'Возникла ошибка при проверке данных формы',
              })
            )
          }
        }

        //if data is correct, check if user exists
        let result
        try {
          result = await appoloClient.query({
            query: GET_USER,
            variables: { email },
          })
        } catch (error) {
          console.log('Error while checking user existance')
          console.log(JSON.stringify(error, null, 2))
          throw new Error(
            JSON.stringify({
              type: 'perForm',
              message:
                'Возникла ошибка при проверке существования пользователя',
            })
          )
        }

        if (result.data && !result.data.getUser) {
          console.log('error while getting user from the database')
          throw new Error(
            JSON.stringify({
              type: 'perForm',
              message: 'Пользователь с такими учетными данными не найден',
            })
          )
        }

        let user = result.data.getUser

        const checkPassword = await compare(password, user.password)
        if (!checkPassword) {
          console.log('error while checing password')
          throw new Error(
            JSON.stringify({
              type: 'perForm',
              message: 'Пользователь с такими учетными данными не найден',
            })
          )
        }

        return { email: user.email }
      }, //end of authorize function
    }),
  ],
  pages: {
    signIn: '/login',
  },

  callbacks: {
    jwt: ({ token, user, account }) => {
      // first time jwt callback is run, user object is available
      if (user) {
        token.id = user.id
      }

      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id
      }

      return session
    },
  },
  secret: process.env.AUTH_SECRET,
  jwt: {
    encryption: true,
  },
})
