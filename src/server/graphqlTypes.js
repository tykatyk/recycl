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
    structured_formatting: StructuredFormattingOutput
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

  type FormattingObjectOutput {
    length: Int
    offset: Int
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

  type StructuredFormattingOutput {
    main_text: String
    main_text_matched_substrings: [FormattingObjectOutput]
    secondary_text: String
  }

  input Location {
    description: String
    place_id: String
    structured_formatting: StructuredFormatting
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
