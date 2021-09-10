import { ApolloServer, gql } from 'apollo-server-micro'
import mongodbQueries from '../../src/dbQueries'

const typeDefs = gql`
  type Query {
    hello: String
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
    passDocumet: Boolean
    description: String
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
    passDocumet: Boolean
    description: String
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
  },
  Mutation: {
    createRemovalApp(parent, args, context) {
      return mongodbQueries.create(args.application)
    },
  },
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })

const startServer = apolloServer.start()

export default async function handler(req, res) {
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

export const config = {
  api: {
    bodyParser: false,
  },
}
