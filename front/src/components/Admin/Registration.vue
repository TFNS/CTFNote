<template>
  <div class="row q-gutter-md">
    <div class="col">
      <q-card bordered>
        <q-card-section>
          <div class="text-h6">Registration</div>
        </q-card-section>
        <q-card-section>
          <div>
            <q-toggle
              v-model="registrationAllowed"
              left-label
              label="Allow registration on CTFNote"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col">
      <q-card bordered>
        <q-card-section>
          <div class="text-h6">Registration with password</div>
        </q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-toggle
            v-model="registrationPasswordAllowed"
            left-label
            label="Allow registration with password on CTFNote"
          />
          <select-role
            v-model="registrationDefaultRole"
            :disable="!registrationPasswordAllowed"
            label="Default role"
          />
          <password-input
            v-model="registrationPassword"
            :disable="!registrationPasswordAllowed"
            :filled="false"
            label="Registration password"
          >
            <template #after>
              <q-btn
                icon="save"
                round
                :color="
                  registrationPassword == adminSettings.registrationPassword
                    ? 'grey-5'
                    : 'positive'
                "
                :disabled="
                  registrationPassword == adminSettings.registrationPassword
                "
                @click="updateRegistrationPassword"
              />
            </template>
          </password-input>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Role } from 'src/ctfnote';
import { getAdminSettings, updateSettings } from 'src/ctfnote/settings';
import { defineComponent, ref, watch } from 'vue';
import PasswordInput from '../Utils/PasswordInput.vue';
import SelectRole from '../Utils/SelectRole.vue';

export default defineComponent({
  components: { PasswordInput, SelectRole },
  setup() {
    const { result: adminSettings } = getAdminSettings();

    const registrationPassword = ref('');

    watch(
      adminSettings,
      (s) => {
        registrationPassword.value = s.registrationPassword ?? '';
      },
      { immediate: true }
    );

    return {
      adminSettings,
      registrationPassword,
    };
  },
  computed: {
    registrationAllowed: {
      get(): boolean {
        return this.adminSettings.registrationAllowed ?? true;
      },
      set(registrationAllowed: boolean) {
        void updateSettings({ registrationAllowed });
      },
    },
    registrationPasswordAllowed: {
      get(): boolean {
        return this.adminSettings.registrationPasswordAllowed ?? true;
      },
      set(registrationPasswordAllowed: boolean) {
        void updateSettings({ registrationPasswordAllowed });
      },
    },
    registrationDefaultRole: {
      get(): Role {
        return this.adminSettings.registrationDefaultRole ?? Role.UserGuest;
      },
      set(registrationDefaultRole: Role) {
        void updateSettings({ registrationDefaultRole });
      },
    },
  },
  watch: {},
  methods: {
    updateRegistrationPassword() {
      void updateSettings({
        registrationPassword: this.registrationPassword,
      });
    },
  },
});
</script>

<style scoped></style>
