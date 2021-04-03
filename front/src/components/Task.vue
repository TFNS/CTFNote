<template>
  <div class="col-auto col-grow tasklink">
    <q-card bordered class="task" :class="{ solved: task.solved }">
      <q-menu touch-position context-menu>
        <q-list dense class="bg-dark">
          <q-item tag="label" v-ripple v-close-popup>
            <q-item-section side top>
              <q-checkbox :value="onIt" @input="updateOnIt" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="q-px-md">On it</q-item-label>
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple v-close-popup>
            <q-item-section side top>
              <q-checkbox :value="task.solved" @input="updateSolved" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="q-px-md">Solved</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            tag="label"
            v-ripple
            v-close-popup
            @click="showFlag"
            v-if="this.task.flag != null && this.task.flag.length > 0"
          >
            <q-item-section side top>
              <q-avatar icon="flag" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-px-md">Show flag</q-item-label>
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple v-close-popup @click="$emit('edit-task')">
            <q-item-section side>
              <q-avatar icon="edit" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-px-md">Edit</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="$emit('delete-task')">
            <q-item-section side>
              <q-avatar icon="delete" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-px-md">Delete</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>

      <q-card-section>
        <q-badge v-if="showBadge" class="solved-badge" floating :color="badgeColor">
          <q-icon :name="badgeIcon" />
          <q-tooltip anchor="top right" self="top left" :offset="[0, 0]" content-class="transparent">
            <q-card dense bordered>
              <q-card-section class="tooltip-section">
                <q-list dense>
                  <q-item tag="label" :key="player.slug" v-for="player in task.players">
                    <q-item-section class="text-center">
                      <q-chip class="text-white text-center" :style="colorHash(player.slug)">
                        <div class="text-center full-width">{{ player.username }}</div>
                      </q-chip>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-tooltip>
        </q-badge>
        <div class="row justify-between">
          <router-link
            class="text-h6 col cursor-pointer"
            tag="div"
            :to="{
              name: 'task',
              params: { ctfSlug: ctf.slug, taskSlug: task.slug },
            }"
          >
            {{ task.title }}
          </router-link>
          <div class="col col-auto">
            <q-chip
              class="text-white"
              clickable
              @click="$emit('filter-category', task.category)"
              :style="colorHash(task.category)"
            >
              {{ task.category }}
            </q-chip>
          </div>
        </div>
      </q-card-section>
      <q-separator inset v-if="!denseMode" />
      <q-card-section>
        <p class="task-description">
          {{ task.description || "..." }}
        </p>
        <p v-if="task.solved && !denseMode" class="task-flag blur">
          {{ task.flag || "Missing flag" }}
        </p>
      </q-card-section>
      <q-card-actions v-if="!denseMode" class="action-btn" align="right">
        <q-btn round size="sm" @click="updateOnIt(!onIt)" :icon="onItIcon" :color="onItColor" />
        <q-btn round size="sm" @click="updateSolved" icon="flag" color="positive" />
        <q-btn round size="sm" @click="$emit('edit-task')" icon="edit" color="warning" />
        <q-btn round size="sm" @click="$emit('delete-task')" icon="delete" color="negative" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { colorHash, showErrors } from "../utils";
export default {
  props: {
    task: Object,
    ctf: Object,
    categories: Array,
    denseMode: { type: Boolean, default: false },
  },
  computed: {
    ...mapGetters(["currentUser", "settings"]),
    currentUser() {
      return this.$store.getters.currentUser;
    },
    linkEvent() {
      return this.editTask ? "none" : "click";
    },
    showBadge() {
      return this.task.solved || this.task.players.length > 0;
    },
    badgeColor() {
      return this.task.solved ? "positive" : "primary";
    },
    badgeIcon() {
      return this.task.solved ? "flag" : this.playersOnItIcon;
    },
    onItColor() {
      return this.onIt ? "secondary" : "primary";
    },
    onIt() {
      return this.task.players.some((p) => p.slug == this.currentUser.slug);
    },
    onItIcon() {
      return this.onIt ? "person_remove" : "person_add_alt_1";
    },
    playersOnItIcon() {
      const count = this.task.players.length;
      if (count == 0) {
        return "exposure_zero";
      }
      if (count == 1) {
        return "person";
      }
      if (count == 2) {
        return "group";
      }
      return "groups";
    },

    playersName() {
      return this.task.players.map((p) => p.username).join(", ");
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    colorHash(s) {
      return { backgroundColor: colorHash(s) };
    },

    updateOnIt(v) {
      this.$store.dispatch("onIt", [this.task.slug, v]);
    },
    async updateSolved(v) {
      let args = [this.task.slug, v];

      if (v) {
        this.$q
          .dialog({
            title: "Enter the flag",
            cancel: true,
            prompt: {
              model: "",
              type: "text",
            },
            color: "primary",
          })
          .onOk((data) => {
            if (data.length > 0) {
              args.push(data);
            }
            this.$store.dispatch("solved", [this.task.slug, true, data]);
          });
      } else {
        this.$store.dispatch("solved", [this.task.slug, false, ""]);
      }
    },
    async showFlag() {
      this.$q.dialog({
        title: `Flag for ${this.task.title}`,
        message: this.task.flag,
        color: "primary",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.solved {
  border-color: var(--q-color-positive);
}
.action-btn {
  cursor: default;
}
.action-btn .q-btn {
  width: 30px;
}

.blur {
  filter: blur(5px);
  &:hover {
    filter: blur(0px);
    transition: filter 0.2s;
    transition-delay: 0.2s;
  }
}
.task-flag:before {
  content: "Flag: ";
}
.solved-badge {
  top: 0;
  font-size: 1.2em;
  right: 0;
  transform: translate(25%, -40%);
}

.tasklink {
  color: inherit;
  text-decoration: none;
  min-width: calc(100% / 6);
}

.body--dark {
  .task {
    transition: transform 0.15s, box-shadow 0.15s;
    &:hover {
      box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.3);
    }
  }
}

.body--light {

  .task {
    transition: transform 0.15s, box-shadow 0.15s;
    &:hover {
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.8);
    }
  }

}
.tooltip-section,
.tooltip-section label {
  padding: 2px 4px !important;
}
</style>
<style></style>
