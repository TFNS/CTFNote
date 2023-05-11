import {
  ProfileFragment,
  PublicProfileFragment,
  Role,
  SubscribeToProfileDocument,
  SubscribeToPublicProfileDocument,
  useGetTeamAdminQuery,
  useGetTeamQuery,
  useSubscribeToProfileCreatedSubscription,
  useSubscribeToProfileDeletedSubscription,
  useSubscribeToProfileSubscription,
} from 'src/generated/graphql';
import { makeId, Profile, PublicProfile } from './models';
import { colorHash, wrapQuery } from './utils';
import { Ref, InjectionKey, provide, inject } from 'vue';

/* Builders */
// type FullPublicProfileFragement = {
//   [k in keyof PublicProfileFragment]-?: Required<
//     NonNullable<PublicProfileFragment[k]>
//   >;
// };

type FullPublicProfileFragement = {
  id: number;
  username: string;
  color: string;
  description: string;
  role: Required<NonNullable<Role | null | undefined>>;
  nodeId: string;
};

export function buildPublicProfile(p: PublicProfileFragment): PublicProfile {
  return {
    ...p,
    color: p.color ?? colorHash(p.username),
    id: makeId(p.id),
    role: p.role as Role,
  };
}

export function buildPublicProfileFromProfile(p: Profile): PublicProfile {
  return {
    ...p,
    color: p.color ?? colorHash(p.username),
    id: makeId(p.id),
    role: p.role,
  };
}

export function buildProfile(p: ProfileFragment): Profile {
  return {
    ...p,
    lastactive: p.lastactive,
    color: p.color ?? colorHash(p.username),
    id: makeId(p.id),
    role: p.role as Role,
  };
}

/* Global provider  */

const TeamSymbol: InjectionKey<Ref<PublicProfile[]>> = Symbol('team');

export function provideTeam() {
  const { result: team } = getTeam();
  provide(TeamSymbol, team);
  return team;
}

export function injectTeam() {
  const team = inject(TeamSymbol);
  if (!team) {
    throw 'ERROR';
  }

  return team;
}

/* Queries */

export function getTeam() {
  const query = useGetTeamQuery();
  const wrappedQuery = wrapQuery(
    query,
    [],
    (data) => data.profiles?.nodes.map(buildPublicProfile) ?? []
  );

  query.subscribeToMore({ document: SubscribeToPublicProfileDocument });
  return wrappedQuery;
}

export function getTeamAdmin() {
  const query = useGetTeamAdminQuery();
  const wrappedQuery = wrapQuery(
    query,
    [],
    (data) => data.profiles?.nodes.map(buildProfile) ?? []
  );

  query.subscribeToMore({ document: SubscribeToProfileDocument });
  return wrappedQuery;
}

/* Subcriptions  */

export function useOnProfileUpdate() {
  const sub = useSubscribeToProfileSubscription();
  const onResult = function (cb: (profile: PublicProfile) => void) {
    sub.onResult((data) => {
      const node = data.data?.listen.relatedNode;
      if (!node || node.__typename != 'Profile') return;
      cb(buildPublicProfile(node));
    });
  };
  return { ...sub, onResult };
}

export function useOnProfileCreated() {
  const sub = useSubscribeToProfileCreatedSubscription();
  const onResult = function (cb: (profile: PublicProfile) => void) {
    sub.onResult((data) => {
      const node = data.data?.listen.relatedNode;
      if (!node || node.__typename != 'Profile') return;
      cb(buildPublicProfile(node));
    });
  };
  return { ...sub, onResult };
}

export function useOnProfileDeleted() {
  const sub = useSubscribeToProfileDeletedSubscription();
  const onResult = function (cb: (profile: PublicProfile) => void) {
    sub.onResult((data) => {
      const node = data.data?.listen.relatedNode;
      if (!node || node.__typename != 'Profile') return;
      cb(buildPublicProfile(node));
    });
  };
  return { ...sub, onResult };
}
