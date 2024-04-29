import { useApolloClient } from '@vue/apollo-composable';
import {
  NewTokenDocument,
  useLoginMutation,
  useRegisterMutation,
  useRegisterWithPasswordMutation,
  useRegisterWithTokenMutation,
  useResetPasswordMutation,
} from 'src/generated/graphql';
import { useRouter } from 'vue-router';
import { prefetchMe } from './me';

export const JWT_KEY = 'JWT';

export function saveJWT(jwt: string | null | undefined) {
  if (!jwt) {
    localStorage.removeItem(JWT_KEY);
  } else {
    localStorage.setItem(JWT_KEY, jwt);
  }
}

/* Prefetch */

export async function refreshJWT(): Promise<boolean> {
  const { client } = useApolloClient();
  const result = await client.query<{ newToken: string | null | undefined }>({
    query: NewTokenDocument,
    fetchPolicy: 'network-only',
  });

  const token = result.data.newToken;

  if (token) {
    localStorage.setItem(JWT_KEY, token);
    return true;
  } else {
    return false;
  }
}

/* Mutations */
export function useLogin() {
  const { mutate } = useLoginMutation({});
  const $router = useRouter();
  return async (login: string, password: string) => {
    const r = await mutate({ login, password });
    const jwt = r?.data?.login?.jwt;
    if (jwt) {
      saveJWT(jwt);
      await prefetchMe();
      await $router.push({ name: 'ctfs-incoming' });
    }
  };
}

export function useRegister() {
  const { mutate } = useRegisterMutation({});
  const $router = useRouter();
  return async (login: string, password: string) => {
    const r = await mutate({ login, password });
    const jwt = r?.data?.register?.jwt;
    if (jwt) {
      saveJWT(jwt);
      await prefetchMe();
      await $router.push({ name: 'ctfs-incoming' });
    }
  };
}

export function useRegisterWithToken() {
  const { mutate } = useRegisterWithTokenMutation({});
  const $router = useRouter();
  return async (login: string, password: string, token: string) => {
    const r = await mutate({ login, password, token });
    const jwt = r?.data?.registerWithToken?.jwt;
    if (jwt) {
      saveJWT(jwt);
      await prefetchMe();
      await $router.push({ name: 'ctfs-incoming' });
    }
  };
}

export function useRegisterWithPassword() {
  const { mutate } = useRegisterWithPasswordMutation({});
  const $router = useRouter();
  return async (login: string, password: string, ctfnotePassword: string) => {
    const r = await mutate({
      login,
      password,
      ctfnotePassword,
    });
    const jwt = r?.data?.registerWithPassword?.jwt;
    if (jwt) {
      saveJWT(jwt);
      await prefetchMe();
      await $router.push({ name: 'ctfs-incoming' });
    }
  };
}

export function useResetPassword() {
  const { mutate } = useResetPasswordMutation({});
  const $router = useRouter();
  return async (password: string, token: string) => {
    const r = await mutate({ password, token });
    const jwt = r?.data?.resetPassword?.jwt;
    if (jwt) {
      saveJWT(jwt);
      await prefetchMe();
      await $router.push({ name: 'ctfs-incoming' });
    }
  };
}

export function useLogout() {
  return () => {
    saveJWT(null);
    document.location.reload();
  };
}
