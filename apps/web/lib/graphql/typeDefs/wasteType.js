import gql from 'graphql-tag'

export default gql`
  type Query {
    getWasteTypes: [WasteTypeOutput]
  }

  type WasteTypeOutput {
    _id: String!
    name: String
  }
`
