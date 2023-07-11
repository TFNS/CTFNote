import type { ApolloClientOptions } from '@apollo/client/core';
import {
  ApolloLink,
  from,
  InMemoryCache,
  split,
  TypePolicy,
} from '@apollo/client/core';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import { extractFiles } from 'extract-files';
import { JWT_KEY } from 'src/ctfnote/auth';

const protocol = document.location.protocol == 'https:' ? 'wss:' : 'ws:';

const wsLink = new WebSocketLink({
  uri: `${protocol}//${document.location.host}/graphql`,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => {
      const token = localStorage.getItem(JWT_KEY);
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

const uploadLink = createUploadLink({
  uri: 'graphql',
});

const uploadAndBatchHTTPLink = split(
  (operation) => extractFiles(operation).files.size > 0,
  uploadLink as unknown as ApolloLink,
  httpLink
);

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
  uploadAndBatchHTTPLink
);

const link = from([
  new ApolloLink((operation, forward) => {
    const token = localStorage.getItem(JWT_KEY);
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
