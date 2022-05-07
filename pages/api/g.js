import { ApolloServer } from 'apollo-server-micro'
import dbConnect from '../../lib/db/connection'
import typeDefs from '../../lib/graphql/typeDefs'
import resolvers from '../../lib/graphql/resolvers'
import { getSession } from 'next-auth/react'
import { User } from '../../lib/db/models'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'

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

const schema = makeExecutableSchema({ typeDefs, resolvers })

const wsServer = new WebSocketServer({
  port: 4000,
  path: '/api/g',
})
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer)
const apolloServer = new ApolloServer({
  schema,
  csrfPrevention: true,
  context,
  plugins: [
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        console.log('drain')
        return {
          async drainServer() {
            await serverCleanup.dispose()
          },
        }
      },
    },
  ],
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
