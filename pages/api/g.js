import { ApolloServer, gql } from 'apollo-server-micro'
import dataService from '../../src/dataService'

const typeDefs = gql`
  type Query {
    getRemovalApplication($id: Int): RemovalApplication!
  }
  type RemovalApplication {
    _id: String
    wasteLocation: Location
    wasteType: Number
    quantity: Number
    passDocumet: Boolean
    description: String
    notificationCities: [Location]
    notificationCitiesCheckbox: Boolean
    notificationRadius: String
    notificationRadiusCheckbox: Boolean
  }
  type Location {
    description: String
    place_id: String
  }
  type Mutation {
    updateRemovalApplication($id:Int) : RemovalApplication
    createRemovalApplication(RemovalApplication) : RemovalApplication
    deleteRemovalApplication($id: Int) : RemovalApplication
}
`

const resolvers = {
  Query: {
    removalApplication(parent, args, context) {
      return dataService.find(args.id)
    },
  },
  Mutation: {
    createRemovalApplication(parent, args, context) {
      return dataService.create(args.data)
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
    path: '/api/g',
  })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}
