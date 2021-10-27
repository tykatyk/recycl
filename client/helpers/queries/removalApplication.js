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
const REMOVAL_APPLICATION_OUTPUT_FRAGMENT = gql`
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
`
export const CREATE_REMOVAL_APPLICATION = gql`
  ${REMOVAL_APPLICATION_OUTPUT_FRAGMENT}
  mutation CreateRemovalApplication($application: RemovalApplication) {
    createRemovalApplication(application: $application) {
      ...RemovalApplicationOutputFragment
    }
  }
`

export const GET_REMOVAL_APPLICATION = gql`
  ${REMOVAL_APPLICATION_OUTPUT_FRAGMENT}
  query GetRemovalApplication($id: String!) {
    getRemovalApplication(id: $id) {
      ...RemovalApplicationOutputFragment
    }
  }
`

export const GET_REMOVAL_APPLICATIONS = gql`
  ${REMOVAL_APPLICATION_OUTPUT_FRAGMENT}
  query GetRemovalApplications {
    getRemovalApplications {
      ...RemovalApplicationOutputFragment
    }
  }
`
export const GET_REMOVAL_APPLICATIONS_WITH_MESSAGE_COUNT = gql`
  ${REMOVAL_APPLICATION_OUTPUT_FRAGMENT}
  query GetRemovalApplicationsWithMessageCount {
    getRemovalApplicationsWithMessageCount {
      document {
        ...RemovalApplicationOutputFragment
      }
      messageCount
    }
  }
`

export const UPDATE_REMOVAL_APPLICATION = gql`
  ${REMOVAL_APPLICATION_OUTPUT_FRAGMENT}
  mutation UpdateRemovalApplication(
    $id: String!
    $newValues: RemovalApplication!
  ) {
    updateRemovalApplication(id: $id, newValues: $newValues) {
      ...RemovalApplicationOutputFragment
    }
  }
`
export const DELETE_REMOVAL_APPLICATION = gql`
  ${REMOVAL_APPLICATION_OUTPUT_FRAGMENT}
  mutation DeleteRemovalApplication($id: String!) {
    deleteRemovalApplication(id: $id) {
      ...RemovalApplicationOutputFragment
    }
  }
`
export const DELETE_REMOVAL_APPLICATIONS = gql`
  mutation DeleteRemovalApplications($ids: [String]!) {
    deleteRemovalApplications(ids: $ids) {
      n
      ok
      deletedCount
    }
  }
`
