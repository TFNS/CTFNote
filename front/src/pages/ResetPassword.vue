<template>
  <q-page padding class="row justify-center">
    <div class="col-md-4 col-sm-6 q-mt-lg">
      <q-form @submit="resetPassword">
        <q-card>
          <q-card-section>
            <div class="text-h6">Reset password</div>
          </q-card-section>
          <q-card-section>
            <q-input filled v-model="password1" label="New Password" lazy-rules :rules="requiredRule" />
            <q-input
              filled
              type="password"
              v-model="password2"
              label="Repeat New Password"
              lazy-rules
              :rules="requiredAndEqualRule"
            />
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
export default {
  props: { token: String },
  data() {
    return {
      password1: "",
      password2: "",
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
    resetPassword() {
      // TODO: Actually send a graphql mutation to reset the password

      console.log(this.password1, this.password2, this.token);
    },
  },
};
</script>

<style>
</style>