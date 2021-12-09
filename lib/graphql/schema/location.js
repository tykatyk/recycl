import { gql } from 'apollo-server-micro'

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
    place_id: String
    structured_formatting: StructuredFormattingOutput
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
