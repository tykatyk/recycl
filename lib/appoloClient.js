import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import { httpLink, clearTypeNameLink } from './appoloLinks'

const additiveLink = from([clearTypeNameLink, httpLink])

export default new ApolloClient({
  link: additiveLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
})
