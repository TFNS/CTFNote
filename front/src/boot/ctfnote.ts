import { boot } from 'quasar/wrappers';
import { ctfnote } from 'src/ctfnote';
import { isLogged } from 'src/ctfnote/me';

export default boot(async ({ router, redirect, urlPath }) => {
  router.beforeEach(async (to) => {
    const r = await isLogged();
    if (!r && !to.meta.public) {
      return { name: 'auth-login' };
    }
  });

  router.afterEach((to) => {
    if (typeof to.meta.title == 'string') {
      const title = to.meta.title;
      document.title = title ? `CTFNote - ${title}` : 'CTFNote';
    }
  });

  const url = new URL(urlPath, document.location.origin);
  const path = url.hash.slice(1);
  const route = router.resolve({ path });
  let logged = false;

  try {
    logged = !!(await ctfnote.auth.refreshJWT());
  } catch {
    ctfnote.auth.saveJWT(null);
    window.location.reload();
  }

  const prefetchs = [ctfnote.settings.prefetchSettings()];
  if (logged) {
    prefetchs.push(ctfnote.me.prefetchMe());
  }

  await Promise.all(prefetchs);
  if (!logged && !route.meta?.public) {
    redirect({ name: 'auth-login' });
  }
});
