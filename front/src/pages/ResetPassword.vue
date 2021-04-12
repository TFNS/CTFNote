<template>
  <q-page padding class="row justify-center">
    <div class="col-md-4 col-sm-6 q-mt-lg">
      <q-form @submit="resetPassword">
        <q-card>
          <q-card-section>
            <div class="text-h6">Reset password</div>
          </q-card-section>
          <q-card-section>
            <q-input filled v-model="password" label="New Password" lazy-rules :rules="requiredRule" />
          </q-card-section>

          <q-separator />
          <q-card-actions class="row">
            <q-space />
            <q-btn type="submit" class="q-px-md" color="primary">Reset</q-btn>
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>


<script>
import db from "src/gql";
export default {
  props: { token: String },
  data() {
    return {
      password: "",
    };
  },
  computed: {
    requiredRule() {
      return [(val) => (val && val.length > 0) || "Please type something"];
    },
    requiredAndEqualRule() {
      return [
        (val) => (val && val.length > 0) || "Please type something",
        (val) => val === this.password1 || "Passwords must be equal",
      ];
    },
  },
  methods: {
    async resetPassword() {
      // TODO: Actually send a graphql mutation to reset the password

      console.log(this.password, this.token);

      const response = await this.$apollo.mutate({
        mutation: db.auth.RESET_PASSWORD,
        variables: { password: this.password, token: this.token },
      });

      const { jwt } = response.data.resetPassword;

      if (!jwt) {
        return this.$q.notify({ message: "Invalid token", type: "negative", position: "top" });
      }

      localStorage.setItem("JWT", jwt);

      document.location.reload();
    },
  },
};
</script>

<style>
</style>