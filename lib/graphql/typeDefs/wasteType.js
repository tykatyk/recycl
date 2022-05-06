import { gql } from 'apollo-server-micro'

export default gql`
  type Query {
    getWasteTypes: [WasteTypeOutput]
  }

  type WasteTypeOutput {
    _id: String!
    name: String
  }
`
