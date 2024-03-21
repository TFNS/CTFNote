<template>
  <div class="row q-col-gutter-md">
    <div class="col-md-6 col-xs-12">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Registration</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div>
            <q-toggle
              v-model="registrationAllowed"
              left-label
              label="Allow registration on CTFNote"
            />
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">Registration with password</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-sm">
          <q-toggle
            v-model="registrationPasswordAllowed"
            left-label
            label="Allow registration with password on CTFNote"
          />

          <select-role
            v-if="registrationPasswordAllowed"
            v-model="registrationDefaultRole"
            filled
            dense
            options-dense
            :disable="!registrationPasswordAllowed"
            label="Default role"
          >
            <template #prepend>
              <q-icon name="people_alt" />
            </template>
          </select-role>

          <password-input
            v-if="registrationPasswordAllowed"
            v-model="registrationPassword"
            dense
            :disable="!registrationPasswordAllowed"
            label="Registration password"
          >
            <template #prepend>
              <q-icon name="key" />
            </template>
            <template #after>
              <q-btn
                icon="save"
                class="ctfnote-input-button"
                color="positive"
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

    <div class="col-md-6 col-xs-12">
      <q-card>
        <q-card-section>
          <div class="text-h6">Calendar password</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-sm">
          <q-toggle
            v-model="icalPasswordRequired"
            left-label
            label="Require password to access iCalendar"
          />

          <password-input
            v-if="icalPasswordRequired"
            v-model="icalPassword"
            dense
            :disable="!icalPasswordRequired"
          >
            <template #prepend>
              <q-icon name="key" />
            </template>
            <template #after>
              <q-btn
                icon="save"
                class="ctfnote-input-button"
                color="positive"
                :disabled="icalPassword == adminSettings.icalPassword"
                @click="updateIcalPassword"
              />
            </template>
          </password-input>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Role } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent, ref, watch } from 'vue';
import PasswordInput from '../Utils/PasswordInput.vue';
import SelectRole from '../Utils/SelectRole.vue';

export default defineComponent({
  components: { PasswordInput, SelectRole },
  setup() {
    const { result: adminSettings } = ctfnote.settings.getAdminSettings();

    const registrationPassword = ref('');
    const icalPassword = ref('');

    watch(
      adminSettings,
      (s) => {
        registrationPassword.value = s.registrationPassword;
        icalPassword.value = s.icalPassword;
      },
      { immediate: true }
    );

    return {
      resolveAndNotify: ctfnote.ui.useNotify().resolveAndNotify,
      updateSettings: ctfnote.settings.useUpdateSettings(),
      adminSettings,
      registrationPassword,
      icalPassword,
    };
  },
  computed: {
    registrationAllowed: {
      get(): boolean {
        return this.adminSettings.registrationAllowed ?? true;
      },
      set(registrationAllowed: boolean) {
        const opts = {
          message: registrationAllowed
            ? 'Registration enabled'
            : 'Registration disabled',
          icon: 'lock',
        };

        void this.resolveAndNotify(
          this.updateSettings({ registrationAllowed }),
          opts
        );
      },
    },
    registrationPasswordAllowed: {
      get(): boolean {
        return this.adminSettings.registrationPasswordAllowed ?? true;
      },
      set(registrationPasswordAllowed: boolean) {
        const opts = {
          message: registrationPasswordAllowed
            ? 'Registration with password enabled!'
            : 'Registration with password disabled!',
          icon: 'lock',
        };

        void this.resolveAndNotify(
          this.updateSettings({ registrationPasswordAllowed }),
          opts
        );
      },
    },
    registrationDefaultRole: {
      get(): Role {
        return this.adminSettings.registrationDefaultRole ?? Role.UserGuest;
      },
      set(registrationDefaultRole: Role) {
        const roleName = registrationDefaultRole.slice(5).toLowerCase();
        const opts = {
          message: `Default role set to ${roleName}!`,
          icon: 'lock',
        };

        void this.resolveAndNotify(
          this.updateSettings({ registrationDefaultRole }),
          opts
        );
      },
    },
    icalPasswordRequired: {
      get(): boolean {
        return this.icalPassword != '';
      },
      set(icalPasswordRequired: boolean) {
        if (icalPasswordRequired) {
          var buf = new Uint8Array(16);
          window.crypto.getRandomValues(buf);
          this.icalPassword = Array.prototype.map
            .call(buf, (x: number) => x.toString(16).padStart(2, '0'))
            .join('');
        } else {
          this.icalPassword = '';
        }
      },
    },
  },
  watch: {},
  methods: {
    updateRegistrationPassword() {
      const opts = {
        message: 'Registration password changed!',
        icon: 'lock',
      };

      void this.resolveAndNotify(
        this.updateSettings({
          registrationPassword: this.registrationPassword,
        }),
        opts
      );
    },
    updateIcalPassword() {
      const opts = {
        message: 'Calendar password changed!',
        icon: 'today',
      };

      void this.resolveAndNotify(
        this.updateSettings({
          icalPassword: this.icalPassword,
        }),
        opts
      );
    },
  },
});
</script>

<style scoped></style>
