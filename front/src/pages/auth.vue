<template>
  <q-page padding class="row justify-center">
    <div class="col-md-4 col-sm-6 q-mt-lg">
      <q-form @submit="submit">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ title }}</div>
          </q-card-section>
          <q-card-section>
            <q-input
              filled
              v-model="username"
              label="Username"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Please type something']"
            />
            <q-input
              filled
              type="password"
              v-model="password"
              label="Password"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Please type something']"
            />

            <q-toggle v-model="register" color="positive" label="Register" />
          </q-card-section>

          <q-separator />
          <q-card-actions class="row">
            <q-space />
            <q-btn type="submit" class="q-px-md" color="primary">{{ this.title }}</q-btn>
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { showErrors } from "../utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      register: false,
      username: "",
      password: ""
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
    title() {
      return this.register ? "Register" : "Login";
    }
  },
  methods: {
    async submit() {
      let errors;
      if (this.register) {
        errors = await this.$store.dispatch("register", [this.username, this.password]);
      } else {
        errors = await this.$store.dispatch("login", [this.username, this.password]);
      }

      if (errors) {
        showErrors(this, errors);
      } else {
        this.$router.push({ name: "ctfs" });
      }
    }
  },
  mounted() {
    if (this.currentUser) {
      this.$router.push({ name: "ctfs" });
    }
  }
};
</script>
