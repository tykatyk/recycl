import { gql } from 'apollo-server-micro'

export default gql`
  type Query {
    hello: String
    getRemovalApplication(id: String!): RemovalApplicationOutput
    getRemovalApplications: [RemovalApplicationOutput]
    getWasteTypes: [WasteTypeOutput]
  }

  type LocationOutput {
    description: String
    place_id: String
  }

  type RemovalApplicationOutput {
    _id: String
    wasteLocation: LocationOutput
    wasteType: String
    quantity: Int
    comment: String
    passDocumet: Boolean
    notificationCitiesCheckbox: Boolean
    notificationCities: [LocationOutput]
    notificationRadius: String
    notificationRadiusCheckbox: Boolean
  }

  type WasteTypeOutput {
    _id: String
    name: String
  }

  input Location {
    description: String
    place_id: String
  }

  input RemovalApplication {
    wasteLocation: Location
    wasteType: String
    quantity: Int
    comment: String
    passDocumet: Boolean
    notificationCitiesCheckbox: Boolean
    notificationCities: [Location]
    notificationRadius: String
    notificationRadiusCheckbox: Boolean
  }
  type Mutation {
    createRemovalApplication(
      application: RemovalApplication
    ): RemovalApplicationOutput
  }
`
