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
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '../../../lib/helpers/nextAuthClientPromise'
import { URL } from 'url'
import { colors as theme } from '../../../lib/helpers/themeStub'
import { sendEmail } from '../../../lib/helpers/email/mailer'

// const apolloClient = initializeApollo()

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
