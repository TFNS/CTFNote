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

function checkJWT(jwt: string | null | undefined) {
  if (!jwt) {
    localStorage.removeItem(JWT_KEY);
  } else {
    localStorage.setItem(JWT_KEY, jwt);
  }
  getMe(true);
}

/* Mutations */
export async function login(login: string, password: string) {
  const { mutate } = useLoginMutation({});
  try {
    const r = await wrapNotify(
      mutate({ login, password }),
      `Logged as ${login}`
    );
    checkJWT(r?.data?.login?.jwt);
  } catch {}
}

export async function register(login: string, password: string) {
  const { mutate } = useRegisterMutation({});
  try {
    const r = await wrapNotify(mutate({ login, password }));
    checkJWT(r?.data?.register?.jwt);
  } catch {}
}

export async function registerWithToken(
  login: string,
  password: string,
  token: string
) {
  const { mutate } = useRegisterWithTokenMutation({});
  try {
    const r = await wrapNotify(mutate({ login, password, token }));
    checkJWT(r?.data?.registerWithToken?.jwt);
  } catch {}
}

export async function registerWithPassword(
  login: string,
  password: string,
  ctfnotePassword: string
) {
  const { mutate } = useRegisterWithPasswordMutation({});
  try {
    const r = await wrapNotify(
      mutate({
        login,
        password,
        ctfnotePassword,
      })
    );
    checkJWT(r?.data?.registerWithPassword?.jwt);
  } catch {}
}

export async function resetPassword(password: string, token: string) {
  const { mutate } = useResetPasswordMutation({});
  try {
    await wrapNotify(mutate({ password, token }));
  } catch {}
}

export function logout() {
  checkJWT(null);
}
