import { gql } from 'apollo-server-micro'

export default gql`
  type Query {
    getRemovalApplication(id: String!): RemovalApplicationOutput
    getRemovalApplications: [RemovalApplicationOutput]
    getRemovalApplicationsWithMessageCount: [RemovalApplicationsWithMessageCountOutput]
  }

  type Mutation {
    createRemovalApplication(
      application: RemovalApplication!
    ): RemovalApplicationOutput
    updateRemovalApplication(
      id: String!
      newValues: RemovalApplication!
    ): RemovalApplicationOutput
    deleteRemovalApplication(id: String!): RemovalApplicationOutput
    deleteRemovalApplications(ids: [String!]!): DeleteManyOutput
  }

  type RemovalApplicationOutput {
    _id: String!
    wasteLocation: LocationOutput!
    wasteType: WasteTypeOutput!
    quantity: Int!
    comment: String
    passDocumet: Boolean
    notificationCitiesCheckbox: Boolean
    notificationCities: [LocationOutput!]
    notificationRadius: String
    notificationRadiusCheckbox: Boolean
  }

  type RemovalApplicationsWithMessageCountOutput {
    document: RemovalApplicationOutput!
    messageCount: Int
  }

  type DeleteManyOutput {
    n: Int
    ok: Int
    deletedCount: Int
  }

  input RemovalApplication {
    wasteLocation: Location!
    wasteType: String!
    quantity: Int!
    comment: String
    passDocumet: Boolean
    notificationCitiesCheckbox: Boolean
    notificationCities: [Location!]
    notificationRadius: String
    notificationRadiusCheckbox: Boolean
  }
`
