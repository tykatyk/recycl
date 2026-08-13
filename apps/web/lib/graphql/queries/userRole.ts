import gql from 'graphql-tag'

export const CREATE_ROLE = gql`
  mutation CreateRole($roleName: String) {
    createRole(roleName: $roleName)
  }
`
