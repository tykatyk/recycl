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
  query GetRemovalApplications($queryParams: QueryParams) {
    getRemovalApplications(queryParams: $queryParams) {
      _id
      wasteLocation {
        description
      }
      wasteType {
        name
      }
      quantity
    }
  }
`
export const GET_REMOVAL_APPLICATIONS_FOR_MAP = gql`
  query GetRemovalApplicationsForMap(
    $visibleRect: [[[Float!]]]
    $wasteTypes: String!
  ) {
    getRemovalApplicationsForMap(
      visibleRect: $visibleRect
      wasteTypes: $wasteTypes
    ) {
      _id
      wasteTypeId
      totalWeight
      totalProposals
      wasteLocation
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
