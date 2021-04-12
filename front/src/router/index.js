import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({ Vue }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes: routes(Vue),

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    // eslint-disable-next-line no-undef
    mode: process.env.VUE_ROUTER_MODE,
    // eslint-disable-next-line no-undef
    base: process.env.VUE_ROUTER_BASE
  })
  Router.beforeEach(async (to, from, next) => {
    await Vue.ctfnote.waitUntilReady()
    if (to.name == "auth" || to.name == "resetPassword") {
      if (Vue.ctfnote.isGuest) {
        return next({ name: "ctfs" })
      }
      return next()
    }


    if (!Vue.ctfnote.isGuest) {
      return next({ name: "auth" })
    }
    next()

  })
  return Router
}
