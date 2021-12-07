import { gql } from '@apollo/client'

export const STRUCTURED_FORMATTING_FRAGMENT = gql`
  fragment StructuredFormattingFragment on LocationOutput {
    structured_formatting {
      main_text
      main_text_matched_substrings {
        length
        offset
      }
      secondary_text
    }
  }
`
