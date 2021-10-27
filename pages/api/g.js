import { ApolloServer, gql } from 'apollo-server-micro'
import { makeExecutableSchema } from 'graphql'
import dbConnect from '../../server/db/connection'
import { typeDefs } from '../../server/graphql/types'
import resolvers from '../../server/graphql/resolvers'

// const apolloServer = new ApolloServer({ typeDefs, resolvers })
// const startServer = apolloServer.start()
console.log(makeExecutableSchema)
async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Origin',
    `${process.env.NEXT_PUBLIC_PRODUCTION_URL}`
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }
  const apolloServer = new ApolloServer({ typeDefs, resolvers })
  const startServer = apolloServer.start()

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
