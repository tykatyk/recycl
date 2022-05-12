import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { initializeApollo } from '../../../lib/apolloClient/apolloClient'
import { compare } from 'bcrypt'
import {
  GET_USER_BY_EMAIL,
  DELETE_NOT_CONFIRMED_USER,
} from '../../../lib/graphql/queries/user'
import { loginSchema } from '../../../lib/validation'
import nextAuthDbAdapter from '../../../lib/nextAuthDbAdapter'
import * as nodeUrl from 'url'
const apolloClient = initializeApollo()

export default NextAuth({
  session: {
    strategy: 'jwt',
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
          result = await apolloClient.query({
            query: GET_USER_BY_EMAIL,
            variables: { email },
          })
        } catch (error) {
          console.log('Error while checking user existance')
          throw new Error(
            JSON.stringify({
              type: 'perForm',
              message:
                'Возникла ошибка при проверке существования пользователя',
            })
          )
        }

        if (result.data && !result.data.getUserByEmail) {
          console.log('error while getting user from the database')
          throw new Error(
            JSON.stringify({
              type: 'perForm',
              message: 'Пользователь с такими учетными данными не найден',
            })
          )
        }

        const user = result.data.getUserByEmail
        const { _id, emailConfirmed, confirmEmailExpires } = user

        if (
          !emailConfirmed &&
          typeof confirmEmailExpires != undefined &&
          new Date(confirmEmailExpires * 1000) >= Date.now()
        ) {
          //delete this user
          await apolloClient.mutate({
            mutation: DELETE_NOT_CONFIRMED_USER,
            variables: { id: _id },
          })
          throw new Error(
            JSON.stringify({
              type: 'perForm',
              message: 'Пользователь с такими учетными данными не найден',
            })
          )
        }

        let checkPassword = false
        if (user.password) {
          checkPassword = await compare(password, user.password)
        }

        if (!checkPassword) {
          console.log('error while checing password')
          throw new Error(
            JSON.stringify({
              type: 'perForm',
              message: 'Пользователь с такими учетными данными не найден',
            })
          )
        }

        return {
          email: user.email,
          id: user['_id'],
          name: user.name,
          image: user.image,
        }
      }, //end of authorize function
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  adapter: nextAuthDbAdapter(),
  callbacks: {
    jwt: ({ token, user }) => {
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
    redirect: ({ url }) => {
      const queryData = nodeUrl.parse(url, true).query

      if (queryData.from) {
        return queryData.from
      }

      return url
    },
  },
  secret: process.env.AUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    encryption: true,
  },
})
