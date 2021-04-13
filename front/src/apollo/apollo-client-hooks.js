import { ApolloLink } from "apollo-link";
import CTFNote from "src/boot/CTFNote/index.js";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import fetch from "node-fetch";
import { w3cwebsocket } from "websocket";

const onServer = process.env.SERVER;
const httpLinkConfig = {
  uri: "/graphql"
};

const wsLinkConfig = {
  uri: `${location.protocol == "https:" ? "wss" : "ws"}://${location.host}/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authorization: `Bearer ${localStorage.getItem("JWT")}`
    }
  }
};

if (onServer) {
  httpLinkConfig.fetch = fetch;
  wsLinkConfig.webSocketImpl = w3cwebsocket;
}
// Create the http link
const httpLink = new HttpLink(httpLinkConfig);

// Create the subscription websocket link
const wsLink = new WebSocketLink(wsLinkConfig);

const terminatingLink = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  httpLink
);

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    const token = localStorage.getItem("JWT");

    if (token) {
      headers = { ...headers, authorization: `Bearer ${token}` };
    }

    return { headers };
  });

  return forward(operation);
});

export async function apolloClientBeforeCreate(
  { apolloClientConfigObj } /* { apolloClientConfigObj, app, router, store, ssrContext, urlPath, redirect } */
) {
  // if needed you can modify here the config object used for apollo client
  // instantiation
  apolloClientConfigObj.link = ApolloLink.from([authLink, terminatingLink]);
}

let apollo = {};
export async function apolloClientAfterCreate(
  { apolloClient } /* { apolloClient, app, router, store, ssrContext, urlPath, redirect } */
) {
  // if needed you can modify here the created apollo client
  CTFNote.init(apolloClient);
  apollo = apolloClient;
}

export { apollo };
