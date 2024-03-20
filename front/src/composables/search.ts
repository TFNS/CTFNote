import hotkeys from 'hotkeys-js';
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import SearchDialog from 'src/components/Dialogs/SearchDialog.vue';

export default function useSearchDialog() {
  const $q = useQuasar();

  // Used to force opening one dialog at a time
  const openedSearch = ref(false);

  const lock = () => (openedSearch.value = true);
  const unlock = () => (openedSearch.value = false);
  const locked = computed(() => openedSearch.value);

  function showSearchDialog() {
    // If the dialog is already opened, don't do anything
    if (locked.value) return;

    lock();

    $q.dialog({
      component: SearchDialog,
    })
      .onCancel(unlock)
      .onDismiss(unlock)
      .onOk(unlock);
  }

  // Handle search shortcuts
  onMounted(() => {
    hotkeys('ctrl+k, command+k', function (event) {
      event.stopImmediatePropagation();
      event.preventDefault();

      showSearchDialog();
    });

    // handle incoming post message for event showSearchDialog
    // this is used to open the search dialog from the task iframe
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data === 'showSearchDialog') {
        showSearchDialog();
      }
    });
  });

  return {};
}
