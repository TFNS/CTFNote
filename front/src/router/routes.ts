import { RouteRecordRaw } from 'vue-router';

const ctfsRoute: RouteRecordRaw = {
  path: 'ctfs',
  name: 'ctfs',
  component: () => import('pages/Index.vue'),
  redirect: { name: 'ctfs-incoming' },
  children: [
    {
      path: 'incoming',
      name: 'ctfs-incoming',
      meta: {
        title: 'Incoming CTFs',
      },
      component: () => import('components/CTF/Incoming.vue'),
    },
    {
      path: 'past',
      name: 'ctfs-past',
      meta: {
        title: 'Past CTFs',
      },
      component: () => import('components/CTF/Past.vue'),
    },
    {
      path: 'calendar',
      name: 'ctfs-calendar',
      meta: {
        title: 'Calendar',
      },
      component: () => import('components/CTF/Calendar.vue'),
    },
  ],
};

const ctfRoute: RouteRecordRaw = {
  path: 'ctf/:ctfId(\\d+)-:ctfSlug',
  name: 'ctf',
  redirect: { name: 'ctf-info' },
  props: {
    default: (route) => ({
      ctfId: parseInt(route.params.ctfId as string) || 0,
      taskId: parseInt(route.params.taskId as string) || 0,
    }),
    menu: (route) => ({
      ctfId: parseInt(route.params.ctfId as string) || 0,
      taskId: parseInt(route.params.taskId as string) || 0,
    }),
  },
  components: {
    default: () => import('components/Loader/CTF.vue'),
    menu: () => import('components/Menu/CtfMenu.vue'),
  },
  children: [
    {
      path: 'task/:taskId(\\d+)-:taskSlug',
      alias: ['task/:taskId(\\d+)'],
      name: 'task',
      props: (route) => ({ taskId: parseInt(route.params.taskId as string) }),
      component: () => import('pages/Task.vue'),
    },
    {
      path: '',
      redirect: { name: 'ctf-info' },
      component: () => import('pages/CTF.vue'),
      children: [
        {
          path: 'info',
          name: 'ctf-info',
          component: () => import('components/CTF/Info.vue'),
        },
        {
          path: 'tasks',
          props: (route) => ({ tasks: route.meta.tasks }),
          name: 'ctf-tasks',
          component: () => import('components/Task/TaskList.vue'),
        },
        {
          path: 'guests',
          name: 'ctf-guests',
          component: () => import('components/CTF/Guests.vue'),
        },
      ],
    },
  ],
};

const authRoute: RouteRecordRaw = {
  path: '/auth',
  name: 'auth',
  meta: { public: true },
  redirect: { name: 'auth-login' },
  component: () => import('layouts/PublicLayout.vue'),
  children: [
    {
      path: 'login',
      name: 'auth-login',
      meta: { public: true, title: 'Login' },
      component: () => import('components/Auth/Login.vue'),
    },
    {
      path: 'register',
      name: 'auth-register',
      meta: { public: true, title: 'Register' },
      component: () => import('components/Auth/Register.vue'),
    },
    {
      path: 'register/:token',
      name: 'auth-register-token',
      props: true,
      meta: { public: true, title: 'Register' },
      component: () => import('components/Auth/Register.vue'),
    },
    {
      path: 'reset-password/:token',
      name: 'auth-reset-password',
      meta: { public: true, title: 'Register' },
      props: (route) => ({ token: route.params.token }),
      component: () => import('components/Auth/ResetPassword.vue'),
    },
  ],
};

const userRoute: RouteRecordRaw = {
  path: 'user/settings',
  name: 'settings',
  meta: { title: 'Profile' },
  component: () => import('src/pages/Settings.vue'),
};

const adminRoute: RouteRecordRaw = {
  path: 'admin',
  name: 'admin',
  component: () => import('pages/Admin.vue'),
  redirect: { name: 'admin-registration' },
  children: [
    {
      path: 'settings/registration',
      name: 'admin-registration',
      meta: { title: 'Admin - Registration' },
      component: () => import('src/components/Admin/Registration.vue'),
    },
    {
      path: 'settings/style',
      name: 'admin-theme',
      meta: { title: 'Admin - Theme' },
      component: () => import('src/components/Admin/Theme.vue'),
    },
    {
      path: 'users',
      name: 'admin-users',
      meta: { title: 'Admin - Users' },
      component: () => import('components/Admin/Users.vue'),
    },
  ],
};

const teamRoute: RouteRecordRaw = {
  path: 'team',
  name: 'team',
  component: () => import('src/pages/Team.vue'),
};

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    redirect: { name: 'ctfs' },
    component: () => import('layouts/MainLayout.vue'),
    children: [userRoute, ctfsRoute, ctfRoute, adminRoute, teamRoute],
  },
  authRoute,
  {
    path: '/:catchAll(.*)*',
    name: '404',
    meta: { public: true },
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
