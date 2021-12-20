import { gql } from '@apollo/client'
import { STRUCTURED_FORMATTING_FRAGMENT } from './fragments/structuredFormatting'

export const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    createUser(user: $user) {
      _id
      confirmEmailToken
    }
  }
`
    }
  }
`
export const GET_USER_BY_EMAIL = gql`
  query GetUser($email: String!) {
    getUserByEmail(email: $email) {
      _id
      email
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

export const GET_PHONE = gql`
  query GetPhone($id: String!) {
    getPhone(id: $id) {
      phone
    }
  }
`

export const UPDATE_PHONE = gql`
  mutation UpdatePhone($phone: String!) {
    updatePhone(phone: $phone)
  }
`
export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
    updatePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`
