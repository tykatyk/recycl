import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { initializeApollo } from '../../../lib/apolloClient/apolloClient'
import { html, text } from '../../../lib/helpers/email/loginEmail'
import {
  dbConnect,
  UserModel as userModel,
} from '@recycl/shared/dist/server/db'
import { GET_USER_BY_EMAIL } from '../../../lib/graphql/queries/user'
import { loginSchema } from '../../../lib/validation/index'
// import nextAuthDbAdapter from '../../../lib/helpers/nextAuthDbAdapter'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '../../../lib/helpers/nextAuthClientPromise'
import { URL } from 'url'
import { colors as theme } from '../../../lib/helpers/themeStub'
import { sendEmail } from '../../../lib/helpers/email/mailer'

const apolloClient = initializeApollo()

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      GOOGLE_ID: string
      GOOGLE_SECRET: string
    }
  }
}

const subjectText = 'Вход в учётную запись'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      sendVerificationRequest: async (params) => {
        const { identifier, url } = params
        const { host } = new URL(url)

        const partialEmailParams = {
          to: identifier,
          subject: `${subjectText} ${process.env.BRAND}`,
          text: text({ url, host }),
        }
        const emailParams = {
          ...partialEmailParams,
          html: html({ url, host, theme }),
        }

        try {
          await sendEmail(emailParams)
        } catch (err) {
          console.log(err)
          throw new Error(`An email to ${identifier} could not be sent`)
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      credentials: {},
      async authorize(credentials: { email: string; password: string }) {
        // Any object returned will be saved in `user` property of the JWT
        // If you return null or false then the credentials will be rejected
        // You can also Reject this callback with an Error or with a URL:
        // throw new Error('error message') // Redirect to error page
        // throw '/path/to/redirect'        // Redirect to a URL

        const { email } = credentials

        //check correctness of the data needed to login a user
        try {
          await loginSchema.validate(
            {
              email,
            },
            { abortEarly: false },
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
              }),
            )
          } else {
            throw new Error(
              JSON.stringify({
                type: 'perForm',
                message: 'Возникла ошибка при проверке данных формы',
              }),
            )
          }
        }

        //check if user exists
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
            }),
          )
        }

        if (result.data && !result.data.getUserByEmail) {
          throw new Error(
            JSON.stringify({
              type: 'perForm',
              message: 'Пользователь с такими учетными данными не найден',
            }),
          )
        }

        const user = result.data.getUserByEmail

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
    error: '/auth/error',
  },
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async jwt({ token, user }) {
      // first time jwt callback is run, user object is available
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token.id) {
        session.id = token.id
      }
      return session
    },
    async signIn({ user, account, profile, email, credentials }) {
      return await dbConnect()
        .then(() => {
          return userModel
            .findOne({
              email: user.email,
            })
            .exec()
        })
        .then((userFromDb) => {
          if (userFromDb) return true
          return false
        })
        .catch((err) => {
          console.log(err)
          return false
        })
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
