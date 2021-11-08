import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    CredentialsProvider({
      async authorize(credentials, req) {
        // Any object returned will be saved in `user` property of the JWT
        // If you return null or false then the credentials will be rejected
        // console.log(JSON.stringify(error, null, 2))
        // You can also Reject this callback with an Error or with a URL:
        // throw new Error('error message') // Redirect to error page
        // throw '/path/to/redirect'        // Redirect to a URL
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  // session: {
  //   jwt: true,
  // },
  callbacks: {
    jwt: ({ token, user }) => {
      console.log('user is')
      console.log(user)
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
