<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin ctfnote-dialog">
      <q-card-section>
        <div class="row q-gutter-md">
          <div class="text-h6">Create a new invitation link</div>
          <q-space />
          <q-btn v-close-popup icon="close" flat round dense />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="role" class="full-width">
            <select-role v-model="role" label="Role" />
          </q-tab-panel>
          <q-tab-panel name="link" class="full-width">
            <copy-link v-if="link" :link="link" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions class="q-pr-md q-pb-md" align="right">
        <template v-if="tab == 'role'">
          <q-btn v-close-popup flat color="warning" label="Cancel" />
          <q-btn color="positive" label="Create" @click="createLink" />
        </template>
        <q-btn v-else v-close-popup color="positive" label="Close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Role } from 'src/ctfnote';
import {
  useCreateInvitationToken
} from 'src/ctfnote/admin';
import { defineComponent, ref } from 'vue';
import CopyLink from '../Utils/CopyLink.vue';
import SelectRole from '../Utils/SelectRole.vue';
export default defineComponent({
  components: { SelectRole, CopyLink },
  emits: useDialogPluginComponent.emits,
  setup() {
    const { dialogRef, onDialogHide, onDialogCancel } =
      useDialogPluginComponent();

    return {
      createInvitationToken: useCreateInvitationToken(),
      tab: ref<'role' | 'link'>('role'),
      link: ref<string | null>(null),
      role: ref<Role>('USER_GUEST' as Role),
      dialogRef,
      onDialogHide,
      onCancelClick: onDialogCancel,
    };
  },

  methods: {
    async createLink() {
      const token = await this.createInvitationToken(this.role);

      const path = this.$router.resolve({
        name: 'auth-register-token',
        params: { token },
      });
      this.link = `${location.origin}/${path.href}`;
      this.tab = 'link';
    },
  },
});
</script>

<style scoped></style>
