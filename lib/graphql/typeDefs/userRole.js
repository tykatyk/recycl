import gql from 'graphql-tag'

export default gql`
  type Mutation {
    createRole(roleName: String): String
  }
  type Query {
    getRoleId(roleName: String): String
  }
`
