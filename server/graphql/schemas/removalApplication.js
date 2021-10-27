import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
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

  type LocationOutput {
    description: String
    place_id: String
    structured_formatting: StructuredFormattingOutput
  }

  type StructuredFormattingOutput {
    main_text: String
    main_text_matched_substrings: [FormattingObjectOutput]
    secondary_text: String
  }

  type FormattingObjectOutput {
    length: Int
    offset: Int
  }

  type DeleteManyOutput {
    n: Int
    ok: Int
    deletedCount: Int
  }

  input FormattingObject {
    length: Int
    offset: Int
  }

  input StructuredFormatting {
    main_text: String
    main_text_matched_substrings: [FormattingObject]
    secondary_text: String
  }

  input Location {
    description: String
    place_id: String
    structured_formatting: StructuredFormatting
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
