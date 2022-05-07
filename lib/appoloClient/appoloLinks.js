import { ApolloLink, HttpLink, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/api/g',
  // credentials: 'same-origin',
  // headers: {
  //   cookie: req.header('Cookie'),
  // },
})

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: 'ws://localhost:4000/api/g',
          //ToDo: add authentication
        })
      )
    : null

export const splitLink =
  typeof window !== 'undefined'
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query)

          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          )
        },

        wsLink,
        httpLink
      )
    : httpLink

export const clearTypeNameLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key, value) =>
      key === '__typename' ? undefined : value
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      omitTypename
    )
  }
  return forward(operation).map((data) => {
    return data
  })
})
