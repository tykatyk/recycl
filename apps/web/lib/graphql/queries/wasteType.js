import gql from 'graphql-tag'

export const GET_WASTE_TYPES = gql`
  query GetWasteTypes {
    getWasteTypes {
      _id
      name
    }
  }
`
