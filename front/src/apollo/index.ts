import type { ApolloClientOptions } from '@apollo/client/core';
import { InMemoryCache, split } from '@apollo/client/core';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { getMainDefinition } from '@apollo/client/utilities';

import { WebSocketLink } from '@apollo/client/link/ws';
import { from, ApolloLink } from '@apollo/client/core';
import { TypePolicy } from '@apollo/client/core';

const protocol = document.location.protocol == 'https:' ? 'wss:' : 'ws:';

const wsLink = new WebSocketLink({
  uri: `${protocol}//${document.location.host}/graphql`,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => {
      const token = localStorage.getItem('JWT');
      return {
        Authorization: token ? `Bearer ${token}` : '',
      };
    },
  },
});

const httpLink = new BatchHttpLink({
  uri: '/graphql',
  batchMax: 20,
  batchInterval: 20,
});

const splitLink = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const link = from([
  new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('JWT');
    if (token) {
      operation.setContext(
        ({ headers }: { headers: { [key: string]: string } }) => ({
          headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
          },
        })
      );
    }
    return forward(operation);
  }),
  splitLink,
]);

export /* async */ function getClientOptions() {
  /* {app, router, ...} options?: Partial<BootFileParams<any>> */

  const types = [
    'Profile',
    'Ctf',
    'CtfSecret',
    'Task',
    'Invitation',
    'WorkOnTask',
    'Setting',
  ] as const;
  const typePolicies: { [name: string]: TypePolicy } = {};
  for (const type of types) {
    typePolicies[type] = { keyFields: ['nodeId'] };
  }
  return <ApolloClientOptions<unknown>>{
    link,
    cache: new InMemoryCache({
      typePolicies,
    }),
  };
}
