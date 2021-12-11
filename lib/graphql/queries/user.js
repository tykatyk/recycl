import { gql } from '@apollo/client'
import { STRUCTURED_FORMATTING_FRAGMENT } from './fragments/structuredFormatting'

export const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    createUser(user: $user) {
      _id
    }
  }
`
export const GET_USER_BY_EMAIL = gql`
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
