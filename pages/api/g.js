import { ApolloServer, gql } from 'apollo-server-micro'
import dbConnect from '../../src/server/dbConnect'
import { typeDefs, resolvers } from '../../src/server/graphQlTypes'

const apolloServer = new ApolloServer({ typeDefs, resolvers })

const startServer = apolloServer.start()

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
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
    path: process.env.GRAPHQL_URL,
  })(req, res)
}
export default dbConnect(handler)
export const config = {
  api: {
    bodyParser: false,
  },
}
