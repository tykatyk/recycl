import { gql } from '@apollo/client'

export const GET_WASTE_TYPES = gql`
  query GetWasteTypes {
    getWasteTypes {
      _id
      name
    }
  }
`
