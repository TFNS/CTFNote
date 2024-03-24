<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss @hide="onDialogHide">
    <q-card class="ctfnote-dialog">
      <q-form @submit="submit">
        <q-card-section class="row items-center no-wrap">
          <div class="text-h6 ellipsis">
            {{ title }}
          </div>
          <q-space />
          <q-btn v-close-popup icon="close" flat round dense />
        </q-card-section>

        <q-card-section class="q-pt-none q-pb-sm q-gutter-sm">
          <q-input v-model="form.title" filled dense required label="Title">
            <template #prepend>
              <q-icon name="title" />
            </template>
          </q-input>

          <q-select
            v-model="form.tags"
            filled
            dense
            options-dense
            label="Tags"
            :options="suggestions"
            input-debounce="0"
            use-input
            use-chips
            multiple
            new-value-mode="add-unique"
            behavior="menu"
            @filter="filterFn"
          >
            <template #prepend>
              <q-icon name="label" />
            </template>
          </q-select>

          <q-input
            v-model="form.description"
            filled
            dense
            label="Description"
            type="textarea"
          />

          <q-input v-model="form.flag" filled dense label="Flag">
            <template #prepend>
              <q-icon name="flag" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn v-close-popup flat color="primary" label="Cancel" />
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
import { TaskPatch } from 'src/generated/graphql';

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
      notifySuccess: ctfnote.ui.useNotify().notifySuccess,
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

      this.onDialogOK();
      if (this.ctfId) {
        this.notifySuccess({
          message: `Task ${this.form.title} is being created...`,
        });
        const r = await this.createTask(this.ctfId, this.form);

        task = r?.data?.createTask?.task;
        if (task) {
          await this.addTagsForTask(this.form.tags, makeId(task.id));
        }
      } else if (this.task) {
        this.notifySuccess({
          message: `Task ${this.form.title} is being updated...`,
        });
        await this.addTagsForTask(this.form.tags, makeId(this.task.id));

        const patch: TaskPatch = {};
        if (this.form.title !== this.task.title) {
          patch.title = this.form.title;
        }
        if (this.form.description !== this.task.description) {
          patch.description = this.form.description;
        }
        if (this.form.flag !== this.task.flag) {
          patch.flag = this.form.flag;
        }
        await this.updateTask(this.task, patch);
      }
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
