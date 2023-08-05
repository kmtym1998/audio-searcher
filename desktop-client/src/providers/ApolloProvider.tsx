'use client';

import {
  ApolloClient,
  ApolloProvider as ApolloClientProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import DebounceLink from 'apollo-link-debounce';
import React from 'react';

type Props = {
  children?: React.ReactNode;
};

const ApolloProvider: React.FC<Props> = ({ children }) => {
  const client = new ApolloClient({
    uri: 'http://localhost:8080/v1/graphql',
    headers: {},
    link: ApolloLink.from([
      new DebounceLink(300),
      new HttpLink({ uri: 'http://localhost:8080/v1/graphql' }),
    ]),
    ssrMode: false,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloClientProvider client={client}>{children}</ApolloClientProvider>
  );
};

export default ApolloProvider;
