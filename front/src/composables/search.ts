import hotkeys from 'hotkeys-js';
import { ref, onMounted } from 'vue';

import { useQuasar } from 'quasar';
import SearchDialog from 'src/components/Dialogs/SearchDialog.vue';

export default function useSearchDialog() {
  const $q = useQuasar();

  // Used to force opening one dialog at a time
  const openedSearch = ref(false);

  // Handle search shortcuts
  onMounted(() => {
    hotkeys('ctrl+k, command+k', function (event) {
      event.stopImmediatePropagation();
      event.preventDefault();

      // If the dialog is already opened, don't do anything
      if (openedSearch.value) return;

      openedSearch.value = true;

      $q.dialog({
        component: SearchDialog,
      })
        .onCancel(() => (openedSearch.value = false))
        .onDismiss(() => (openedSearch.value = false))
        .onOk(() => (openedSearch.value = false));
    });
  });

  return {};
}
