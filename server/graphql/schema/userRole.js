import { gql } from 'apollo-server-micro'

export default gql`
  type Mutation {
    createRole(roleName: String): String
  }
  type Query {
    getRoleId(roleName: String): String
  }
`
