import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import appoloClient from '../../../lib/appoloClient/appoloClient'

import { CREATE_USER } from '../../../lib/graphql/queries/user'

console.log('...nextauth route entered')

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Логин / пароль',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {},
        password: {},
        email: {},
        roles: {},
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        console.log('credentials are ')
        console.log(credentials)
        appoloClient
          .mutate({
            mutation: CREATE_USER,
            variables: {
              user: {
                username: credentials.username,
                email: credentials.email,
                password: credentials.password,
                roles: [credentials.role],
                isActive: true,
              },
            },
          })
          .then((user) => {
            // Any object returned will be saved in `user` property of the JWT
            console.log('User is ')
            console.log(user)
            return user
          })
          .catch((error) => {
            // If you return null or false then the credentials will be rejected
            console.log('Error is ')
            console.log(JSON.stringify(error, null, 2))
            return null
          })
        // You can also Reject this callback with an Error or with a URL:
        // throw new Error('error message') // Redirect to error page
        // throw '/path/to/redirect'        // Redirect to a URL
      },
    }),
  ],
  pages: {
    signIn: '/register',
  },
  session: {
    jwt: true,
  },
  callbacks: {
    async signIn({ credentials }) {
      console.log('credentials are ')
      console.log(credentials)
    },
  },
})
