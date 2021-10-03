import { gql } from '@apollo/client'

const STRUCTURED_FORMATTING_FRAGMENT = gql`
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

export const CREATE_REMOVAL_APPLICATION = gql`
  ${STRUCTURED_FORMATTING_FRAGMENT}
  mutation CreateRemovalApplication($application: RemovalApplication) {
    createRemovalApplication(application: $application) {
      _id
      wasteLocation {
        description
        place_id
        ...StructuredFormattingFragment
      }
      wasteType {
        _id
      }
      quantity
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
    }
  }
`

export const GET_REMOVAL_APPLICATION = gql`
  ${STRUCTURED_FORMATTING_FRAGMENT}
  query GetRemovalApplication($id: String!) {
    getRemovalApplication(id: $id) {
      wasteLocation {
        description
        place_id
        ...StructuredFormattingFragment
      }
      wasteType {
        _id
      }
      quantity
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
    }
  }
`
export const UPDATE_REMOVAL_APPLICATION = gql`
  ${STRUCTURED_FORMATTING_FRAGMENT}
  mutation UpdateRemovalApplication(
    $id: String!
    $newValues: RemovalApplication!
  ) {
    updateRemovalApplication(id: $id, newValues: $newValues) {
      _id
      wasteLocation {
        description
        place_id
        ...StructuredFormattingFragment
      }
      wasteType {
        _id
      }
      quantity
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
    }
  }
`
export const DELETE_REMOVAL_APPLICATION = gql`
  ${STRUCTURED_FORMATTING_FRAGMENT}
  mutation DeleteRemovalApplication($id: String!) {
    deleteRemovalApplication(id: $id) {
      _id
      wasteLocation {
        description
        place_id
        ...StructuredFormattingFragment
      }
      wasteType {
        _id
      }
      quantity
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
    }
  }
`

export const GET_REMOVAL_APPLICATIONS = gql`
  ${STRUCTURED_FORMATTING_FRAGMENT}
  query GetRemovalApplications {
    getRemovalApplications {
      _id
      wasteLocation {
        description
        place_id
        ...StructuredFormattingFragment
      }
      wasteType {
        name
      }
      quantity
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
    }
  }
`

export const GET_WASTE_TYPES = gql`
  query GetWasteTypes {
    getWasteTypes {
      _id
      name
    }
  }
`
