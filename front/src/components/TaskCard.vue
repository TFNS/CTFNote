<template>
  <div class="col-auto col-grow">
    <q-card bordered class="task" :class="{ solved: task.solved }">
      <q-menu touch-position context-menu>
        <q-list dense>
          <q-item tag="label" v-ripple v-close-popup>
            <q-item-section side top>
              <q-checkbox :value="onIt" @input="updateOnIt" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-px-md">
                On it
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple v-close-popup>
            <q-item-section side top>
              <q-checkbox :value="task.solved" @input="$emit('solve-task')" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="q-px-md">
                Solved
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple v-close-popup @click="$emit('edit-task')">
            <q-item-section side>
              <q-avatar icon="edit" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-px-md">
                Edit
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="$emit('delete-task')">
            <q-item-section side>
              <q-avatar icon="delete" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-px-md">
                Delete
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>

      <q-card-section>
        <q-badge v-if="showBadge" class="solved-badge" floating :color="$ctfnote.taskIconColor(task)">
          <q-icon :name="$ctfnote.taskIcon(task)" />
          <q-tooltip
            anchor="top right"
            self="top left"
            :offset="[0, 0]"
            content-class="transparent"
            v-if="players.length"
          >
            <q-card dense bordered>
              <q-card-section class="tooltip-section">
                <q-list dense>
                  <q-item tag="label" :key="player.slug" v-for="player in players">
                    <q-item-section class="text-center">
                      <q-chip class="text-white text-center" :style="colorHash(player.slug)">
                        <div class="text-center full-width">
                          {{ player.username }}
                        </div>
                      </q-chip>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-tooltip>
        </q-badge>
        <div class="row justify-between">
          <router-link class="text-h6 col tasklink" tag="a" :to="$ctfnote.taskLink(ctf, task)">
            {{ task.title }}
          </router-link>
          <div class="col col-auto">
            <q-chip
              class="text-white"
              clickable
              @click="$emit('filter-category', task.category)"
              :style="taskStyle(task.category)"
            >
              {{ task.category }}
            </q-chip>
          </div>
        </div>
      </q-card-section>
      <q-separator inset v-if="!isUltraDense" />
      <q-card-section v-if="!isUltraDense">
        <p class="task-description">
          {{ task.description || "..." }}
        </p>
      </q-card-section>
      <q-card-actions v-if="!isDense" class="action-btn" align="right">
        <q-btn round size="sm" @click="updateOnIt(!onIt)" :title="onItTitle" :icon="onItIcon" :color="onItColor" />
        <q-btn round size="sm" @click="$emit('solve-task')" title="Enter flag" icon="flag" color="positive" />
        <q-btn round size="sm" @click="$emit('edit-task')" :title="`Edit ${task.title}`" icon="edit" color="warning" />
        <q-btn
          round
          size="sm"
          @click="$emit('delete-task')"
          :title="`Delete ${task.title}`"
          icon="delete"
          color="negative"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { colorHash } from "../utils";
export default {
  props: {
    task: { type: Object, required: true },
    ctf: { type: Object, required: true },
    categories: { type: Array, required: true },
    displayMode: { type: String, required: true }
  },
  computed: {
    isDense() {
      return this.displayMode != "classic";
    },
    isUltraDense() {
      return this.displayMode == "ultradense";
    },
    onItTitle() {
      return `${this.onIt ? "Stop" : "Start"} working on ${this.task.title}`;
    },
    linkEvent() {
      return this.editTask ? "none" : "click";
    },
    showBadge() {
      return this.task.solved || this.players?.length > 0;
    },
    badgeColor() {
      return this.task.solved ? "positive" : this.onIt ? "secondary" : "primary";
    },
    badgeIcon() {
      return this.task.solved ? "flag" : this.playersOnItIcon;
    },
    onItColor() {
      return this.onIt ? "secondary" : "primary";
    },
    onIt() {
      return this.players?.some(p => p.id == this.$ctfnote.me.id);
    },
    onItIcon() {
      return this.onIt ? "person_remove" : "person_add_alt_1";
    },
    playersOnItIcon() {
      const count = this.players.length;
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

    players() {
      return this.task.workOnTasks.nodes.map(n => n.profile);
    }
  },
  methods: {
    taskStyle(s) {
      return { backgroundColor: colorHash(s) };
    },
    updateOnIt(v) {
      if (v) {
        this.$emit("start-work-on-task");
      } else {
        this.$emit("stop-work-on-task");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.tasklink {
  color: inherit;
  text-decoration: none;
}
.solved {
  border-color: $positive;
}
.action-btn .q-btn {
  width: 30px;
}

.solved-badge {
  top: 0;
  font-size: 1.2em;
  right: 0;
  transform: translate(25%, -40%);
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
      box-shadow: 0px 0px 5px rgba(25, 25, 25, 0.8);
    }
  }
}

.tooltip-section,
.tooltip-section label {
  padding: 2px 4px !important;
}
</style>
