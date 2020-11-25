function deleteAllCookies() {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=${new Date().toUTCString()}`;
  }
}

function routes(store) {
  const routes = [
    {
      path: "/",
      name: "index",
      redirect: { name: "ctfs" },
      component: () => import("layouts/MainLayout.vue"),
      children: [
        {
          path: "auth",
          name: "auth",
          component: () => import("pages/auth.vue")
        },
        {
          path: "logout",
          name: "logout",
          beforeEnter: (to, from, next) => {
            deleteAllCookies();
            store.dispatch("logout");
            next({ name: "auth" });
          }
        },
        {
          path: "settings",
          name: "settings"
        },
        {
          path: "me",
          name: "me"
        },
        {
          path: "ctf",
          name: "ctfs",
          component: () => import("pages/CTF/List.vue")
        },
        {
          path: "ctf/past",
          name: "past",
          component: () => import("pages/CTF/List.vue")
        },
        {
          path: "ctf/calendar",
          name: "calendar",
          component: () => import("pages/CTF/List.vue")
        },
        {
          path: "ctf/:ctfSlug",
          name: "ctfInfo",
          props: true,
          component: () => import("pages/CTF/Container.vue"),
          children: [
            { path: "", name: "ctf", props: true, component: () => import("pages/CTF/CTF.vue") },
            { path: "tasks/:taskSlug", name: "task", props: true, component: () => import("pages/CTF/Task.vue") }
          ]
        },
        {
          path: "admin/users",
          name: "adminUsers",
          component: () => import("pages/Admin/Users.vue")
        },
        {
          path: "admin/config",
          name: "adminConfig",
          component: () => import("pages/Admin/Settings.vue")
        }
      ]
    },
    {
      path: "/*",
      component: () => import("pages/Error404.vue")
    }
  ];
  return routes;
}

export default routes;
