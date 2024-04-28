<template>
  <q-dialog ref="dialogRef" position="top" @hide="onDialogHide">
    <q-card style="width: 100%; max-width: 1000px">
      <q-card-section class="row items-center no-wrap">
        <div class="text-h6 ellipsis">Global search</div>
        <q-space />
        <ShortcutHint :keys="['ctrl', 'k']" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="searchText"
          filled
          label="Search for CTF, task or tag"
          :loading="loading"
          @update:model-value="onSearchChange"
          @keypress.enter="submit"
          @vue:mounted="focusInput"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section v-if="!!items.length" class="q-pt-none">
        <q-list bordered separator style="border-radius: 4px">
          <q-item
            v-for="(item, i) in items"
            :key="item.nodeId"
            :focused="i === selectedItemIndex"
            clickable
            class="col"
            @click="onItemSelected(item)"
          >
            <q-item-section side top class="justify-center" style="width: 54px">
              <q-badge
                v-if="item.__typename == 'Ctf'"
                color="primary"
                label="CTF"
                style="margin: auto"
              />
              <q-badge v-else color="secondary" :label="item.__typename" />
            </q-item-section>

            <q-item-section>
              <span>
                {{ !!item.ctf ? item.ctf.title + ' / ' : '' }}
                <b>{{ item.title }}</b>
              </span>
            </q-item-section>

            <q-item-section side>
              <task-tags-list
                v-if="item.assignedTags"
                :tags="item.assignedTags"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import hotkeys from 'hotkeys-js';
import { useDialogPluginComponent } from 'quasar';
import ctfnote from 'src/ctfnote';
import { safeSlugify } from 'src/ctfnote/ctfs';
import { Ctf, Task } from 'src/ctfnote/models';
import { defineComponent, onMounted, onUnmounted, Ref, ref } from 'vue';
import ShortcutHint from '../Utils/ShortcutHint.vue';
import TaskTagsList from '../Task/TaskTagsList.vue';

export default defineComponent({
  components: {
    ShortcutHint,
    TaskTagsList,
  },
  emits: useDialogPluginComponent.emits,
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const items: Ref<Array<Ctf | Task>> = ref([]);
    const selectedItemIndex = ref(0);
    const searchText = ref('');

    const updateSelectedIndex = () => {
      if (selectedItemIndex.value >= items.value.length)
        selectedItemIndex.value = items.value.length - 1;

      if (selectedItemIndex.value < 0) selectedItemIndex.value = 0;
    };

    const previousShortcut = 'command+p, ctrl+p, up';
    const nextShortcut = 'command+n, ctrl+n, down';
    const cancelShortcut = 'esc';

    onUnmounted(() => {
      hotkeys.unbind(previousShortcut);
      hotkeys.unbind(nextShortcut);
      hotkeys.unbind(cancelShortcut);
    });

    onMounted(() => {
      hotkeys.filter = function () {
        return true;
      };

      hotkeys(previousShortcut, (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        selectedItemIndex.value += -1;
        updateSelectedIndex();
      });

      hotkeys(nextShortcut, (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        selectedItemIndex.value += 1;
        updateSelectedIndex();
      });

      hotkeys(cancelShortcut, (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        if (dialogRef) dialogRef.value?.hide();
      });
    });

    return {
      dialogRef,
      loading: false,
      searchText,
      selectedItemIndex,
      items,
      onDialogHide,
      onDialogOK,
      onDialogCancel,
    };
  },
  methods: {
    async onSearchChange() {
      if (!this.searchText || this.searchText.length < 2) {
        this.items = [];
        return;
      }

      this.items = await ctfnote.search.searchAll(this.searchText);
    },
    onItemSelected(item: Ctf | Task) {
      function isCtf(item: Ctf | Task): item is Ctf {
        return (item as Ctf).weight !== void 0; // No other way to check the type ?
      }

      const type = isCtf(item) ? 'ctf' : 'task';

      let params = {};

      if (type === 'ctf') {
        params = {
          ctfId: item.id,
          ctfSlug: safeSlugify(item.title),
        };
      }

      if (type === 'task') {
        const task = item as Task;
        const ctf = task.ctf as Ctf;

        params = {
          ctfId: ctf.id,
          ctfSlug: safeSlugify(ctf.title),
          taskId: task.id,
          taskSlug: safeSlugify(task.title),
        };
      }

      const link = this.$router.resolve({
        name: type,
        params,
      });

      window.location.href = link.href;

      this.dialogRef?.hide();
    },
    submit() {
      const selectedItem = this.items[this.selectedItemIndex];

      if (!selectedItem) return;

      this.onItemSelected(selectedItem);
    },
    focusInput(target: { el: HTMLElement }) {
      target.el.focus();
    },
  },
});
</script>

<style scoped>
.keycap {
  background-color: rgba(200, 200, 200, 0.4);
}
</style>
