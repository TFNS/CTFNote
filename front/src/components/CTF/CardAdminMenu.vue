<template>
  <q-menu touch-position context-menu>
    <q-list dense>
      <q-item clickable v-close-popup @click="$emit('edit')">
        <q-item-section side>
          <q-avatar icon="create" />
        </q-item-section>
        <q-item-section class="q-px-md"> Edit </q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="$emit('delete')">
        <q-item-section side color="negative">
          <q-avatar icon="delete" />
        </q-item-section>
        <q-item-section class="q-px-md"> Delete </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>
