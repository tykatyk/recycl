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
const REMOVAL_APPLICATIONS_OUTPUT_FRAGMENT = gql`
  ${STRUCTURED_FORMATTING_FRAGMENT}
  fragment RemovalApplicationsOutputFragment on RemovalApplicationsOutput {
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
    messageCount
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

export const SEND_MESSAGE = gql`
  mutation SendMessage($message: String, $aplId: String) {
    sendMessage(message: $message, aplId: $aplId)
  }
`
//old
/*export const GET_REMOVAL_APPLICATION = gql`
  ${REMOVAL_APPLICATION_OUTPUT_FRAGMENT}
  query GetRemovalApplication($id: String!) {
    getRemovalApplication(id: $id) {
      ...RemovalApplicationOutputFragment
    }
  }
`*/

//new
export const GET_REMOVAL_APPLICATIONS = gql`
  ${REMOVAL_APPLICATIONS_OUTPUT_FRAGMENT}
  query GetRemovalApplications {
    getRemovalApplications {
      ...RemovalApplicationsOutputFragment
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

export const GET_WASTE_TYPES = gql`
  query GetWasteTypes {
    getWasteTypes {
      _id
      name
    }
  }
`
