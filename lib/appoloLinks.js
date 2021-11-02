import { ApolloLink, HttpLink } from '@apollo/client'

export const httpLink = new HttpLink({ uri: 'http://localhost:3000/api/g' })

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
