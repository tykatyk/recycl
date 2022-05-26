import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import { splitLink, clearTypeNameLink } from './apolloLinks'

let apolloClient
const additiveLink = from([clearTypeNameLink, splitLink])
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

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: additiveLink,
    cache: new InMemoryCache(cacheOptions),
    connectToDevTools: true, //ToDo: should be disabled in production
  })
}

export function initializeApollo() {
  const _apolloClient = apolloClient ?? createApolloClient()
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient
  return apolloClient
}

//custom hook for React
export function useAppolo() {
  return useMemo(() => initializeApollo(initialState), [])
}
