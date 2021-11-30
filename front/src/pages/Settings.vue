<template>
  <q-page>
    <q-tabs
      model-value="Profile"
      class="bg-light"
      indicator-color="primary"
      dense
      align="left"
    >
      <q-tab name="Profile" label="Profile" icon="person" />
    </q-tabs>

    <div class="q-pa-md">
      <div class="row q-gutter-md">
        <div class="col">
          <q-card v-if="me" bordered>
            <q-form @submit="changeProfile">
              <q-card-section class="row justify-between">
                <div class="text-h6">Change Profile</div>
                <user-badge :profile="tmpProfile" />
              </q-card-section>

              <q-separator class="q-mx-xl" />

              <q-card-section class="q-gutter-lg">
                <div class="col">
                  <q-input
                    v-model="username"
                    filled
                    label="Username"
                    hint="Displayed name"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please type something',
                    ]"
                    @keyup.enter="changeProfile"
                  >
                  </q-input>
                </div>
                <div class="col">
                  <color-picker v-model="color" label="color" />
                </div>
                <div class="col">
                  <q-input
                    v-model="description"
                    type="textarea"
                    filled
                    label="Description"
                  >
                  </q-input>
                </div>
              </q-card-section>
              <q-card-actions align="right" class="q-pa-md">
                <div>
                  <q-btn
                    icon="save"
                    label="save"
                    color="positive"
                    title="Change username"
                    type="submit"
                  />
                </div>
              </q-card-actions>
            </q-form>
          </q-card>
        </div>
        <div class="col">
          <q-card bordered>
            <q-form @submit="changePassword">
              <q-card-section>
                <div class="text-h6">Change Password</div>
              </q-card-section>
              <q-separator class="q-mx-xl" />
              <q-card-section class="q-gutter-sm">
                <password-input
                  v-model="oldPassword"
                  required
                  autocomplete="current-password"
                  label="Old Password"
                  hint="The password you currently use"
                />
                <password-input
                  v-model="newPassword"
                  required
                  autocomplete="new-password"
                  label="New Password"
                  hint="The new password you want to use"
                  @keyup.enter="changePassword"
                />
              </q-card-section>
              <q-card-actions align="right" class="q-pa-md">
                <div>
                  <q-btn
                    icon="save"
                    label="save"
                    color="positive"
                    title="Change username"
                    type="submit"
                  />
                </div>
              </q-card-actions>
            </q-form>
          </q-card>
          <q-card bordered class="q-mt-md">
            <q-card-section>
              <div class="text-h6">Notification</div>
            </q-card-section>
            <q-card-section>
              <q-toggle
                :model-value="systemNotificationEnabled"
                label="Use system notification"
                @click="toggleNotification"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import UserBadge from 'src/components/Profile/UserBadge.vue';
import ColorPicker from 'src/components/Utils/ColorPicker.vue';
import PasswordInput from 'src/components/Utils/PasswordInput.vue';
import { Profile } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: { PasswordInput, ColorPicker, UserBadge },
  setup() {
    const me = ctfnote.me.injectMe();

    const username = ref(me.value.profile?.username ?? '');
    const description = ref(me.value.profile?.description ?? '');

    const color = ref(me.value.profile?.color);

    watch(
      me,
      (v) => {
        if (!v.profile) return;
        username.value = v.profile.username;
        description.value = v.profile.description;
        color.value = v.profile.color;
      },
      { deep: true }
    );
    const { isSystemNotificationEnabled, askForNotificationPrivilege } =
      ctfnote.ui.useNotify();

    const systemNotificationEnabled = ref(isSystemNotificationEnabled());

    return {
      resolveAndNotify: ctfnote.ui.useNotify().resolveAndNotify,
      updateProfile: ctfnote.me.useUpdateProfile(),
      updatePassword: ctfnote.me.useUpdatePassword(),
      color,
      username,
      description,
      me,
      systemNotificationEnabled,
      askForNotificationPrivilege,
      oldPassword: ref(''),
      newPassword: ref(''),
    };
  },
  computed: {
    tmpProfile(): Profile {
      return { username: this.username, color: this.color } as Profile;
    },
  },
  methods: {
    async toggleNotification() {
      if (!this.systemNotificationEnabled) {
        this.systemNotificationEnabled =
          await this.askForNotificationPrivilege();
      } else {
        this.systemNotificationEnabled = false;
      }
    },
    changeProfile() {
      const profile = this.me.profile;
      if (!profile) return;

      void this.resolveAndNotify(
        this.updateProfile(profile, {
          color: this.color,
          description: this.description,
          username: this.username,
        }),
        { message: 'Profile changed!', icon: 'person' }
      );
    },
    changePassword() {
      void this.resolveAndNotify(
        this.updatePassword(this.oldPassword, this.newPassword).then(() => {
          this.oldPassword = '';
          this.newPassword = '';
        }),
        { message: 'Password changed!', icon: 'lock' }
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.q-tab {
  min-width: 200px;
  padding-top: 5px;
}
</style>
