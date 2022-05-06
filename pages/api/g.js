import { ApolloServer } from 'apollo-server-micro'
import dbConnect from '../../lib/db/connection'
import typeDefs from '../../lib/graphql/typeDefs'
import resolvers from '../../lib/graphql/resolvers'
import { getSession } from 'next-auth/react'
import { User } from '../../lib/db/models'

const context = ({ req }) => {
  return (async () => {
    try {
      await dbConnect()
    } catch (error) {
      throw new Error("Can't connect to the database")
    }
    try {
      const session = await getSession({ req })
      const user = await User.findById(session.id, { password: 0 })

      return { user }
    } catch (error) {
      console.log(error)
      return { user: null }
    }
  })()
}

const apolloServer = new ApolloServer({
  csrfPrevention: true,
  context,
})
const startServer = apolloServer.start()

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', `${process.env.NEXT_PUBLIC_URL}`)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  await apolloServer.createHandler({
    path: '/api/g',
  })(req, res)
}

export default handler
export const config = {
  api: {
    bodyParser: false,
  },
}
