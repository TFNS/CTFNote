<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 80%">
      <q-card-section class="text-h6"> Search for CTF/Task </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input
          v-model="searchText"
          filled
          label="What are you searching for?"
          hint="Search for tag or title of CTF or task"
          autofocus
          :loading="loading"
          @update:model-value="onSearchChange"
          @keypress.enter="submit"
        />
      </q-card-section>

      <q-card-section v-if="!!items.length">
        <q-list bordered separator>
          <q-item
            v-for="(item, i) in items"
            :key="item.nodeId"
            :focused="i === selectedItemIndex"
            clickable
            class="col"
            @click="onItemSelected(item)"
          >
            <q-item-section class="col-3">
              <span>
                {{ !!item.ctf ? item.ctf.title + ' / ' : '' }}
                <b>{{ item.title }}</b>
              </span>
            </q-item-section>
            <q-item-section side class="col-8">
              <task-tags-list
                v-if="item.assignedTags"
                :tags="item.assignedTags"
              ></task-tags-list>
            </q-item-section>
            <q-item-section side top class="col-1">
              <q-badge color="teal" :label="item.__typename" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <span>This search bar can also be opened by using CTRL+K</span>
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
import TaskTagsList from '../Task/TaskTagsList.vue';

export default defineComponent({
  components: {
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

    onUnmounted(() => {
      hotkeys.unbind(previousShortcut);
      hotkeys.unbind(nextShortcut);
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
  },
});
</script>

<style scoped></style>
