import { ApolloServer, gql } from 'apollo-server-micro'
import { makeExecutableSchema } from 'graphql'
import dbConnect from '../../lib/db/connection'
import schema from '../../lib/graphql/schema'
import resolvers from '../../lib/graphql/resolvers'

// const apolloServer = new ApolloServer({ typeDefs, resolvers })
// const startServer = apolloServer.start()
async function handler(req, res) {
  console.log('path is ')
  console.log(process.env.GRAPHQL_URL)
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
  const apolloServer = new ApolloServer({ typeDefs: schema, resolvers })
  const startServer = apolloServer.start()

  await startServer
  await apolloServer.createHandler({
    path: '/api/g',
  })(req, res)
}
export default dbConnect(handler)
export const config = {
  api: {
    bodyParser: false,
  },
}
