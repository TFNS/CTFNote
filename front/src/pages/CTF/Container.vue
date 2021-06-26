<template>
  <q-page>
    <router-view v-if="currentCtf" :ctf="currentCtf" :task="currentTask"></router-view>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";

function filterTasksByUser(tasks, username) {
  return tasks.filter((task) => task.players.some((user) => user?.username == username));
}

function notificationsByTask(oldTask, newTask) {
  let notifications = [];
  if (!oldTask.solved && newTask.solved) {
    notifications.push("Task " + oldTask.title + " has been solved!");
  }
  for (const { username } of newTask.players) {
    if (!oldTask.players.find((user) => user.username == username)) {
      notifications.push(username + " is now solving " + oldTask.title + " as well");
    }
  }
  for (const newStatus of newTask.statuses) {
    if (!oldTask.statuses.find((oldStatus) => oldStatus.id == newStatus.id)) {
      notifications.push(`${newStatus.user.username}: ${newStatus.value}`);
    }
  }
  return notifications;
}

export default {
  components: {},
  props: {
    ctfSlug: String,
  },
  data() {
    return { interval: null };
  },
  computed: {
    ...mapGetters(["currentCtf", "currentTask"]),
  },
  created() {
    const REFRESH_RATE = 10 * 1000; // 10s
    this.$store.dispatch("clearCtf");
    this.$store.dispatch("getCtf", this.ctfSlug);
    this.interval = window.setInterval(() => {
      this.$store.dispatch("getCtf", this.ctfSlug).then(([[oldCtf, newCtf], _]) => {
        if (oldCtf == null || newCtf == null) {
          return;
        }
        const oldTasks = filterTasksByUser(oldCtf.tasks, this.$store.state.currentUser?.username);
        const newTasks = filterTasksByUser(newCtf.tasks, this.$store.state.currentUser?.username);
        let notified = false;
        for (const oldTask of oldTasks) {
          for (const notification of notificationsByTask(
            oldTask,
            newTasks.find((task) => task.title == oldTask.title)
          )) {
            this.$q.notify({
              message: notification,
              closeBtn: true,
              timeout: 0,
            });
            notified = true;
          }
        }
        if (notified) {
          const audio = new Audio("/static/cocku.mp3");
          audio.play();
        }
      });
    }, REFRESH_RATE);
  },

  beforeDestroy() {
    window.clearInterval(this.interval);
  },
};
</script>
