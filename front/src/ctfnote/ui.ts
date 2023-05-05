import { QVueGlobals, useQuasar } from 'quasar';

type NotifyOptions = Exclude<Parameters<QVueGlobals['notify']>[0], string> & {
  message: string;
};

const USE_SYSTEM_NOTIFICATION = 'use-system-notification';

export function useNotify() {
  const $q = useQuasar();

  const enableSystemNotification = () => {
    localStorage.setItem(USE_SYSTEM_NOTIFICATION, 'true');
    return true;
  };
  const disableSystemNotification = () => {
    localStorage.setItem(USE_SYSTEM_NOTIFICATION, 'false');
    return false;
  };

  const isSystemNotificationEnabled = () => {
    return localStorage.getItem(USE_SYSTEM_NOTIFICATION) == 'true';
  };

  const notifySuccess = (opts: NotifyOptions) => {
    $q.notify({
      position: 'top-right',
      color: 'positive',
      timeout: 2500,
      actions: [{ icon: 'close', color: 'white', dense: true, round: true }],
      ...opts,
    });
    return true;
  };

  const notifyError = (message: string) => {
    $q.notify({
      position: 'top',
      color: 'negative',
      actions: [{ icon: 'close', color: 'white', dense: true, round: true }],
      icon: 'error',
      timeout: 2500,
      message,
    });
    return false;
  };

  const resolveAndNotify = async (
    p: Promise<unknown>,
    opts?: NotifyOptions
  ) => {
    try {
      await p;
      if (opts) {
        return notifySuccess(opts);
      }
      return true;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknow error';
      return notifyError(message);
    }
  };

  const globalNotify = (opts: NotifyOptions) => {
    console.log('enabled', isSystemNotificationEnabled());
    if (isSystemNotificationEnabled()) {
      try {
        new Notification(opts.message, {
          icon: `${document.location.origin}/favicon.ico`,
        });
        return;
      } catch {
        disableSystemNotification();
      }
    }
    notifySuccess(opts);
  };

  const askForNotificationPrivilege = async (): Promise<boolean> => {
    if (!window.isSecureContext) {
      notifyError('SSL is required for notifications.');
      return disableSystemNotification();
    }
    console.log(Notification.permission);
    switch (Notification.permission) {
      case 'denied':
        notifyError('Notification are blocked.');
        return disableSystemNotification();
      case 'granted':
        notifySuccess({
          message: 'System notification enabled.',
          icon: 'notifications',
        });
        return enableSystemNotification();
      case 'default':
        await Notification.requestPermission();
        return await askForNotificationPrivilege();
    }
  };

  return {
    askForNotificationPrivilege,
    resolveAndNotify,
    notifyError,
    notifySuccess,
    globalNotify,
    isSystemNotificationEnabled,
    disableSystemNotification,
  };
}
