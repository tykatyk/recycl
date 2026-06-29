import gql from 'graphql-tag'

export default gql`
  type Query {
    getRemovalApplications(queryParams: QueryParams): [RemovalApplicationOutput]
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

  type UserOutputForRemovalApplication {
    _id: String!
    name: String!
  }

  type RemovalApplicationOutput {
    _id: String!
    title: String!
    wasteLocation: LocationOutput!
    wasteType: String!
    contactPhone: String
    quantity: Int!
    user: UserOutputForRemovalApplication!
    comment: String
    passDocumet: Boolean
    notificationCitiesCheckbox: Boolean
    notificationCities: [LocationOutput!]
    notificationRadius: String
    notificationRadiusCheckbox: Boolean
    expires: Date!
    createdAt: Date!
  }

  type RemovalApplicationsWithMessageCountOutput {
    document: RemovalApplicationOutput!
    messageCount: Int
  }

  input RemovalApplication {
    title: String!
    wasteLocation: Location!
    wasteType: String!
    quantity: Int!
    contactPhone: String!
    comment: String
    passDocumet: Boolean
    notificationCitiesCheckbox: Boolean
    notificationCities: [Location!]
    notificationRadius: String
    notificationRadiusCheckbox: Boolean
  }

  input QueryParams {
    city: String
    wasteType: String
  }
`
