<template>
  <div class="q-gutter-sm">
    <div class="row items-center q-gutter-md q-pa-sm">
      <div class="text-h6 col col-auto">Credentials</div>
      <div>
        <q-btn
          v-if="me.isManager"
          round
          size="sm"
          color="warning"
          icon="edit"
          @click="editCredentials"
        >
          <q-tooltip>Edit the credentials</q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="row">
      <div class="col col-auto">
        <q-markdown no-html :src="ctf.credentials" class="blur" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ctf } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },

  setup() {
    return {
      me: ctfnote.me.injectMe(),
      resolveAndNotify: ctfnote.ui.useNotify().resolveAndNotify,
      updateCtfCredentials: ctfnote.ctfs.useUpdateCtfCredentials(),
    };
  },
  methods: {
    editCredentials() {
      this.$q
        .dialog({
          title: 'Edit credentials',
          color: 'primary',
          prompt: {
            model: this.ctf.credentials ?? '',
            type: 'textarea',
          },
          ok: {
            label: 'save',
            color: 'positive',
          },
          cancel: {
            label: 'Cancel',
            color: 'warning',
            flat: true,
          },
        })
        .onOk((credentials: string) => {
          const opts = {
            message: 'Credentials updated!',
            icon: 'lock',
          };
          void this.resolveAndNotify(
            this.updateCtfCredentials(this.ctf, credentials),
            opts
          );
        });
    },
  },
});
</script>

<style scoped></style>
