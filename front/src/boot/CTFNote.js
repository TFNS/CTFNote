import ctfNote from "./CTFNote/index.js"

export default async ({ Vue }) => {
  Vue.prototype.$ctfnote = ctfNote
  Vue.ctfnote = ctfNote
}