import { ApolloLink } from "apollo-link";
import CTFNote from "src/boot/CTFNote/index.js";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { onError } from "apollo-link-error";
import { Notify } from "quasar";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      Notify.create({ message, type: "negative" });
    });
  }
  if (networkError) {
    Notify.create({ message: `[Network error]: ${networkError}`, type: "negative" });
  }
});

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

const httpLink = new HttpLink(httpLinkConfig);
const wsLink = new WebSocketLink(wsLinkConfig);

const terminatingLink = split(
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

export async function apolloClientBeforeCreate({ apolloClientConfigObj }) {
  apolloClientConfigObj.link = ApolloLink.from([errorLink, authLink, terminatingLink]);
}

let apollo = {};
export async function apolloClientAfterCreate({ apolloClient }) {
  CTFNote.init(apolloClient);
  apollo = apolloClient;
}

export { apollo };
