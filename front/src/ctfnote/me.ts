import { useApolloClient } from '@vue/apollo-composable';
import {
  MeDocument,
  ProfileFragment,
  ProfilePatch,
  useMeQuery,
  useProfileTokenQuery,
  useResetDiscordIdMutation,
  useResetProfileTokenMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
} from 'src/generated/graphql';
import { inject, InjectionKey, provide, Ref } from 'vue';
import { Me, Profile, Role } from './models';
import { buildProfile } from './profiles';
import { wrapQuery } from './utils';
/* Builders */

export function buildMe(me: ProfileFragment): Me {
  const profile = buildProfile(me);
  const isLogged = !!profile;
  const isAdmin = profile?.role == Role.UserAdmin;
  const isManager = isAdmin || profile?.role == Role.UserManager;
  const isMember = isManager || profile?.role == Role.UserMember;
  const isGuest = isMember || profile?.role == Role.UserGuest;

  return {
    profile,
    isAdmin,
    isManager,
    isMember,
    isGuest,
    isLogged,
  };
}

/* Queries */

export function getMe(refresh = false) {
  const q = useMeQuery({
    fetchPolicy: refresh ? 'network-only' : 'cache-first',
  });

  const query = wrapQuery(q, null, (data) => {
    return buildMe(data.me);
  });
  return query;
}

/* Mutations */

export function useUpdateProfile() {
  const { mutate } = useUpdateProfileMutation({});

  return async (profile: Profile, patch: ProfilePatch) => {
    return mutate({ id: profile.id, patch });
  };
}

export function useUpdatePassword() {
  const { mutate } = useUpdatePasswordMutation({});
  return async (oldPassword: string, newPassword: string) => {
    return mutate({ oldPassword, newPassword });
  };
}

/* Global provider  */

const MeSymbol: InjectionKey<Ref<Me | null>> = Symbol('me');

export function provideMe(refresh = false) {
  const { result: me } = getMe(refresh);
  provide(MeSymbol, me);
  return me;
}

export function injectMe() {
  const me = inject(MeSymbol);
  if (!me) {
    throw 'ERROR';
  }

  return me;
}

/* Prefetch */

export function prefetchMe() {
  const { client } = useApolloClient();
  return client.query({
    query: MeDocument,
    fetchPolicy: 'network-only',
  });
}

export async function isLogged() {
  const { client } = useApolloClient();
  try {
    const r = await client.query<{ me: unknown }>({
      query: MeDocument,
      fetchPolicy: 'cache-only',
    });
    return !!r.data.me;
  } catch {
    return false;
  }
}

export function getProfileToken() {
  const r = useProfileTokenQuery();
  return wrapQuery(r, 'no token', (data) => {
    return data.profileToken;
  });
}

export function useResetProfileToken() {
  const { mutate } = useResetProfileTokenMutation({});
  return async () => {
    const r = await mutate({});
    return r?.data?.resetProfileToken?.string;
  };
}

export function useResetDiscordId() {
  const { mutate } = useResetDiscordIdMutation({});
  return async () => {
    const r = await mutate({});
    provideMe(true);
    return r?.data?.resetDiscordId?.string;
  };
}
