import { gql } from 'apollo-server-micro'

export default gql`
  type Query {
    getRemovalApplication(id: String!): RemovalApplicationOutput
    getRemovalApplications(queryParams: QueryParams): [RemovalApplicationOutput]
    getRemovalApplicationsForMap(
      visibleRect: [[[Float]]]
      wasteTypes: String!
    ): [RemovalApplicationForMapOutput]
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
    contactPhone: String!
    quantity: Int!
    user: UserOutput
    comment: String
    passDocumet: Boolean
    notificationCitiesCheckbox: Boolean
    notificationCities: [LocationOutput!]
    notificationRadius: String
    notificationRadiusCheckbox: Boolean
    expires: Date!
  }

  type RemovalApplicationForMapOutput {
    _id: String
    wasteTypeId: String
    totalWeight: Int!
    totalProposals: Int!
    wasteLocation: [Float!]!
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
