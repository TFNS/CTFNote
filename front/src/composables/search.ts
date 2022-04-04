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

  // Handle search shortcuts
  onMounted(() => {
    hotkeys('ctrl+k, command+k', function (event) {
      event.stopImmediatePropagation();
      event.preventDefault();

      // If the dialog is already opened, don't do anything
      if (locked.value) return;

      lock();

      $q.dialog({
        component: SearchDialog,
      })
        .onCancel(unlock)
        .onDismiss(unlock)
        .onOk(unlock);
    });
  });

  return {};
}
