import { ApolloServer, gql } from 'apollo-server-micro'
import dbConnect from '../../src/dbConnect'
import dbQueries from '../../src/dbQueries'

const typeDefs = gql`
  type Query {
    hello: String
    getRemovalApplication(id: String!): RemovalApplicationOutput
    getAllRemovalApplications: [RemovalApplicationOutput]
  }

  type LocationOutput {
    description: String
    place_id: String
  }

  type RemovalApplicationOutput {
    _id: String
    wasteLocation: LocationOutput
    wasteType: Int
    quantity: Int
    comment: String
    passDocumet: Boolean
    notificationCitiesCheckbox: Boolean
    notificationCities: [LocationOutput]
    notificationRadius: String
    notificationRadiusCheckbox: Boolean
  }
  input Location {
    description: String
    place_id: String
  }

  input RemovalApplication {
    wasteLocation: Location
    wasteType: Int
    quantity: Int
    comment: String
    passDocumet: Boolean
    notificationCitiesCheckbox: Boolean
    notificationCities: [Location]
    notificationRadius: String
    notificationRadiusCheckbox: Boolean
  }
  type Mutation {
    createRemovalApp(application: RemovalApplication): RemovalApplicationOutput
  }
`

const resolvers = {
  Query: {
    hello(parent, args, context) {
      return 'Word'
    },
    getAllRemovalApplications(parent, args, context) {
      return dbQueries.getAll()
    },
  },
  Mutation: {
    createRemovalApp(parent, args, context) {
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
