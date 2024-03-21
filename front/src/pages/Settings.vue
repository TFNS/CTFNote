<template>
  <q-page>
    <q-tabs
      model-value="Profile"
      indicator-color="secondary"
      dense
      align="left"
    >
      <q-tab name="Profile" label="Profile" icon="person" />
    </q-tabs>

    <div class="q-pa-md">
      <div class="row q-col-gutter-md">
        <div class="col-md-6 col-xs-12">
          <q-card v-if="me" bordered>
            <q-form @submit="changeProfile">
              <q-card-section class="row justify-between">
                <div class="text-h6">Change Profile</div>
                <user-badge class="q-ma-none" :profile="tmpProfile" />
              </q-card-section>

              <q-card-section class="q-pt-none q-pb-sm q-gutter-sm">
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

              <q-card-actions align="right" class="q-px-md q-pb-md">
                <div>
                  <q-btn
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
        <div class="col-md-6 col-xs-12">
          <q-card bordered>
            <q-form @submit="changePassword">
              <q-card-section>
                <div class="text-h6">Change Password</div>
              </q-card-section>

              <q-card-section class="q-pt-none q-pb-sm q-gutter-sm">
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

              <q-card-actions align="right" class="q-px-md q-pb-md">
                <div>
                  <q-btn
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
              <div class="text-h6">Notifications</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-toggle
                :model-value="systemNotificationEnabled"
                label="Use browser notifications"
                left-label
                @click="toggleNotification"
              />
            </q-card-section>
          </q-card>

          <q-card bordered class="q-mt-md">
            <q-card-section>
              <div class="text-h6">Link your Discord account</div>
            </q-card-section>

            <q-card-section class="q-pt-none q-gutter-md">
              <div v-if="me?.profile.discordId == null">
                Your CTFNote account is not linked to your Discord account.
              </div>
              <div v-else>
                Your CTFNote account is linked to Discord user ID
                {{ me?.profile.discordId }}.
              </div>

              <password-input
                v-if="me?.profile.discordId == null"
                v-model="profileToken"
                read-only
                label="Your personal CTFNote token"
                hint="Give this token to the CTFNote bot to link your account by using /link"
                @update:visibility="pollMe"
              />
            </q-card-section>

            <q-card-actions align="right" class="q-px-md q-pb-md q-pt-none">
              <q-btn
                v-if="me?.profile.discordId != null"
                label="Unlink Discord"
                color="negative"
                title="Unlink Discord"
                :loading="resetDiscordLoading"
                @click="unlinkDiscord"
              />
              <q-btn
                v-if="me?.profile.discordId == null"
                color="primary"
                label="Reset token"
                title="Reset token"
                @click="resetToken"
              />
            </q-card-actions>
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
import { Ref, defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: { PasswordInput, ColorPicker, UserBadge },
  setup() {
    const me = ctfnote.me.injectMe();
    const username = ref(me.value?.profile?.username ?? '');
    const description = ref(me.value?.profile?.description ?? '');

    const color = ref(me.value?.profile?.color);
    const profileToken: Ref<string> = ref('');
    const { result: profileTokenResult } = ctfnote.me.getProfileToken();

    watch(
      profileTokenResult,
      (s) => {
        profileToken.value = s;
      },
      { immediate: true }
    );

    watch(
      me,
      (v) => {
        if (!v || !v.profile) return;
        username.value = v.profile.username;
        description.value = v.profile.description;
        color.value = v.profile.color;
      },
      { deep: true }
    );
    const {
      isSystemNotificationEnabled,
      askForNotificationPrivilege,
      disableSystemNotification,
    } = ctfnote.ui.useNotify();

    const systemNotificationEnabled = ref(isSystemNotificationEnabled());

    return {
      resolveAndNotify: ctfnote.ui.useNotify().resolveAndNotify,
      notifySuccess: ctfnote.ui.useNotify().notifySuccess,
      updateProfile: ctfnote.me.useUpdateProfile(),
      updatePassword: ctfnote.me.useUpdatePassword(),
      resetProfileToken: ctfnote.me.useResetProfileToken(),
      resetDiscordId: ctfnote.me.useResetDiscordId(),
      color,
      username,
      description,
      me,
      systemNotificationEnabled,
      askForNotificationPrivilege,
      disableSystemNotification,
      oldPassword: ref(''),
      newPassword: ref(''),
      profileToken,
      resetDiscordLoading: ref(false),
      pollInterval: ref(0),
    };
  },
  computed: {
    tmpProfile(): Profile {
      return { username: this.username, color: this.color } as Profile;
    },
  },
  beforeUnmount() {
    clearInterval(this.pollInterval);
  },
  methods: {
    async toggleNotification() {
      if (!this.systemNotificationEnabled) {
        this.systemNotificationEnabled =
          await this.askForNotificationPrivilege();
      } else {
        this.systemNotificationEnabled = false;
        this.disableSystemNotification();
      }
    },
    changeProfile() {
      const profile = this.me?.profile;
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
    resetToken() {
      void this.resolveAndNotify(
        this.resetProfileToken().then((newToken) => {
          if (!newToken) return;
          this.profileToken = newToken;
        }),
        {
          message: 'Token refreshed!',
          icon: 'refresh',
        }
      );
    },
    unlinkDiscord() {
      this.resetDiscordLoading = true;
      void this.resolveAndNotify(
        this.resetDiscordId().then(() => {
          this.resetDiscordLoading = false;
        }),
        {
          message: 'Discord unlinked!',
          icon: 'close',
        }
      );
    },
    pollMe(visibility: boolean) {
      // if the profile token is set to visible, the user is probably going to copy it
      // and thus we should poll the profile until the Discord profile is linked
      if (visibility) {
        this.pollInterval = window.setInterval(() => {
          if (this.me?.profile.discordId != null) {
            clearInterval(this.pollInterval);
          } else {
            const { result: me } = ctfnote.me.getMe(true);
            if (me.value == null) return;
            this.me = me.value;
          }
        }, 1000);
      } else {
        clearInterval(this.pollInterval);
      }
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
