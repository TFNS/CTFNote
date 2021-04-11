import Axios from "axios"
import { makeExtendSchemaPlugin, gql } from "graphile-utils";


const PAD_URL = "http://127.0.0.1/pad"

const REGISTER_OK = 'successfully registered, please signin.'
const REGISTER_DUP = 'This email has been used, please try another one.'
const LOGIN_ERROR = 'Invalid email or password.'

async function postWithRedirect(path: string, form: URLSearchParams) {
  const axios = Axios.create({
    baseURL: PAD_URL,
    withCredentials: true
  })

  Axios.defaults.withCredentials = true
  const redirect_response = await axios.post(path, form, { maxRedirects: 0, validateStatus: status => status === 302 })
  axios.defaults.headers.Cookie = redirect_response.headers["set-cookie"][0]
  return await axios.get(`/`)
}

async function registerToHedgedoc(email: string, password: string) {


  const params = new URLSearchParams()
  params.append("email", email)
  params.append("password", password)

  const resp = await postWithRedirect("/register", params)

  if (resp.data.includes(REGISTER_OK)) {
    return true
  }
  if (resp.data.includes(REGISTER_DUP)) {
    throw new Error(REGISTER_DUP)
  }
  throw new Error("Error while registering to Hedgedoc")
}

async function loginToHedgedoc(email: string, password: string) {


  const params = new URLSearchParams()
  params.append("email", email)
  params.append("password", password)

  const resp = await postWithRedirect("/login", params)
  if (resp.data.includes(LOGIN_ERROR)){
    throw new Error(LOGIN_ERROR)
  }
}

loginToHedgedoc("test2222@test.com", "pouet")

export default makeExtendSchemaPlugin(build => {
  return {
    typeDefs: gql`
      input RegisterInput {
        email: String!
        password: String!
      }

      type RegisterPayload {
        user: User @pgField
        query: Query
      }
      extend type Mutation {
        register(input: RegsiterInput!): RegisterPayload
      }
    `,
    resolvers: {
      Mutation: {
      }
    }
  }
})