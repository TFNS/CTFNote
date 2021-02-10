<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="ctfnote-header">
      <q-linear-progress v-show="loading" indeterminate color="warning" track-color="transparent" class="loading-bar" />
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" v-if="menu" @click="leftDrawerOpen = !leftDrawerOpen"  />

        <q-toolbar-title>
          <div class="row">
            <q-btn :to="{ name: 'ctfs' }" stretch flat label="CTFNote" />
            <q-separator vertical inset v-if="currentCtf" />
            <q-btn
              :to="{ name: 'ctf', params: { ctfSlug: currentCtf.slug } }"
              stretch
              flat
              :label="currentCtf.title"
              v-if="currentCtf"
            />
            <q-separator vertical inset v-if="currentTask" />

            <q-btn
              :to="{
                name: 'task',
                params: { ctfSlug: currentCtf.slug, taskSlug: currentTask.slug }
              }"
              stretch
              flat
              :label="currentTask.title"
              v-if="currentTask"
            />
            <div
            v-for="(task) in recentTasks" :key="task.id">              
            <q-btn
                :to="{
                  name: 'task',
                  params: { ctfSlug: currentCtf.slug, taskSlug: task.slug }
                }"
                stretch
                flat
                :label="task.title"
                v-if="task != null && task != currentTask"
              />
            </div>
          </div>
        </q-toolbar-title>
        <q-btn-dropdown stretch flat :label="currentUser.username" v-if="currentUser">
          <q-list class="text-center">
            <q-item v-if="isAdmin" clickable v-close-popup :to="{ name: 'adminConfig' }">
              <q-item-section>
                <q-item-label>Settings</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="isAdmin" clickable v-close-popup :to="{ name: 'adminUsers' }">
              <q-item-section>
                <q-item-label>Users</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <div>
                <q-toggle v-model="darkMode" size="lg" checked-icon="brightness_3" unchecked-icon="brightness_7" />
              </div>
            </q-item>
            <q-separator inset spaced />

            <q-item clickable v-close-popup :to="{ name: 'logout' }">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered v-if="menu">
      <q-list :key="category" v-for="[category, tasks] of Object.entries(menu)">
        <q-item-label header class="text-white text-bold" :style="colorHash(category)">
          {{ category }}
        </q-item-label>
        <MenuTaskList v-for="task in tasks" :key="task.name" :task="task" />
      </q-list>
      <q-list v-if="Object.keys(menu).length == 0">
        <q-item-label header> No tasks yet </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import MenuTaskList from "components/MenuTaskList.vue";
import { mapGetters } from "vuex";
import { colorHash } from "../utils";
import { Rights } from "../enums";

export default {
  name: "MainLayout",
  components: { MenuTaskList },
  created() {
    this.$q.dark.set(this.darkMode);
    if (!this.checkLogin(this.$route)) {
      return;
    }
  },
  watch: {
    $route(to) {
      if (to.name == "index") {
        this.$router.push({ name: "ctfs" });
      }
      this.checkLogin(to);
    },
    darkMode(value) {
      localStorage.setItem("darkMode", value);
      this.$q.dark.set(value);
    }
  },
  methods: {
    checkLogin(to) {
      if (to.name != "auth" && !this.currentUser) {
        this.$router.push({ name: "auth" });
        return false;
      }
      return true;
    },
    colorHash(s) {
      return { backgroundColor: colorHash(s) };
    }
  },
  computed: {
    ...mapGetters(["currentCtf", "ctfs", "currentUser", "currentTask", "recentTasks", "isAdmin", "loading"]),
    menu() {
      if (!this.currentCtf || !this.currentCtf.tasks) return null;
      const categories = {};
      for (const task of this.currentCtf.tasks) {
        if (!(task.category in categories)) {
          categories[task.category] = [];
        }
        categories[task.category].push({
          title: task.title,
          solved: task.solved,
          to: {
            name: "task",
            params: { ctfSlug: this.currentCtf.slug, taskSlug: task.slug }
          }
        });
      }
      return categories;
    }
  },
  data() {
    const darkMode = localStorage.getItem("darkMode") == "true";
    return {
      leftDrawerOpen: false,
      Rights,
      darkMode
    };
  }
};
</script>

<style>
.ctfnote-header {
  height: 50px;
}

.loading-bar {
  height: 1px;
  z-index: 2001;
  position: fixed;
  top: 0;
}
</style>
