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
              :rules="[(val) => (val && val.length > 0) || 'Please type something']"
            />
            <q-input
              filled
              type="password"
              v-model="password"
              label="Password"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please type something']"
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
import db from "src/gql";
export default {
  data() {
    return {
      register: false,
      username: "",
      password: "",
    };
  },
  computed: {
    title() {
      return this.register ? "Register" : "Login";
    },
  },
  methods: {

    async submit() {
      const mutation = this.register ? db.auth.REGISTER : db.auth.LOGIN;
      const key = this.register ? "register": "login"
      console.log(mutation);
      localStorage.removeItem("JWT");
      this.$apollo
        .mutate({
          mutation,
          variables: {
            login: this.username,
            password: this.password,
          },
        })
        .then((r) => {
          const jwt = r.data[key].jwt
          if (jwt) {
            localStorage.setItem("JWT", jwt);
            window.location.reload();
          } else {
            this.$q.notify({ message: "Invalid username or password", type: "negative" });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({ message: "Username already taken", type: "negative" });
        });
    },
  },
};
</script>
