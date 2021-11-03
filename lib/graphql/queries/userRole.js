import { gql } from '@apollo/client'

export const CREATE_ROLE = gql`
  mutation CreateRole($roleName: String) {
    createRole(roleName: $roleName)
  }
`

export const GET_ROLE_ID = gql`
  query GetRoleId($roleName: String) {
    getRoleId(roleName: $roleName)
  }
`
