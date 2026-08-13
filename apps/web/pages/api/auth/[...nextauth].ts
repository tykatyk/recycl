import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import {
  getLoginEmailContent,
  text,
} from '../../../lib/helpers/email/loginEmail'
import { dbConnect, UserModel } from '@recycl/shared/dist/server/db'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '../../../lib/helpers/nextAuthClientPromise'
import { URL } from 'url'
import { sendEmail } from '../../../lib/helpers/email/mailer'
import { getFullHtml } from '@recycl/shared/dist/email'

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      GOOGLE_ID: string
      GOOGLE_SECRET: string
    }
  }
}

const subject = `Вход в учётную запись ${process.env.BRAND}`

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
          subject,
          text: text({ url, host }),
        }

        const loginEmailContent = getLoginEmailContent(url)
        const header = 'Для входа в учетную запись перейдите по ссылке'

        const emailParams = {
          ...partialEmailParams,
          html: getFullHtml({
            content: loginEmailContent,
            title: subject,
            header,
          }),
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
      try {
        await dbConnect()
        const existing = await UserModel.findOne({
          email: user.email,
        })
        if (!existing) return false
        if (
          !existing.emailConfirmed &&
          account &&
          account.provider === 'email'
        ) {
          existing.emailConfirmed = true
          await existing.save()
        }
        return true
      } catch (error) {
        return false
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
