import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import { httpLink, clearTypeNameLink } from './appoloLinks'

const additiveLink = from([clearTypeNameLink, httpLink])
const cacheOptions = {
  typePolicies: {
    Query: {
      fields: {
        getDialogs: {
          keyFields: false,
          keyAgrs: false,
          merge(existing = {}, incoming) {
            let merged = {}
            if (existing.dialogs) {
              merged.dialogs = [...existing.dialogs, ...incoming.dialogs]
              merged.totalCount = incoming.totalCount
            } else {
              merged = incoming
            }

            return merged
          },
          read(existing) {
            return existing
          },
        },
      },
    },
  },
}

export default new ApolloClient({
  link: additiveLink,
  cache: new InMemoryCache(cacheOptions),
  connectToDevTools: true,
})
