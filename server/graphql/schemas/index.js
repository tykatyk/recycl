import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  scalar Date

  type DeleteManyOutput {
    n: Int
    ok: Int
    deletedCount: Int
  }
`
