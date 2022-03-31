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
          hint="Search for title or description"
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
            :key="item.id"
            :focused="i === selectedItemIndex"
            clickable
            @click="onItemSelected(item)"
          >
            <q-item-section>
              <span>
                {{ !!item.ctf ? item.ctf.title + ' / ' : '' }}
                <b>{{ item.title }}</b>
              </span>
            </q-item-section>

            <q-item-section side top>
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
import { defineComponent, onMounted, Ref, ref } from 'vue';

export default defineComponent({
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
    const nextShortcut = 'command+p, ctrl+p, up';

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
      if (!this.searchText) {
        this.items = [];
        return;
      }

      const ctfs = await ctfnote.search.searchCtfs(this.searchText);
      const tasks = await ctfnote.search.searchTasks(this.searchText);

      this.items = [...ctfs, ...tasks];
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
    },
    submit() {
      const selectedItem = this.items[this.selectedItemIndex];
      this.onItemSelected(selectedItem);
    },
  },
});
</script>

<style scoped></style>
