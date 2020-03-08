import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { createHttpLink } from 'apollo-link-http'
import { GraphQLError } from 'graphql'

import { AUTH_EXPIRY, AUTH_TOKEN, GRAPHQL_API, REFRESH_EXPIRY, REFRESH_TOKEN } from './constants'

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

interface CustomError extends GraphQLError {
  statusCode?: number
}

const errorLink = onError(({ response, graphQLErrors }) => {
  if (graphQLErrors) {
    if (graphQLErrors.find((e: CustomError) => e.statusCode && e.statusCode === 401)) {
      ;[AUTH_TOKEN, AUTH_EXPIRY, REFRESH_TOKEN, REFRESH_EXPIRY].forEach(key => {
        localStorage.removeItem(key)
      })
    }
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
  link: ApolloLink.from([authLink, errorLink, httpLink]),
})
