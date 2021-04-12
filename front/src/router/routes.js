



function routes() {

  const ctfsRoutes = [
    {
      path: "incoming",
      name: "incoming",
      component: () => import("components/CTF/Incoming.vue")
    },
    {
      path: "past",
      name: "past",
      component: () => import("components/CTF/Past.vue")
    },
    {
      path: "calendar",
      name: "calendar",
      component: () => import("components/CTF/Calendar.vue")
    },
  ]


  const ctfRoutes = [
    {
      path: "task/:taskId(\\d+)-:taskSlug",
      name: "task",
      props: route => ({ taskId: parseInt(route.params.taskId) }),
      component: () => import("pages/Task.vue")
    },
    {
      path: "",
      component: () => import("pages/CTF.vue"),
      children: [
        {
          path: "info",
          name: "ctfinfo",
          component: () => import("components/CTF/Info.vue")
        },
        {
          path: "tasks",
          props: route => ({ tasks: route.meta.tasks }),
          name: "ctftasks",
          component: () => import("components/CTF/TaskList.vue")
        },
        {
          path: "guests",
          name: "ctfinvitations",
          component: () => import("components/CTF/Guests.vue")
        }
      ]
    }
  ]


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
          component: () => import("pages/Auth.vue")
        },
        {
          path: "auth/resetPassword/:token",
          name: "resetPassword",
          props: route => ({ token: route.params.token }),
          component: () => import("pages/ResetPassword.vue")
        },
        {
          path: "logout",
          name: "logout",
          component: () => import("pages/Logout.vue")
        },
        {
          path: "ctfs",
          name: "ctfs",
          component: () => import("pages/Index.vue"),
          redirect: { name: "incoming" },
          children: ctfsRoutes
        },
        {
          path: "ctf/:ctfId(\\d+)-:ctfSlug",
          redirect: 'ctfinfo',
          props: route => ({ ctfId: parseInt(route.params.ctfId) }),
          component: () => import(`components/Loader/CTF.vue`),
          children: ctfRoutes
        },
        {
          path: "admin",
          name: "admin",
          component: () => import("pages/Admin.vue"),
          redirect: { name: "adminsettings" },
          children: [
            {
              path: "users",
              name: "adminusers",
              component: () => import("components/Admin/Users.vue")
            },
            {
              path: "settings",
              name: "adminsettings",
              component: () => import("components/Admin/Settings.vue")
            }
          ]
        }
      ]
    },
    {
      path: "/*",
      name: "404",
      component: () => import("pages/Error404.vue")
    }
  ];

  return routes;
}

export default routes;
