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
                    (val) => (val && val.length > 0) || 'Please type something',
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
                  @click="changeProfile"
                />
              </div>
            </q-card-actions>
          </q-card>
        </div>
        <div class="col">
          <q-card bordered>
            <q-card-section>
              <div class="text-h6">Change Password</div>
            </q-card-section>
            <q-separator class="q-mx-xl" />
            <q-card-section class="q-gutter-sm">
              <password-input
                v-model="oldPassword"
                label="Old Password"
                hint="The password you currently use"
              />
              <password-input
                v-model="newPassword"
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
                  @click="changePassword"
                />
              </div>
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
import { MeKey, Profile } from 'src/ctfnote';
import { updatePassword, updateProfile } from 'src/ctfnote/me';
import { injectStrict } from 'src/ctfnote/utils';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: { PasswordInput, ColorPicker, UserBadge },
  setup() {
    const me = injectStrict(MeKey);

    const username = ref(me.value.profile?.username ?? '');
    const description = ref(me.value.profile?.description ?? '');

    const color = ref(
      me.value.profile?.color 
    );

    watch(
      me,
      (v) => {
        if (!v.profile?.username) return;
        username.value = v.profile?.username;
        description.value = v.profile?.description;
        color.value = v.profile?.color ;
      },
      { deep: true }
    );

    return {
      color,
      username,
      description,
      me,
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
    changeProfile() {
      if (!this.me.profile) return;
      void updateProfile(this.me.profile, {
        color: this.color,
        description: this.description,
        username: this.username,
      });
    },
    changePassword() {
      void updatePassword(this.oldPassword, this.newPassword).then(() => {
        this.oldPassword = '';
        this.newPassword = '';
      });
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
