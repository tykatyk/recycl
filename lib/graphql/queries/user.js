import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    createUser(user: $user) {
      _id
    }
  }
`
export const USER_EXISTS = gql`
  query UserExists($email: String!) {
    userExists(email: $email)
  }
`
export const GET_USER = gql`
  query GetUser($email: String!) {
    getUser(email: $email) {
      _id
      email
      password
    }
  }
`
export const GET_USER_BY_TOKEN = gql`
  query GetUserByToken($token: String!) {
    getByToken(token: $token) {
      _id
    }
  }
`
