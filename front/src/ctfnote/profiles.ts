import {
  ProfileFragment,
  PublicProfileFragment,
  PublicProfileSubscriptionPayloadDocument,
  Role,
  useGetTeamAdminQuery,
  useGetTeamQuery,
  useSubscribeToProfileCreatedSubscription,
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

export function buildPublicProfile(p: PublicProfileFragment): PublicProfile {
  // These checks are here because PublicProfile comes from a view
  // which does not have nullability checks
  if (p.username == null) throw new Error("Username can't be null");
  if (p.id == null) throw new Error("ID can't be null");
  if (p.nodeId == null) throw new Error("NodeID can't be null");
  const id = p.id;
  const username = p.username;
  const nodeId = p.nodeId;

  return {
    ...p,
    nodeId: nodeId,
    username: username,
    description: p.description ? p.description : '',
    color: p.color ?? colorHash(username),
    id: makeId(id),
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
    discordId: p.discordId ?? null,
    lastactive: p.lastactive,
    color: p.color ?? colorHash(p.username),
    id: makeId(p.id),
    role: p.role as Role,
  };
}

/* Global provider  */

const TeamSymbol: InjectionKey<Ref<readonly PublicProfile[]>> = Symbol('team');

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
    (data) => data.publicProfiles?.nodes.map(buildPublicProfile) ?? []
  );

  query.subscribeToMore({ document: PublicProfileSubscriptionPayloadDocument });
  return wrappedQuery;
}

export function getTeamAdmin() {
  const query = useGetTeamAdminQuery();
  const wrappedQuery = wrapQuery(
    query,
    [],
    (data) => data.profiles?.nodes.map(buildProfile) ?? []
  );

  return wrappedQuery;
}

/* Subcriptions  */
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
