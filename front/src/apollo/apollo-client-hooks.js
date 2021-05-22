import { ApolloLink } from "apollo-link";
import { ctfNote } from "src/boot/CTFNote";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { onError } from "apollo-link-error";
import { Notify } from "quasar";

function createErrorLink() {
  return onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message }) => {
        Notify.create({ message, type: "negative" });
      });
    }
    if (networkError) {
      Notify.create({ message: `[Network error]: ${networkError.message}`, type: "negative" });
    }
  });
}

function createWSLink() {
  const connectionParams = {};
  const jwt = localStorage.getItem("JWT");
  if (jwt) {
    connectionParams.authorization = `Bearer ${jwt}`;
  }
  const wsLinkConfig = {
    uri: `${location.protocol == "https:" ? "wss" : "ws"}://${location.host}/graphql`,
    options: {
      reconnect: true,
      connectionParams
    }
  };

  return new WebSocketLink(wsLinkConfig);
}

function createHTTPLink() {
  return new HttpLink({
    uri: "/graphql"
  });
}

function createTerminatingLink() {
  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    createWSLink(),
    createHTTPLink()
  );
}

function createAuthLink() {
  return new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => {
      const token = localStorage.getItem("JWT");

      if (token) {
        headers = { ...headers, authorization: `Bearer ${token}` };
      }

      return { headers };
    });

    return forward(operation);
  });
}

export async function apolloClientBeforeCreate({ apolloClientConfigObj }) {
  apolloClientConfigObj.link = ApolloLink.from([createErrorLink(), createAuthLink(), createTerminatingLink()]);
}

let apollo = {};
export async function apolloClientAfterCreate({ apolloClient }) {
  ctfNote.init(apolloClient);
  apollo = apolloClient;
}

export { apollo };
