<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h4">User settings</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <div class="text-h5">Change Username</div>
        <q-input
          filled
          v-model="username"
          label="Username"
          hint="Display Name"
          lazy-rules
          @keyup.enter="changeUsername"
          :value="$ctfnote.me.username"
          :rules="[val => (val && val.length > 0) || 'Please type something']"
        >
          <template #after>
            <q-btn round icon="save" color="positive" title="Change username" @click="changeUsername"> </q-btn>
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <div class="text-h5">Change Password</div>
        <q-input
          filled
          v-model="oldPassword"
          type="password"
          label="Current Password"
          hint="The password you currently use"
          :rules="[val => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          filled
          v-model="newPassword"
          @keyup.enter="changePassword"
          type="password"
          label="New Password"
          hint="The new password you want to use"
          :rules="[val => (val && val.length > 0) || 'Please type something']"
        >
          <template #after>
            <q-btn round icon="save" color="positive" title="Change password" @click="changePassword"> </q-btn>
          </template>
        </q-input>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import db from "src/gql";

export default {
  name: "UserSettings",
  data() {
    return {
      username: this.$ctfnote.me.username,
      oldPassword: "",
      newPassword: ""
    };
  },
  methods: {
    changeUsername() {
      this.$apollo
        .mutate({
          mutation: db.user.CHANGE_USERNAME,
          variables: { id: this.$ctfnote.me.id, newUsername: this.username }
        })
        .then(response => {
          this.$ctfnote.me.username = response.data.updateProfile.profile.username;
          this.$q.notify({ type: "positive", message: "Username changed" });
        });
    },
    changePassword() {
      const { oldPassword, newPassword } = this;

      this.$apollo
        .mutate({
          mutation: db.user.CHANGE_PASSWORD,
          variables: { oldPassword, newPassword }
        })
        .then(response => {
          if (response.data.changePassword) {
            this.$q.notify({ type: "positive", message: "Password changed" });
          }
        });
    }
  }
};
</script>
