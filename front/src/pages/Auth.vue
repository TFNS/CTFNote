<template>
  <q-page padding class="row justify-center">
    <div class="col-md-4 col-sm-6 q-mt-lg auth">
      <q-form @submit="submit">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ title }} on CTFNote</div>
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
            <q-toggle
              :title="toggleTitle"
              :disable="!$ctfnote.settings.allowRegistration"
              v-model="register"
              color="positive"
              label="Register"
              v-if="!registerWithToken"
            />
          </q-card-section>

          <q-card-actions class="row justify-end q-pa-md">
            <div class="col col-auto">
              <q-btn type="submit" class="q-px-md" color="primary">
                {{ this.title }}
              </q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import db from "src/gql";
export default {
  props: {
    token: { type: String, default: null }
  },
  data() {
    const hasToken = Boolean(this.token);
    return {
      registerWithToken: hasToken,
      register: hasToken,
      username: "",
      password: ""
    };
  },
  computed: {
    title() {
      return this.register ? "Register" : "Login";
    },
    toggleTitle() {
      if (!this.$ctfnote.settings.allowRegistration) {
        return "Registration are disabled.";
      }
      return null;
    }
  },
  methods: {
    getMutationAndKey() {
      if (this.registerWithToken) {
        return [db.auth.REGISTER_WITH_TOKEN, "registerWithToken"];
      }
      if (this.register) {
        return [db.auth.REGISTER, "register"];
      }
      return [db.auth.LOGIN, "login"];
    },
    async submit() {
      const [mutation, key] = this.getMutationAndKey();
      localStorage.removeItem("JWT");
      this.$apollo
        .mutate({
          mutation,
          variables: {
            login: this.username,
            password: this.password,
            token: this.token
          }
        })
        .then(r => {
          const jwt = r.data[key].jwt;
          localStorage.setItem("JWT", jwt);
          window.location.reload();
        });
    }
  }
};
</script>

<style scoped>
.auth {
  position: relative;
}
.auth::before {
  --size: 40px;
  content: "";
  width: var(--size);
  height: var(--size);
  left: calc(-1 * var(--size) - 8px);
  border-radius: 5px;
  position: absolute;
  background: url("/favicon.svg");
  background-size: var(--size);
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
</style>
