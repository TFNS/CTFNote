<template>
  <q-btn v-bind="$attrs" @click="$emit('click')" icon="delete" color="negative" v-if="$ctfnote.isManager">
    <q-tooltip>Delete the CTF</q-tooltip>
  </q-btn>
</template>
