import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation CreateUser($user: UserInput) {
    createUser(user: $user) {
      _id
    }
  }
`
