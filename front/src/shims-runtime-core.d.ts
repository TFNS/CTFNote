/* eslint-disable */

import { QVueGlobals } from 'quasar';
import { Router } from 'vue-router';

// Using $refs with Vue 3 + TypeScript + Options API
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $refs: {
      [key: string]: HTMLElement | any;
    };
    $router: Router;
    $q: QVueGlobals;
  }
}
