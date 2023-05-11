import { useApolloClient } from '@vue/apollo-composable';
import {
  MeDocument,
  ProfileFragment,
  ProfilePatch,
  PublicProfileFragment,
  useMeQuery,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
} from 'src/generated/graphql';
import { inject, InjectionKey, provide, Ref } from 'vue';
import { Me, Profile, PublicProfile, Role } from './models';
import { buildProfile, buildPublicProfile } from './profiles';
import { wrapQuery } from './utils';
/* Builders */

export function buildMe(me: PublicProfileFragment): Me {
  const profile = buildPublicProfile(me);
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

  return async (profile: PublicProfile, patch: ProfilePatch) => {
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

const MeSymbol: InjectionKey<Ref<Me>> = Symbol('me');

export function provideMe() {
  const { result: me } = getMe();
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
