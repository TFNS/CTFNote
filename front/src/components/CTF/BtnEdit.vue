<template>
  <q-btn v-bind="$attrs" @click="$emit('click')" icon="edit" color="warning" v-if="$ctfnote.isManager">
    <q-tooltip>Edit the CTF</q-tooltip>
  </q-btn>
</template>
