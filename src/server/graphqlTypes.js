import { gql } from 'apollo-server-micro'
import dbQueries from '../../src/server/dbQueries'

export const typeDefs = gql`
  type Query {
    getRemovalApplication(id: String!): RemovalApplicationOutput
    getRemovalApplications: [RemovalApplicationOutput]
    getWasteTypes: [WasteTypeOutput]
  }

  type Mutation {
    createRemovalApplication(
      application: RemovalApplication
    ): RemovalApplicationOutput
    updateRemovalApplication(
      id: String
      newValues: RemovalApplication
    ): RemovalApplicationOutput
    deleteRemovalApplication(id: String!): RemovalApplicationOutput
    deleteRemovalApplications(ids: [String]!): DeleteManyOutput
  }

  type RemovalApplicationOutput {
    _id: String
    wasteLocation: LocationOutput
    wasteType: WasteTypeOutput
    quantity: Int
    comment: String
    passDocumet: Boolean
    notificationCitiesCheckbox: Boolean
    notificationCities: [LocationOutput]
    notificationRadius: String
    notificationRadiusCheckbox: Boolean
  }

  type LocationOutput {
    description: String
    place_id: String
    structured_formatting: StructuredFormattingOutput
  }

  type WasteTypeOutput {
    _id: String
    name: String
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
`

export const resolvers = {
  Query: {
    getRemovalApplication(parent, args, context) {
      return new dbQueries('RemovalApplication').getOne(args.id)
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
      return new dbQueries('RemovalApplication').create(args.application)
    },
    updateRemovalApplication(parent, args, context) {
      return new dbQueries('RemovalApplication').update(args.id, args.newValues)
    },
    deleteRemovalApplication(parent, args, context) {
      return new dbQueries('RemovalApplication').deleteOne(args.id)
    },
    deleteRemovalApplications(parent, args, context) {
      return new dbQueries('RemovalApplication').deleteMany(args.ids)
    },
  },
}
