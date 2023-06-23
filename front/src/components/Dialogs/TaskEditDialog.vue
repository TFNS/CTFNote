<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="ctfnote-dialog">
      <q-form @submit="submit">
        <q-card-section class="row">
          <div class="text-h6">
            {{ title }}
          </div>
          <q-space />
          <q-btn v-close-popup icon="close" flat round dense />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input v-model="form.title" required label="Title" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select
            v-model="form.tags"
            label="Tags"
            :options="suggestions"
            input-debounce="0"
            use-input
            use-chips
            multiple
            new-value-mode="add-unique"
            @filter="filterFn"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            v-model="form.description"
            label="Description"
            type="textarea"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input v-model="form.flag" label="Flag" />
        </q-card-section>
        <q-card-actions class="q-gutter-md q-pr-md q-pb-md" align="right">
          <q-btn v-close-popup flat color="warning" label="Cancel" />
          <q-btn color="positive" type="submit" :label="editText" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Id, Task, Ctf } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { Ref, defineComponent, reactive, ref } from 'vue';
import { makeId } from 'src/ctfnote/models';

export default defineComponent({
  props: {
    ctfId: { type: Number as unknown as () => Id<Ctf> | null, default: null },
    task: { type: Object as () => Task | null, default: null },
  },
  emits: useDialogPluginComponent.emits,
  setup(props) {
    const form = reactive({
      title: props.task?.title ?? '',
      tags: props.task?.assignedTags.map((t) => t.tag) ?? [],
      description: props.task?.description ?? '',
      flag: props.task?.flag ?? '',
    });

    const tags = ctfnote.tags.provideTags();
    let suggestions: Ref<string[]> = ref(tags.value.map((t) => t.tag));

    const filterFn = function (
      val: string,
      doneFn: (callBackFn: () => void, afterFn: () => void) => void,
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      _abortFn: () => void
    ) {
      doneFn(
        () => {
          const needle = val.toLocaleLowerCase();
          suggestions.value = tags.value
            .map((t) => t.tag)
            .filter((v) => v.toLocaleLowerCase().indexOf(needle) > -1);
        },
        () => void 0
      );
    };

    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

    return {
      dialogRef,
      form,
      onDialogHide,
      onDialogOK,
      updateTask: ctfnote.tasks.useUpdateTask(),
      createTask: ctfnote.tasks.useCreateTask(),
      addTagsForTask: ctfnote.tags.useAddTagsForTask(),
      tags,
      suggestions,
      filterFn,
    };
  },
  computed: {
    editText() {
      return this.task ? 'Edit' : 'Create';
    },
    title() {
      return this.task ? `Edit ${this.task.title}` : 'Create Task';
    },
  },
  methods: {
    async submit() {
      let task = null;
      if (this.ctfId) {
        const r = await this.createTask(this.ctfId, this.form);

        task = r?.data?.createTask?.task;
        if (task) {
          await this.addTagsForTask(this.form.tags, makeId(task.id));
        }
      } else if (this.task) {
        await this.addTagsForTask(this.form.tags, makeId(this.task.id));
        await this.updateTask(this.task, this.form);
      }

      this.onDialogOK();
    },
  },
});
</script>

<style scoped>
.q-dialog-plugin {
  width: 800px;
  max-width: 90vw !important;
}
</style>
