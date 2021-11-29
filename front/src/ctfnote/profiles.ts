import {
  ProfileFragment,
  Role,
  SubscribeToProfileDocument,
  useGetTeamQuery,
  useSubscribeToProfileCreatedSubscription,
  useSubscribeToProfileDeletedSubscription,
  useSubscribeToProfileSubscription,
} from 'src/generated/graphql';
import { makeId, Profile } from './models';
import { colorHash, wrapQuery } from './utils';
import { Ref, InjectionKey, provide, inject } from 'vue';

/* Builders */

export function buildProfile(p: ProfileFragment): Profile {
  return {
    ...p,
    color: p.color ?? colorHash(p.username),
    id: makeId(p.id),
    role: p.role as Role,
  };
}

/* Global provider  */

const TeamSymbol: InjectionKey<Ref<Profile[]>> = Symbol('team');

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
    (data) => data.profiles?.nodes.map(buildProfile) ?? []
  );

  query.subscribeToMore({ document: SubscribeToProfileDocument });
  return wrappedQuery;
}

/* Subcriptions  */

export function useOnProfileUpdate() {
  const sub = useSubscribeToProfileSubscription();
  const onResult = function (cb: (profile: Profile) => void) {
    sub.onResult((data) => {
      const node = data.data?.listen.relatedNode;
      if (!node || node.__typename != 'Profile') return;
      cb(buildProfile(node));
    });
  };
  return { ...sub, onResult };
}

export function useOnProfileCreated() {
  const sub = useSubscribeToProfileCreatedSubscription();
  const onResult = function (cb: (profile: Profile) => void) {
    sub.onResult((data) => {
      const node = data.data?.listen.relatedNode;
      if (!node || node.__typename != 'Profile') return;
      cb(buildProfile(node));
    });
  };
  return { ...sub, onResult };
}

export function useOnProfileDeleted() {
  const sub = useSubscribeToProfileDeletedSubscription();
  const onResult = function (cb: (profile: Profile) => void) {
    sub.onResult((data) => {
      const node = data.data?.listen.relatedNode;
      if (!node || node.__typename != 'Profile') return;
      cb(buildProfile(node));
    });
  };
  return { ...sub, onResult };
}
