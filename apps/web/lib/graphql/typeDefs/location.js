import gql from 'graphql-tag'

export default gql`
  type StructuredFormattingOutput {
    main_text: String
    secondary_text: String
  }

  type LocationOutput {
    description: String
    place_id: String!
    structured_formatting: StructuredFormattingOutput
    position: PositionOutput
  }

  type PositionOutput {
    coordinates: [Float!]
  }

  input StructuredFormatting {
    main_text: String
    secondary_text: String
  }

  input Location {
    description: String!
    place_id: String!
    structured_formatting: StructuredFormatting
  }
`
