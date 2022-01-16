import { gql } from '@apollo/client'
import { REMOVAL_APPLICATION_OUTPUT_FRAGMENT } from './fragments/removalApplicationOutput'

export const CREATE_REMOVAL_APPLICATION = gql`
  ${REMOVAL_APPLICATION_OUTPUT_FRAGMENT}
  mutation CreateRemovalApplication($application: RemovalApplication!) {
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
export const GET_REMOVAL_APPLICATIONS_FOR_MAP = gql`
  query GetRemovalApplicationsForMap($visibleRect: [[[Float!]]]) {
    getRemovalApplicationsForMap(visibleRect: $visibleRect) {
      wasteLocation {
        position {
          coordinates
        }
      }
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
  mutation DeleteRemovalApplications($ids: [String!]!) {
    deleteRemovalApplications(ids: $ids) {
      n
      ok
      deletedCount
    }
  }
`
