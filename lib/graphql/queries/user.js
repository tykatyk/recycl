import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation CreateUser($user: UserInput) {
    createUser(user: $user) {
      _id
    }
  }
`
export const USER_EXISTS = gql`
  query UserExists($email: String) {
    userExists(email: $email)
  }
`
