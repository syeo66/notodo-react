import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { createHttpLink } from 'apollo-link-http'

import { AUTH_TOKEN, GRAPHQL_API } from './constants'

const httpLink = createHttpLink({ uri: GRAPHQL_API })

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(AUTH_TOKEN)
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'network-only',
    },
    watchQuery: {
      errorPolicy: 'ignore',
      fetchPolicy: 'cache-and-network',
    },
  },
  link: authLink.concat(httpLink),
})
