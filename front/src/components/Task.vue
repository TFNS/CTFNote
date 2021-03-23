<template>
  <div class="col-auto col-grow tasklink">
    <router-link
      class="col-auto col-grow tasklink"
      ref="link"
      :event="linkEvent"
      :to="{
        name: 'task',
        params: { ctfSlug: ctf.slug, taskSlug: task.slug }
      }"
    >
      <q-card bordered class="task" :class="{ solved: task.solved }">
        <q-menu touch-position context-menu>
          <q-list dense>
            <q-item tag="label" v-ripple v-close-popup>
              <q-item-section side top>
                <q-checkbox v-model="onIt" @input="updateOnIt" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="q-px-md">On it</q-item-label>
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple v-close-popup>
              <q-item-section side top>
                <q-checkbox v-model="solved" @input="updateSolved" />
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
              v-if="this.settings['store-flag'] && this.task.flag != null && this.task.flag.length > 0"
            >
              <q-item-section side top>
                <q-avatar icon="flag" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="q-px-md">Show flag</q-item-label>
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple v-close-popup @click="editTask = !editTask">
              <q-item-section side>
                <q-avatar icon="edit" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="q-px-md">Edit</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="showConfirmDelete = true">
              <q-item-section side>
                <q-avatar icon="delete" />
              </q-item-section>
              <q-item-section class="q-px-md">Delete</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
        <q-card-section>
          <q-badge class="solved-badge" floating color="positive" v-if="task.solved">
            <q-icon name="check" />
          </q-badge>
          <q-badge class="solved-badge" floating color="warning" v-if="editTask">
            <q-icon name="edit" />
          </q-badge>
          <div class="row">
            <div class="text-h6 editable">
              {{ task.title }}

              <q-popup-edit v-model="title" @save="updateTitle" buttons>
                <q-input v-model="title" dense autofocus />
              </q-popup-edit>
            </div>
            <q-space />

            <q-space />
            <div>
              <q-chip class="text-white editable" :style="colorHash(task.category)">
                {{ task.category }}

                <q-popup-edit v-model="category" @save="updateCategory" buttons>
                  <q-input v-model="category" dense autofocus />
                </q-popup-edit>
              </q-chip>
            </div>
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          <div class="text editable">
            <p v-if="!task.solved" class="task-description">{{ task.description || "..." }}</p>
            <p v-if="task.solved" class="task-flag">{{ task.flag || "Missing flag" }}</p>
            <q-popup-edit v-model="description" @save="updateDescription" buttons>
              <q-input v-model="description" dense autofocus />
            </q-popup-edit>
          </div>
        </q-card-section>

        <q-card-section>
          <q-chip
            :label="player.username"
            :key="player.slug"
            class="text-white q-pa-md"
            :style="colorHash(player.slug)"
            v-for="player in task.players"
          />
          <q-chip class="q-pa-md" label="nobody" v-if="task.players.length == 0" />
        </q-card-section>
      </q-card>
    </router-link>

    <q-dialog v-model="showConfirmDelete">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm delete</div>
        </q-card-section>

        <q-card-section class="q-pt-none"> </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="primary" v-close-popup @click="deleteTask" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { colorHash, showErrors } from "../utils";
export default {
  props: {
    task: Object,
    ctf: Object
  },
  computed: {
    ...mapGetters(["currentUser", "settings"]),

    linkEvent() {
      return this.editTask ? "none" : "click";
    }
  },
  data() {
    const currentUser = this.$store.getters.currentUser;
    const onIt = Boolean(this.task.players.find(u => u.slug == currentUser.slug));
    return {
      showConfirmDelete: false,
      solved: this.task.solved,
      onIt,
      editTask: false,
      title: this.task.title,
      category: this.task.category,
      description: this.task.description,
      flag: this.task.flag
    };
  },
  mounted() {},
  methods: {
    colorHash(s) {
      return { backgroundColor: colorHash(s) };
    },
    async deleteTask() {
      const errors = await this.$store.dispatch("deleteTask", this.task.slug);
      showErrors(this, errors);
    },
    async updateTitle(title) {
      const errors = await this.$store.dispatch("updateTaskTitle", [this.task.slug, title]);
      showErrors(this, errors);
    },
    async updateDescription(description) {
      const errors = await this.$store.dispatch("updateTaskDescription", [this.task.slug, description]);
      showErrors(this, errors);
    },
    async updateCategory(category) {
      const errors = await this.$store.dispatch("updateTaskCategory", [this.task.slug, category]);
      showErrors(this, errors);
    },

    async updateOnIt(v) {
      this.$store.dispatch("onIt", [this.task.slug, v]);
    },
    async updateSolved(v) {
      let args = [this.task.slug, v];

      if (v && this.settings["store-flag"]) {
        this.$q
          .dialog({
            title: "Enter flag",
            message: "Please enter the flag",
            cancel: true,
            prompt: {
              model: "",
              type: "text"
            },
            color: "blue"
          })
          .onOk(data => {
            if (data.length > 0) {
              args.push(data);
            }

            this.$store.dispatch("solved", args);
          })
          .onCancel(data => {
            this.solved = false;
          });
      } else {
        this.$store.dispatch("solved", args);
      }
    },
    async showFlag() {
      this.$q.dialog({
        title: "Flag for " + this.task.title,
        message: this.task.flag,
        color: "blue"
      });
    }
  },
  watch: {
    task(t, old) {
      if (t.slug != old.slug) {
        this.editTask = false;
      }
      if (this.editTask == false) {
        this.title = t.title;
        this.category = t.category;
        this.onIt = Boolean(t.players.find(u => u.slug == this.currentUser.slug));
        this.solved = t.solved;
        this.editTask = false;
      }
    }
  }
};
</script>
<style>
.solved {
  border-color: var(--q-color-positive);
}

.task-flag {
  font-weight: bold;
}
</style>
<style lang="scss" scoped>
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

.task {
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.8);
  }
}
</style>
