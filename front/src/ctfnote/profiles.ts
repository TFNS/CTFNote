import {
  ProfileFragment,
  Role,
  useGetGuestsQuery,
  useGetTeamQuery,
  useSubscribeToProfileSubscription,
} from 'src/generated/graphql';
import { makeId, Profile } from '.';
import { wrapQuery } from './utils';

/* Builders */

export function buildProfile(p: ProfileFragment): Profile {
  return {
    ...p,
    color: p.color ?? null,
    id: makeId(p.id),
    role: p.role as Role,
  };
}

/* Queries */

export function getGuests() {
  const q = useGetGuestsQuery();
  return wrapQuery(q, [], (data) => data.guests.nodes.map(buildProfile));
}

export function getTeam() {
  const query = useGetTeamQuery();
  const wrappedQuery = wrapQuery(query, [], (data) =>
    data.profiles?.nodes.map(buildProfile) ?? []
  );
  wrappedQuery.onResult((profiles) => {
    profiles.forEach((p) => watchProfile(p));
  });
  return wrappedQuery;
}

/* Subcriptions  */

export function watchProfile(profile: Profile) {
  useSubscribeToProfileSubscription({ topic: `update:profiles:${profile.id}` });
}
