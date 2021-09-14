import { ApolloServer, gql } from 'apollo-server-micro'
import dbConnect from '../../src/dbConnect'
import dbQueries from '../../src/dbQueries'
import typeDefs from '../../src/graphQlTypes'

const resolvers = {
  Query: {
    hello(parent, args, context) {
      return 'Word'
    },
    getRemovalApplications(parent, args, context) {
      return new dbQueries('RemovalApplication').getAll()
    },
    getWasteTypes(parent, args, context) {
      return new dbQueries('WasteType').getAll()
    },
  },
  Mutation: {
    createRemovalApplication(parent, args, context) {
      return dbQueries.create(args.application)
    },
  },
}

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
