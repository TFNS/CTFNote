export default async function(/* { app, router, store, ssrContext, urlPath, redirect } */) {
  return {
    default: {
      // 'apollo-link-http' config
      // https://www.apollographql.com/docs/link/links/http/#options
      httpLinkConfig: {
        // you can define the 'uri' here or using an env variable when
        // running quasar commands, for example:
        // `GRAPHQL_URI=https://prod.example.com/graphql quasar build`
        // `GRAPHQL_URI=https://dev.example.com/graphql quasar dev`
        uri: process.env.GRAPHQL_URI || "/graphql"
      },

      // 'apollo-cache-inmemory' config
      // https://www.apollographql.com/docs/react/caching/cache-configuration/#configuring-the-cache
      cacheConfig: {},

      // additional config for apollo client
      // https://github.com/apollographql/apollo-client/blob/version-2.6/docs/source/api/apollo-client.mdx#optional-fields
      additionalConfig: {
        defaultOptions: {
          watchQuery: {
            fetchPolicy: "cache-and-network",
            errorPolicy: "all"
          },
          query: {
            fetchPolicy: "network-only",
            errorPolicy: "all"
          },
          mutate: {
            errorPolicy: "all"
          }
        }
      }
    },

    // you can add more options or override the default config for a specific
    // quasar mode or for dev and prod modes. Examples:

    // ssr: {},

    // dev: {
    //   httpLinkConfig: {
    //     uri: process.env.GRAPHQL_URI || 'http://dev.example.com/graphql'
    //   }
    // },

    // prod: {
    //   httpLinkConfig: {
    //     uri: process.env.GRAPHQL_URI || 'http://prod.example.com/graphql'
    //   }
    // },

    // the following gets merged to the config only when using ssr and on server
    ssrOnServer: {
      additionalConfig: {
        // https://apollo.vuejs.org/guide/ssr.html#create-apollo-client
        ssrMode: true
      }
    },

    // the following gets merged to the config only when using ssr and on client
    ssrOnClient: {
      additionalConfig: {
        // https://apollo.vuejs.org/guide/ssr.html#create-apollo-client
        ssrForceFetchDelay: 100
      }
    }
  };
}
