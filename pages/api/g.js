import { ApolloServer } from 'apollo-server-micro'
import dbConnect from '../../lib/db/connection'
import typeDefs from '../../lib/graphql/typeDefs'
import resolvers from '../../lib/graphql/resolvers'
import { getSession } from 'next-auth/react'
import { User } from '../../lib/db/models'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'

const context = ({ req }) => {
  return (async () => {
    try {
      await dbConnect()
    } catch (error) {
      throw new Error("Can't connect to the database")
    }
    try {
      const session = await getSession({ req })
      if (!session) return { user: null }
      const user = await User.findById(session.id, { password: 0 })

      return { user }
    } catch (error) {
      console.log(error)
      return { user: null }
    }
  })()
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

const initializeWebSocketServer = (req, res) => {
  if (!res.socket.server.wss) {
    console.log('Starting wss')
    const wss = new WebSocketServer({ noServer: true })
    res.socket.server.on('upgrade', function upgrade(request, socket, head) {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request)
      })
    })
    res.socket.server.wss = wss
  }
}

const apolloServer = new ApolloServer({
  schema,
  csrfPrevention: true,
  context,
})

const startServer = apolloServer.start()

export default async function handler(req, res) {
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

  initializeWebSocketServer(req, res)

  await startServer
  await apolloServer.createHandler({
    path: '/api/g',
  })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}
