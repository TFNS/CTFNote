
import { ApolloLink} from "apollo-link";
import CTFNote from "src/boot/CTFNote/index.js"


const contextLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("JWT") || null;
  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`
      }
    });
  }
  return forward(operation)
});


export async function apolloClientBeforeCreate({ apolloClientConfigObj }/* { apolloClientConfigObj, app, router, store, ssrContext, urlPath, redirect } */) {
  // if needed you can modify here the config object used for apollo client
  // instantiation
  apolloClientConfigObj.link = contextLink.concat(apolloClientConfigObj.link)
}

let apollo = {}
export async function apolloClientAfterCreate({apolloClient}/* { apolloClient, app, router, store, ssrContext, urlPath, redirect } */) {
  // if needed you can modify here the created apollo client
  CTFNote.init(apolloClient)
  apollo = apolloClient

}

export {apollo}