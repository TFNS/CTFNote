import { QVueGlobals, useQuasar } from 'quasar';

type NotifyOptions = Exclude<Parameters<QVueGlobals['notify']>[0], string>;

export function useWrapNotify() {
  const $q = useQuasar();

  const notifySuccess = (opts: NotifyOptions) => {
    $q.notify({
      position: 'top-right',
      color: 'positive',
      timeout: 2500,
      ...opts,
    });
    return true;
  };

  const notifyError = (message: string) => {
    $q.notify({
      position: 'top',
      color: 'negative',
      actions: [{ icon: 'close', color: 'white', dense: true }],
      icon: 'error',
      timeout: 2500,
      message,
    });
    return false;
  };

  return async (cb: () => unknown | Promise<unknown>, opts?: NotifyOptions) => {
    try {
      const r = cb();
      if (r instanceof Promise) {
        await r;
      }
      if (opts) {
        return notifySuccess(opts);
      }
      return true;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknow error';
      return notifyError(message);
    }
  };
}
