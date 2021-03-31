import Vue from "vue";
import Vuex from "vuex";
import { Rights } from "../enums";
import api from "../api.js";
// import example from './module-example'

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

/**
 * MIN_LOAD_TIME defines how much time the loading state must be active
 * TODO: BitK check if there is impact on the other uses of loading
 */
const MIN_LOAD_TIME = 1000;

async function handleApiCall(commit, f) {
  const startTime = new Date();
  commit("startLoading");
  let errors = null;
  try {
    await f();
  } catch (e) {
    errors = e;
  }

  const ellapsed = new Date() - startTime
  setTimeout(() => {
    commit("stopLoading");
  }, MIN_LOAD_TIME - ellapsed);
  return errors;
}

export default async function (/* { ssrContext } */) {
  let users = null;
  let ctfs = null;
  let settings = null;
  let currentUser = users;
  try {
    currentUser = await api.me();
  } catch (e) {
    currentUser = null;
  }
  if (currentUser) {
    ctfs = await api.getCtfs();
    users = await api.getUsers();
    settings = await api.getSettings();
  }
  const Store = new Vuex.Store({
    state: {
      ctfs: ctfs,
      users: users,
      settings: settings,
      currentUser: currentUser,
      currentCtf: null,
      currentTask: null,
      recentTasks: [],
      loading: false
    },
    getters: {
      loading: state => state.loading,
      ctfs: state => state.ctfs,
      users: state => state.users,
      settings: state => state.settings,
      currentUser: state => state.currentUser,
      currentCtf: state => state.currentCtf,
      currentTask: state => state.currentTask,
      recentTasks: state => state.recentTasks,
      isAdmin: (state, getters) => getters.isUserGranted(Rights.ADMIN_ALL),
      isCtfAdmin: (state, getters) => getters.isUserGranted(Rights.EDIT_CTF),
      isUserGranted: state => right => {
        if (state.currentUser.rights.includes(Rights.ADMIN_ALL)) {
          return true;
        }
        return state.currentUser.rights.includes(right);
      },
      isUserGrantedCTF: state => ctfSlug => {
        if (state.currentUser.rights.includes(Rights.CTF_ALL)) {
          return true;
        }
        const ctf = state.ctfs.find(ctf => ctf.slug === ctfSlug);
        if (!ctf) {
          return false;
        }
        return new Boolean(ctf.guests.find(g => g.slug == state.currentUser.slug));
      }
    },
    mutations: {
      initCtfs(state, ctfs) {
        state.ctfs = ctfs;
      },
      startLoading(state) {
        state.loading = true;
      },
      stopLoading(state) {
        state.loading = false;
      },
      addCtf(state, ctf) {
        state.ctfs.unshift(ctf);
      },
      setCurrentCtf(state, ctf) {
        state.currentCtf = ctf;
      },
      setCurrentUser(state, user) {
        state.currentUser = user;
      },
      initUsers(state, users) {
        state.users = users;
      },
      clearCtf(state) {
        state.currentCtf = null;
        state.currentTask = null;
        state.recentTasks = [];
      },
      setCurrentTask(state, task) {
        state.currentTask = task;
      },
      setRecentTask(state, task) {
        let filtered = state.recentTasks.filter((t) => t.id != task.id)
        filtered.unshift(task);
        filtered.splice(3);
        state.recentTasks = filtered;
      },
      deleteTask(state, taskSlug) {
        const idx = state.currentCtf.tasks.findIndex(t => t.slug == taskSlug);
        if (state.currentTask) {
          if (state.currentTask.slug == taskSlug) {
            state.currentTask = null;
          }
        }
        state.currentCtf.tasks.splice(idx, 1);
      },
      deleteCtf(state, ctfSlug) {
        const idx = state.ctfs.findIndex(t => t.slug == ctfSlug);
        if (state.currentCtf) {
          if (state.currentCtf.slug == ctfSlug) {
            state.currentCtf = null;
            state.currentTask = null;
            state.recentTasks = [];
          }
        }
        state.ctfs.splice(idx, 1);
      },
      updateTask(state, task) {
        const idx = state.currentCtf.tasks.findIndex(t => t.slug == task.slug);
        Vue.set(state.currentCtf.tasks, idx, task);
      },
      updateCtf(state, ctf) {
        const idx = state.ctfs.findIndex(c => c.slug == ctf.slug);
        state.currentCtf = ctf;
        Vue.set(state.ctfs, idx, ctf);
      },

      setCTFTasks(state, tasks) {
        tasks.forEach(task => {
          task.players = task.players || []
        })
        Vue.set(state.currentCtf, "tasks", tasks);
      },
      updateUser(state, user) {
        const idx = state.users.findIndex(u => u.slug == user.slug);
        Vue.set(state.users, idx, user);
      },
      deleteUser(state, userSlug) {
        const idx = state.users.findIndex(u => u.slug == userSlug);
        state.users.splice(idx, 1);
      }
    },
    actions: {
      async initState({ commit }) {
        const [ctfs, users] = await Promise.all([api.getCtfs(), api.getUsers()]);
        commit("initCtfs", ctfs);
        commit("initUsers", users);
      },
      clearCtf({ commit }) {
        commit("clearCtf");
      },
      async clearCtfs({ commit }) {
        commit("initCtfs", []);
      },
      async fetchCtfs({ commit }, filter) {
        return handleApiCall(commit, async () => {
          const ctfs = await api.getCtfs(filter);
          commit("initCtfs", ctfs);
        });
      },
      async getCtf({ commit, state }, name) {
        const oldSlug = state.currentCtf ? state.currentCtf.slug : null;

        return handleApiCall(commit, async () => {
          const ctf = await api.getCtf(name);
          if (oldSlug != ctf.slug) commit("setCurrentTask", null);
          commit("setCurrentCtf", ctf);
        });
      },
      async logout({ commit }) {
        return handleApiCall(commit, async () => {
          commit("setCurrentUser", null);
          await api.logout();
        });
      },
      async login({ dispatch, commit }, [username, password]) {
        return handleApiCall(commit, async () => {
          const user = await api.login(username, password);
          commit("setCurrentUser", user.user);
          await dispatch("initState");
        });
      },
      async register({ dispatch, commit }, [username, password]) {
        return handleApiCall(commit, async () => {
          const user = await api.register(username, password);
          commit("setCurrentUser", user.user);
          await dispatch("initState");
        });
      },
      async fetchUsers({ commit }) {
        return handleApiCall(commit, async () => {
          const users = await api.getUsers();
          commit("initUsers", users);
        });
      },
      async setCurrentTask({ commit }, task) {
        commit("setCurrentTask", task);
        commit("setRecentTask", task);
      },
      async importCtf({ commit }, ctfID) {
        return handleApiCall(commit, async () => {
          const ctf = await api.importCtf(ctfID);
          ctf.granted = true;
          commit("addCtf", ctf);
        });
      },
      async importTasks({ commit, state }, tasks) {
        return handleApiCall(commit, async () => {
          const r = await api.setCtfTasks(state.currentCtf.slug, tasks);
          commit("setCTFTasks", r.tasks);
        });
      },

      async onIt({ commit, state }, [taskSlug, onIt]) {
        return handleApiCall(commit, async () => {
          const task = await api.onIt(state.currentCtf.slug, taskSlug, onIt);
          commit("updateTask", task);
        });
      },

      async solved({ commit, state }, [taskSlug, solved, flag]) {
        return handleApiCall(commit, async () => {
          const task = await api.solveTask(state.currentCtf.slug, taskSlug, solved, flag);
          commit("updateTask", task);
        });
      },

      async updateCtfPlayer({ commit, state }, [userSlug, playing]) {
        return handleApiCall(commit, async () => {
          const ctf = await api.updateCtfPlayer(state.currentCtf.slug, userSlug, playing);
          commit("updateCtf", ctf);
        });
      },

      async updateTaskTitle({ commit, state }, [taskSlug, title]) {
        return handleApiCall(commit, async () => {
          const task = await api.updateTaskTitle(state.currentCtf.slug, taskSlug, title);
          commit("updateTask", task);
        });
      },

      async updateTask({ commit, state }, [taskSlug, task]) {
        return handleApiCall(commit, async () => {
          const r = await api.updateTask(state.currentCtf.slug, taskSlug, task);
          commit("updateTask", r);
        });
      },

      async updateTaskCategory({ commit, state }, [taskSlug, category]) {
        return handleApiCall(commit, async () => {
          const task = await api.updateTaskCategory(state.currentCtf.slug, taskSlug, category);
          commit("updateTask", task);
        });
      },

      async updateTaskDescription({ commit, state }, [taskSlug, desc]) {
        return handleApiCall(commit, async () => {
          const task = await api.updateTaskDescription(state.currentCtf.slug, taskSlug, desc);
          commit("updateTask", task);
        });
      },

      async deleteTask({ commit, state }, taskSlug) {
        return handleApiCall(commit, async () => {
          await api.deleteTask(state.currentCtf.slug, taskSlug);
          commit("deleteTask", taskSlug);
        });
      },

      async deleteCtf({ commit }, ctfSlug) {
        return handleApiCall(commit, async () => {
          await api.deleteCtf(ctfSlug);
          commit("deleteCtf", ctfSlug);
        });
      },

      async updateUser({ commit }, [userSlug, updates]) {
        return handleApiCall(commit, async () => {
          const user = await api.updateUser(userSlug, updates);
          commit("updateUser", user);
        });
      },

      async deleteUser({ commit }, userSlug) {
        return handleApiCall(commit, async () => {
          await api.deleteUser(userSlug);
          commit("deleteUser", userSlug);
        });
      },

      async createCtf({ commit }, newCtf) {
        return handleApiCall(commit, async () => {
          const ctf = await api.createCtf(newCtf);
          ctf.granted = true;
          commit("addCtf", ctf);
        });
      },

      async updateCtf({ commit }, [ctfSlug, updates]) {
        return handleApiCall(commit, async () => {
          await api.updateCtf(ctfSlug, updates);
          commit("updateCtf", { ...updates, slug: ctfSlug });
        });
      }
    }
  });

  return Store;
}
