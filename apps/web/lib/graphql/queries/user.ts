import gql from 'graphql-tag'
import { STRUCTURED_FORMATTING_FRAGMENT } from './fragments/structuredFormatting'

export const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    createUser(user: $user) {
      _id
      name
      confirmEmailToken
    }
  }
`
export const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser {
      _id
    }
  }
`
export const DELETE_NOT_CONFIRMED_USER = gql`
  mutation DeleteNotConfirmedUser($id: String!) {
    deleteNotConfirmedUser(id: $id) {
      _id
    }
  }
`
export const GET_USER_BY_EMAIL = gql`
  query GetUser($email: String!) {
    getUserByEmail(email: $email) {
      _id
      email
      name
      password
      image
      emailConfirmed
      confirmEmailExpires
    }
  }
`
export const GET_USER_BY_TOKEN = gql`
  query GetUserByToken($token: String!) {
    getByToken(token: $token) {
      _id
      email
    }
  }
`
export const GET_USER_CONTACTS = gql`
  query GetUserContacts($id: String!) {
    getUserContacts(id: $id) {
      name
      location {
        description
        place_id
      }
    }
  }
`
export const UPDATE_USER_CONTACTS = gql`
  ${STRUCTURED_FORMATTING_FRAGMENT}
  mutation UpdateUserContacts($contacts: ContactsInput!) {
    updateUserContacts(contacts: $contacts) {
      name
      location {
        description
        place_id
        ...StructuredFormattingFragment
      }
    }
  }
`
