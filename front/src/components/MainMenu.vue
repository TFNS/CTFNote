<template>
  <q-header elevated>
    <q-toolbar>
      <q-toolbar-title class="row items-center q-gutter-md">
        <ctf-note-link name="ctfs-incoming" class="text-white" underline>
          <q-img src="/favicon.svg" width="30px" class="q-mr-md" />
          <q-btn flat no-caps >CTFNote</q-btn>
        </ctf-note-link>
        <template v-if="ctf">
          <q-separator dark vertical />
          <div class="row items-center justify-center">
            <q-btn
              class="q-mr-sm"
              type="a"
              target="_blank"
              :href="ctf.ctfUrl"
              flat
              icon="language"
              size="sm"
              round
            />
            <ctf-note-link name="ctf-tasks" :ctf="ctf">
              <q-btn flat no-caps >{{ ctf.title }}</q-btn>
            </ctf-note-link>
          </div>
          <q-separator v-show="ctf.tasks.length" dark vertical />
          <task-list-menu v-show="ctf.tasks.length" :ctf="ctf" :task="task" />
        </template>
      </q-toolbar-title>
      <q-btn-dropdown
        flat
        :label="me.profile?.username ?? 'Login'"
        split
        align="right"
        content-class="drop-menu"
        :to="{ name: me.isLogged ? 'settings' : 'auth-login' }"
      >
        <q-list class="text-center">
          <q-item v-if="me.isAdmin" clickable :to="{ name: 'admin' }">
            <q-item-section>
              <q-item-label>Admin</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="me.isLogged" clickable :to="{ name: 'settings' }">
            <q-item-section>
              <q-item-label>Profile</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="me.isLogged" clickable :to="{ name: 'team' }">
            <q-item-section>
              <q-item-label>Team</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <div>
                <q-toggle
                  v-model="darkMode"
                  title="Switch theme"
                  size="lg"
                  checked-icon="brightness_3"
                  unchecked-icon="brightness_7"
                />
              </div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <div>
                <q-toggle
                  v-model="liveMode"
                  title="Show secrets"
                  size="lg"
                  checked-icon="visibility"
                  unchecked-icon="visibility_off"
                />
              </div>
            </q-item-section>
          </q-item>
          <q-separator v-if="me.isGuest" inset spaced />

          <q-item v-if="me.isGuest" clickable @click="logout">
            <q-item-section>
              <q-item-label>Logout</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import CtfNoteLink from 'src/components/Utils/CtfNoteLink.vue';
import TaskListMenu from 'src/components/Utils/TaskListMenu.vue';
import { Ctf, Task } from 'src/ctfnote';
import { logout } from 'src/ctfnote/auth';
import { onMenuChange } from 'src/ctfnote/menu';
import { MeKey } from 'src/ctfnote/symbols';
import { useStoredSettings } from 'src/extensions/storedSettings';
import { injectStrict } from 'src/utils';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: { CtfNoteLink, TaskListMenu },

  setup() {
    const $q = useQuasar();

    const { makePersistant } = useStoredSettings();
    const liveMode = makePersistant('live-mode', ref(true));
    const darkMode = makePersistant('dark-mode', ref(true));
    const ctf = ref<Ctf | null>(null);
    const task = ref<Task | null>(null);

    watch(darkMode, (v) => $q.dark.set(v), { immediate: true });
    watch(
      liveMode,
      (v) =>
        !v
          ? document.body.classList.add('live-mode')
          : document.body.classList.remove('live-mode'),
      { immediate: true }
    );

    const me = injectStrict(MeKey);

    onMenuChange((c, t) => {
      ctf.value = c;
      task.value = t;
    }, true);

    return {
      me,
      liveMode,
      darkMode,
      ctf,
      task,
      logout,
    };
  },
});
</script>

<style>
.drop-menu {
  min-width: 150px !important;
}
</style>
