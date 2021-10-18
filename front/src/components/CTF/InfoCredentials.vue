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
import { Ctf } from 'src/ctfnote';
import { useUpdateCtfCredentials } from 'src/ctfnote/ctfs';
import { getMe } from 'src/ctfnote/me';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },

  setup() {
    const { result: me } = getMe();

    return { me, updateCtfCredentials: useUpdateCtfCredentials() };
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
          cancel: true,
        })
        .onOk((credentials: string) => {
          void this.updateCtfCredentials(this.ctf, credentials);
        });
    },
  },
});
</script>

<style scoped></style>
