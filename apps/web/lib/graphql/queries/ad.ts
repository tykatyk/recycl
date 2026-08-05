import gql from 'graphql-tag'
import { ADS_OUTPUT_FRAGMENT } from './fragments/adsOutput'

export const GET_ADS = gql`
  query GetAds($queryParams: QueryParams) {
    getAds(queryParams: $queryParams) {
      _id
      wasteLocation {
        description
      }
      wasteType
      quantity
    }
  }
`
export const GET_ADS_WITH_MESSAGE_COUNT = gql`
  query GetAdsWithMessageCount {
    getAdsWithMessageCount {
      document {
        _id
        wasteType
        wasteLocation {
          description
        }
        quantity
        expires
      }
      messageCount
    }
  }
`
export const DELETE_Ad = gql`
  ${ADS_OUTPUT_FRAGMENT}
  mutation DeleteAd($id: String!) {
    deleteAd(id: $id) {
      ...AdOutputFragment
    }
  }
`
export const DELETE_ADS = gql`
  mutation DeleteAds($ids: [String!]!) {
    deleteAds(ids: $ids) {
      n
      ok
      deletedCount
    }
  }
`
