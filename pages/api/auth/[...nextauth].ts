import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { initializeApollo } from '../../../lib/apolloClient/apolloClient'
import { html, text } from '../../../lib/helpers/emailHelpers'
import { compare } from 'bcrypt'
import {
  GET_USER_BY_EMAIL,
  DELETE_NOT_CONFIRMED_USER,
} from '../../../lib/graphql/queries/user'
import { loginSchema } from '../../../lib/validation/index'
// import nextAuthDbAdapter from '../../../lib/helpers/nextAuthDbAdapter'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '../../../lib/helpers/nextAuthClientPromise'
import { URL } from 'url'
import { createTransport } from 'nodemailer'

const apolloClient = initializeApollo()

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      GOOGLE_ID: string
      GOOGLE_SECRET: string
    }
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      server: 'smtp-pulse.com',
      /*server: {
        host: 'smtp-pulse.com',
        port: 2525,
        auth: {
          user: 'tykatyk@gmail.com',
          pass: 'MXo8Ca4AQo',
        },
      },*/
      from: 'notify@yoused.com.ua',
      sendVerificationRequest: async (params) => {
        const { identifier, url, provider } = params
        const { host } = new URL(url)
        // NOTE: You are not required to use `nodemailer`, use whatever you want.
        const transport = createTransport({
          host: provider.server,
          port: 2525,

          auth: {
            user: 'tykatyk@gmail.com',
            pass: 'MXo8Ca4AQo',
          },
          logger: true,
          transactionLog: true, // include SMTP traffic in the logs
          allowInternalNetworkInterfaces: false,
        })
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host }),
        })
        const failed = result.rejected.concat(result.pending).filter(Boolean)
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`)
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

        const { email, password } = credentials

        //check correctness of data needed to login a user
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
        const { _id, emailConfirmed, confirmEmailExpires } = user

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
      if (token) {
        session.id = token.id
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      let myUrl: URL
      if (url.startsWith('/')) {
        myUrl = new URL(`${baseUrl}${url}`)
      } else {
        myUrl = new URL(url)
      }

      const from = myUrl.searchParams.get('from')

      if (from) {
        return from
      }

      return url
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
