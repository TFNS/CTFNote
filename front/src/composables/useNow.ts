import { ref, onScopeDispose } from 'vue';

export function useNow(refreshInterval = 1000) {
  const now = ref(new Date());

  const interval = setInterval(() => {
    now.value = new Date();
  }, refreshInterval);

  onScopeDispose(() => {
    clearInterval(interval);
  });

  return now;
}
