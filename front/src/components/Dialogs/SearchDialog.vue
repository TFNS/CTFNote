<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 400px">
      <q-card-section class="text-h6"> Search for CTF/Task </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input
          v-model="searchText"
          filled
          label="What are you searching for ?"
          hint="search for title or description"
          autofocus
          :loading="loading"
          @update:model-value="onSearchChange"
          @keypress.enter="submit"
          @keydown="searchInputKeyDown"
        />
      </q-card-section>

      <q-card-section>
        <q-list bordered separator>
          <q-item
            v-for="(item, i) in items"
            :key="item.id"
            :focused="i === selectedItemIndex"
            clickable
            @click="onItemSelected(item)"
          >
            <q-item-section>
              {{ !!item.ctf ? item.ctf.title + '/' : '' }}
              <b>{{ item.title }}</b></q-item-section
            >

            <q-item-section side top>
              <q-badge color="teal" :label="item.__typename" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right" class="q-gutter-md q-px-md q-pb-sm">
        <q-btn color="warning" flat label="cancel" @click="onDialogCancel" />
        <q-btn color="positive" label="import" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import ctfnote from 'src/ctfnote';
import { safeSlugify } from 'src/ctfnote/ctfs';
import { Ctf, Task } from 'src/ctfnote/models';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  emits: useDialogPluginComponent.emits,
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const items: Array<Ctf | Task> = [];

    return {
      dialogRef,
      loading: false,
      searchText: ref(''),
      selectedItemIndex: ref(0),
      items: ref(items),
      onDialogHide,
      onDialogOK,
      onDialogCancel,
    };
  },
  methods: {
    searchInputKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        this.selectedItemIndex += 1;
      }

      if (e.key === 'ArrowUp') {
        this.selectedItemIndex += -1;
      }

      if (this.selectedItemIndex >= this.items.length)
        this.selectedItemIndex = 0;

      if (this.selectedItemIndex < 0)
        this.selectedItemIndex = this.items.length - 1;
    },
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
