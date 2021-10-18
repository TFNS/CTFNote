import {
  useLoginMutation,
  useRegisterMutation,
  useRegisterWithPasswordMutation,
  useRegisterWithTokenMutation,
  useResetPasswordMutation,
} from 'src/generated/graphql';
import { getMe } from './me';
import { wrapNotify } from './utils';

const JWT_KEY = 'JWT';

export function saveJWT(jwt: string | null | undefined) {
  if (!jwt) {
    localStorage.removeItem(JWT_KEY);
  } else {
    localStorage.setItem(JWT_KEY, jwt);
  }
}

/* Mutations */
export function useLogin() {
  const { mutate } = useLoginMutation({});
  const { refetch } = getMe();
  return async (login: string, password: string) => {
    try {
      const r = await wrapNotify(
        mutate({ login, password }),
        `Logged as ${login}`
      );
      saveJWT(r?.data?.login?.jwt);
      await refetch();
    } catch {}
  };
}

export function useRegister() {
  const { mutate } = useRegisterMutation({});
  const { refetch } = getMe();
  return async (login: string, password: string) => {
    try {
      const r = await wrapNotify(mutate({ login, password }));
      saveJWT(r?.data?.register?.jwt);
      await refetch();
    } catch {}
  };
}

export function useRegisterWithToken() {
  const { mutate } = useRegisterWithTokenMutation({});
  const { refetch } = getMe();
  return async (login: string, password: string, token: string) => {
    try {
      const r = await wrapNotify(mutate({ login, password, token }));
      saveJWT(r?.data?.registerWithToken?.jwt);
      await refetch();
    } catch {}
  };
}

export function useRegisterWithPassword() {
  const { mutate } = useRegisterWithPasswordMutation({});
  const { refetch } = getMe();
  return async (login: string, password: string, ctfnotePassword: string) => {
    try {
      const r = await wrapNotify(
        mutate({
          login,
          password,
          ctfnotePassword,
        })
      );
      saveJWT(r?.data?.registerWithPassword?.jwt);
      await refetch();
    } catch {}
  };
}

export function useResetPassword() {
  const { mutate } = useResetPasswordMutation({});
  const { refetch } = getMe();
  return async (password: string, token: string) => {
    try {
      const r = await wrapNotify(mutate({ password, token }));
      saveJWT(r?.data?.resetPassword?.jwt);
      await refetch();
    } catch {}
  };
}

export function useLogout() {
  const { refetch } = getMe();
  return async () => {
    saveJWT(null);
    await refetch();
  };
}
