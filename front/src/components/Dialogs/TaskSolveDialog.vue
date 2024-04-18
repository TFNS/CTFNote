<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="dialog-solve-task">
      <q-form @submit="submit">
        <q-card-section class="row items-center no-wrap">
          <div class="text-h6 ellipsis">Submit flag for {{ task.title }}</div>
          <q-space />
          <ShortcutHint v-if="$route.name === 'task'" :keys="['ctrl', 's']" />
        </q-card-section>

        <q-card-section class="q-pt-none q-pb-sm q-gutter-sm">
          <q-input
            v-model="form.flag"
            filled
            dense
            label="Flag"
            @vue:mounted="focusInput"
          >
            <template #prepend>
              <q-icon name="flag" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn v-close-popup flat color="primary" label="Cancel" />
          <q-btn
            color="positive"
            type="submit"
            label="Save"
            style="width: 64px"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Task } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent, reactive } from 'vue';
import { TaskPatch } from 'src/generated/graphql';
import ShortcutHint from '../Utils/ShortcutHint.vue';

export default defineComponent({
  components: {
    ShortcutHint,
  },
  props: {
    task: { type: Object as () => Task, required: true },
  },
  emits: useDialogPluginComponent.emits,
  setup(props) {
    const form = reactive({
      flag: props.task?.flag ?? '',
    });

    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

    return {
      dialogRef,
      form,
      onDialogHide,
      onDialogOK,
      updateTask: ctfnote.tasks.useUpdateTask(),
      notifySuccess: ctfnote.ui.useNotify().notifySuccess,
    };
  },
  methods: {
    async submit() {
      this.onDialogOK();

      const patch: TaskPatch = {};
      if (this.form.flag !== this.task.flag) {
        patch.flag = this.form.flag;
      }
      await this.updateTask(this.task, patch);
    },
    focusInput(target: { el: HTMLElement }) {
      target.el.focus();
    },
  },
});
</script>

<style scoped>
.dialog-solve-task {
  width: 400px;
}
</style>
