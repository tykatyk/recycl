import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type Query {
    getWasteTypes: [WasteTypeOutput]
  }

  type WasteTypeOutput {
    _id: String
    name: String
  }
`
