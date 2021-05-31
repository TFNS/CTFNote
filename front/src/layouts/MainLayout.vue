<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="ctfnote-header">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" v-if="ctf" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>
          <div class="row q-gutter-md items-center">
            <router-link class="text-white" exact :to="{ name: 'incoming' }"> CTFNote </router-link>
            <template v-if="ctf && ctf.id">
              <q-separator vertical />
              <q-btn type="a" target="_blank" :href="ctf.ctfUrl" flat icon="language" size="sm" round />
              <router-link class="text-white" exact :to="$ctfnote.ctfLink(ctf)">
                {{ ctf.title }}
              </router-link>
            </template>
            <template v-if="task">
              <q-separator vertical />
              <router-link class="text-white" exact :to="$ctfnote.taskLink(ctf, task)">
                {{ task.title }}
              </router-link>
            </template>
          </div>
        </q-toolbar-title>
        <q-btn-dropdown stretch flat :label="$ctfnote.me.username" v-if="$ctfnote.me !== $ctfnote.anonymous">
          <q-list class="text-center">
            <q-item v-if="$ctfnote.isAdmin" clickable :to="{ name: 'admin' }">
              <q-item-section>
                <q-item-label>Admin</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'settings' }">
              <q-item-section>
                <q-item-label>Settings</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <div>
                <q-toggle
                  v-model="$localStorage.darkMode"
                  title="Switch theme"
                  size="lg"
                  checked-icon="brightness_3"
                  unchecked-icon="brightness_7"
                />
              </div>
            </q-item>
            <q-item>
              <div>
                <q-toggle
                  v-model="$localStorage.liveMode"
                  title="Show secrets"
                  size="lg"
                  checked-icon="visibility"
                  unchecked-icon="visibility_off"
                />
              </div>
            </q-item>
            <q-separator inset spaced />

            <q-item clickable :to="{ name: 'logout' }">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
      <q-linear-progress v-if="ctf && runningCtf" color="secondary" :value="ctfProgress"></q-linear-progress>
      <q-linear-progress v-if="ctf && !runningCtf" color="red" :value="100"></q-linear-progress>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" bordered v-if="ctf">
      <LeftMenu :ctf="ctf" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import db from "src/gql";
import LeftMenu from "components/LeftMenu.vue";
import * as utils from "src/utils";

export default {
  name: "MainLayout",
  components: { LeftMenu },
  created() {
    this.$q.dark.set(this.darkMode);
  },
  apollo: {
    ctf() {
      return {
        query: db.ctf.GET,
        skip: true,
        variables: {}
      };
    },
    task() {
      return {
        query: db.task.GET,
        skip: true,
        variables: {}
      };
    }
  },
  localStorage: {
    darkMode: {
      type: Boolean,
      default: false
    },
    liveMode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    menu() {
      if (!this.ctf?.tasks) return null;
      const categories = {};
      for (const task of this.ctf.tasks.nodes) {
        if (!(task.category in categories)) {
          categories[task.category] = [];
        }
        categories[task.category].push({
          title: task.title,
          solved: task.solved,
          to: this.getTaskLink(this.ctf, task)
        });
      }
      return Object.entries(categories).sort();
    },
    darkMode() {
      return this.$localStorage.darkMode;
    },
    liveMode() {
      return this.$localStorage.liveMode;
    },
    runningCtf() {
      return utils.isRunningCtf(this.ctf, this.now);
    },
    ctfProgress() {
      const { startTime, endTime } = this.ctf;
      const now = this.now.getTime();

      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      const delta = end - start;
      const fromNow = now - start;

      return fromNow / delta;
    }
  },
  mounted() {
    this.updateNavLink(this.$route);
    this.registerSubscriber(
      {
        query: db.ctf.SUBSCRIBE,
        variables: { topic: `ctf:0:created` }
      },
      data => {
        const ctf = data.listen.relatedNode;
        this.$q.notify({ message: `CTF ${ctf.title} created!`, type: "positive" });
      }
    );
  },
  watch: {
    $route(to) {
      this.updateNavLink(to);
    },
    darkMode(value) {
      this.$q.dark.set(value);
    },
    ctf(ctf) {
      this.clearSubscribers();
      this.registerSubscriber(
        {
          query: db.task.SUBSCRIBE,
          variables: { topic: `ctf:${ctf.id}:taskSolved` }
        },
        data => {
          const task = data.listen.relatedNode;
          this.$q.notify({ message: `Task ${task.title} solved!`, type: "positive" });
        }
      );
      this.registerSubscriber(
        {
          query: db.task.SUBSCRIBE,
          variables: { topic: `ctf:${ctf.id}:taskCreated` }
        },
        data => {
          const task = data.listen.relatedNode;
          this.$q.notify({ message: `Task ${task.title} created!`, type: "positive" });
        }
      );
    },
    liveMode: {
      immediate: true,
      handler(value) {
        if (!value) {
          document.body.classList.add("live-mode");
        } else {
          document.body.classList.remove("live-mode");
        }
      }
    }
  },
  methods: {
    registerSubscriber(query, next, keep = false) {
      const observer = this.$apollo.subscribe(query);
      const subscriber = observer.subscribe({ next: ({ data }) => next(data) });
      if (!keep) {
        this.subscribers.push(subscriber);
      }
    },
    clearSubscribers() {
      while (this.subscribers.length) {
        this.subscribers.pop().unsubscribe();
      }
    },
    updateNavLink(route) {
      const ctfId = route.params.ctfId;
      if (!ctfId) {
        this.$apollo.queries.ctf.skip = true;
        return;
      }
      this.$apollo.queries.ctf.setVariables({ id: parseInt(ctfId) });
      this.$apollo.queries.ctf.skip = false;

      const taskId = route.params.taskId;
      if (!taskId) {
        this.$apollo.queries.task.skip = true;
        return;
      }
      this.$apollo.queries.task.setVariables({ id: parseInt(taskId) });
      this.$apollo.queries.task.skip = false;
    }
  },
  data() {
    return {
      leftDrawerOpen: false,
      subscribers: [],
      now: new Date()
    };
  }
};
</script>

<style lang="scss">
.ctfnote-header a {
  text-decoration: none;
}
</style>
