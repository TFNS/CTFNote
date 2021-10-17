import {
  MeFragment,
  ProfilePatch,
  useMeQuery,
  useUpdatePasswordMutation,
  useUpdateProfileMutation
} from 'src/generated/graphql';
import { Me, Profile, Role } from '.';
import { buildProfile } from './profiles';
import { wrapNotify, wrapQuery } from './utils';

/* Builders */

export function buildMe(me: MeFragment | null): Me {
  const jwt = me?.jwt ?? null;
  const profile = me?.profile ? buildProfile(me.profile) : null;
  const isLogged = !!profile;
  const isAdmin = profile?.role == Role.UserAdmin;
  const isManager = isAdmin || profile?.role == Role.UserManager;
  const isMember = isManager || profile?.role == Role.UserMember;
  const isGuest = isMember || profile?.role == Role.UserGuest;
  return {
    profile,
    jwt,
    isAdmin,
    isManager,
    isMember,
    isGuest,
    isLogged,
  };
}

/* Callbacks  */

type Callback = () => void;

const onLoginCallbacks: Callback[] = [];
const onLogoutCallbacks: Callback[] = [];

export function onLogin(cb: Callback) {
  onLoginCallbacks.push(cb);
}

export function onLogout(cb: Callback) {
  onLogoutCallbacks.push(cb);
}

/* Queries */

export function getMe(refresh = false) {
  const q = useMeQuery({
    fetchPolicy: refresh ? 'network-only' : 'cache-first',
  });

  const query = wrapQuery(q, buildMe({}), (data) => {
    if (!data){
      localStorage.removeItem('JWT')
      window.location.reload()
    }
    return buildMe(data.me)
  });
  query.onResult((r) => {
    if (r.profile) {
      onLoginCallbacks.forEach((cb) => cb());
    } else {
      onLogoutCallbacks.forEach((cb) => cb());
    }
  });
  return query;
}

/* Mutations */

export async function updateProfile(profile: Profile, patch: ProfilePatch) {
  const { mutate } = useUpdateProfileMutation({});
  try {
    await wrapNotify(mutate({ id: profile.id, patch }), 'Profile changed.');
  } catch {}
}

export async function updatePassword(oldPassword: string, newPassword: string) {
  const { mutate } = useUpdatePasswordMutation({});
  try {
    await wrapNotify(mutate({ oldPassword, newPassword }), 'Password changed.');
  } catch {}
}
