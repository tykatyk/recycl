import gql from 'graphql-tag'

export default gql`
  type FormattingObjectOutput {
    length: Int
    offset: Int
  }

  type StructuredFormattingOutput {
    main_text: String
    main_text_matched_substrings: [FormattingObjectOutput]
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
    description: String!
    place_id: String!
    structured_formatting: StructuredFormatting
  }
`
