import {
  ProfileFragment,
  Role,
  useGetTeamQuery,
  useSubscribeToProfileCreatedSubscription,
  useSubscribeToProfileDeletedSubscription,
  useSubscribeToProfileSubscription
} from 'src/generated/graphql';
import { colorHash } from 'src/utils';
import { makeId, Profile } from '.';
import { wrapQuery } from './utils';

/* Builders */

export function buildProfile(p: ProfileFragment): Profile {
  return {
    ...p,
    color: p.color ?? colorHash(p.username),
    id: makeId(p.id),
    role: p.role as Role,
  };
}

/* Queries */

export function getTeam() {
  const query = useGetTeamQuery();
  const wrappedQuery = wrapQuery(
    query,
    [],
    (data) => data.profiles?.nodes.map(buildProfile) ?? []
  );
  wrappedQuery.onResult((profiles) => {
    profiles.forEach((p) => watchProfile(p));
  });
  watchProfileList(() => () => wrappedQuery.refetch);
  return wrappedQuery;
}

/* Subcriptions  */

export function watchProfileList(refetch: () => void) {
  const { onResult: profileCreated } =
    useSubscribeToProfileCreatedSubscription();
  const { onResult: profileDeleted } =
    useSubscribeToProfileDeletedSubscription();
  profileCreated(() => refetch());
  profileDeleted(() => refetch());
}

export function watchProfile(profile: Profile) {
  useSubscribeToProfileSubscription({ topic: `update:profiles:${profile.id}` });
}
