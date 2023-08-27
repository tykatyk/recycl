import gql from 'graphql-tag'
import { STRUCTURED_FORMATTING_FRAGMENT } from './structuredFormatting'

export const REMOVAL_APPLICATION_OUTPUT_FRAGMENT = gql`
  ${STRUCTURED_FORMATTING_FRAGMENT}
  fragment RemovalApplicationOutputFragment on RemovalApplicationOutput {
    _id
    wasteLocation {
      description
      place_id
      ...StructuredFormattingFragment
    }
    wasteType {
      _id
      name
    }
    contactPhone
    quantity
    user {
      _id
      name
      phone
    }
    comment
    passDocumet
    notificationCitiesCheckbox
    notificationCities {
      description
      place_id
      ...StructuredFormattingFragment
    }
    notificationRadius
    notificationRadiusCheckbox
    expires
  }
`
