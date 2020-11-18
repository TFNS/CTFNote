<template>
  <div class="q-gutter-md">
    <div class="row">
      <div class="col-grow col-md-auto">
        <q-select
          v-model="selectedUser"
          filled
          use-input
          input-debounce="0"
          label="Invite a player"
          @filter="filterUsers"
          :options="usersOptions"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
          <template v-slot:after>
            <q-btn
              :disabled="!selectedUser"
              round
              icon="add"
              color="positive"
              @click="addPlayer"
            />
          </template>
        </q-select>
      </div>
    </div>
    <div class="row">
      <div class="q-gutter-md">
        <q-chip
          :removable="player.slug != currentUser.slug"
          :key="player.slug"
          class="text-white q-pa-md"
          size="bg"
          :style="{ backgroundColor: colorHash(player.slug) }"
          :label="player.username"
          @remove="removePlayer(player)"
          v-for="player in players"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {Rights} from '../enums';
import { colorHash, showErrors } from "../utils";
export default {
  props: {
    ctf: Object,
  },
  computed: {
    ...mapGetters(["users", "currentUser"]),
    players() {
      return this.ctf.guests.map((u) => ({
        username: u.username,
        slug: u.slug,
      }));
    },
  },
  data() {
    const users = this.$store.getters.users;
    const allUsersOptions = users.map((user) => {
      if (user.rights.includes(Rights.CTF_ALL) || user.rights.includes(Rights.ADMIN_ALL)){
        return null
      }
      const disable = this.ctf.guests.find((u) => u.slug == user.slug);
      return {
        label: user.username,
        value: user.slug,
        disable: Boolean(disable),
      };
    }).filter(u => u != null);
    return {
      allUsersOptions,
      usersOptions: [...allUsersOptions],
      selectedUser: "",
    };
  },
  methods: {
    async addPlayer() {
      if (!this.selectedUser) return;
      const user = {
        username: this.selectedUser.label,
        slug: this.selectedUser.value,
      };
      const errors = await this.$store.dispatch("updateCtfPlayer", [
        this.selectedUser.value,
        true,
      ]);
      showErrors(this, errors);
      this.selectedUser.disable = true;
      this.selectedUser = null;
    },
    async removePlayer(player) {
      this.allUsersOptions.find((u) => u.value == player.slug).disable = false;
      const errors = await this.$store.dispatch("updateCtfPlayer", [
        player.slug,
        false,
      ]);
      showErrors(this, errors);
    },
    colorHash(s) {
      return colorHash(s);
    },
    filterUsers(val, update) {
      if (val === "") {
        update(() => {
          this.usersOptions = this.allUsersOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.usersOptions = this.allUsersOptions.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
  },
};
</script>

<style>
</style>