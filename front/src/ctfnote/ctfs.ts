import slugify from 'slugify';
import {
  CtfFragment,
  CtfInput,
  CtfPatch,
  CtfSecretFragment,
  InvitationFragment,
  TaskFragment,
  useCreateCtfMutation,
  useCtfsQuery,
  useDeleteCtfbyIdMutation,
  useGetFullCtfQuery,
  useImportctfMutation,
  useIncomingCtfsQuery,
  useInviteUserToCtfMutation,
  usePastCtfsQuery,
  useSubscribeToCtfCreatedSubscription,
  useSubscribeToCtfDeletedSubscription,
  useSubscribeToCtfSubscription,
  useSubscribeToFullCtfSubscription,
  useUninviteUserToCtfMutation,
  useUpdateCredentialsForCtfIdMutation,
  useUpdateCtfByIdMutation,
} from 'src/generated/graphql';
import { CtfInvitation, makeId } from '.';
import { Ctf, Profile, Task } from './models';
import { watchTask } from './tasks';
import { wrapQuery } from './utils';

type FullCtfResponse = {
  ctf: CtfFragment & {
    tasks: { nodes: TaskFragment[] };
    secrets: CtfSecretFragment | null;
    invitations: { nodes: InvitationFragment[] };
  };
};

/* Builders */

export function buildInvitation(invitation: InvitationFragment): CtfInvitation {
  return {
    ...invitation,
    ctfId: makeId<Ctf>(invitation.ctfId),
    profileId: makeId<Profile>(invitation.profileId),
  };
}

export function buildTask(task: TaskFragment): Task {
  const slug = slugify(task.title)
  return {
    ...task,
    id: makeId(task.id),
    ctfId: makeId(task.ctfId),
    slug,
    solved: task.solved ?? false,
    workOnTasks: task.workOnTasks.nodes.map((n) =>
      makeId<Profile>(n.profileId)
    ),
  };
}

export function buildCtf(ctf: CtfFragment): Ctf {
  const slug = slugify(ctf.title)
  return {
    ...ctf,
    id: makeId(ctf.id),
    ctfUrl: ctf.ctfUrl ?? null,
    logoUrl: ctf.logoUrl ?? null,
    ctftimeUrl: ctf.ctftimeUrl ?? null,
    granted: ctf.granted ?? false,
    credentials: null,
    slug,
    tasks: [],
    invitations: [],
  };
}

export function buildFullCtf(data: FullCtfResponse): Ctf {
  return {
    ...buildCtf(data.ctf),
    credentials: data.ctf.secrets?.credentials ?? null,
    tasks: data.ctf.tasks.nodes.map(buildTask),
    invitations: data.ctf.invitations.nodes.map(buildInvitation),
  };
}

/* Queries */

export function getIncomingCtfs() {
  const query = useIncomingCtfsQuery({ fetchPolicy: 'cache-and-network' });
  const wrappedQuery = wrapQuery(query, [], (data) =>
    data.incomingCtf.nodes.map(buildCtf)
  );
  wrappedQuery.onResult((ctfs) => {
    ctfs.forEach((ctf) => watchCtf(ctf));
  });
  watchCtfList(() => void wrappedQuery.refetch());
  return wrappedQuery;
}

export function getPastCtfs(...args: Parameters<typeof usePastCtfsQuery>) {
  const query = usePastCtfsQuery(...args);
  const wrappedQuery = wrapQuery(query, [], (data) =>
    data.pastCtf.nodes.map(buildCtf)
  );
  wrappedQuery.onResult((ctfs) => {
    ctfs.forEach((ctf) => watchCtf(ctf));
  });
  watchCtfList(() => void wrappedQuery.refetch());
  return wrappedQuery;
}

export function getCtf(...args: Parameters<typeof useGetFullCtfQuery>) {
  const query = useGetFullCtfQuery(...args);
  const wrappedQuery = wrapQuery(query, null, (data) => buildFullCtf(data));

  wrappedQuery.onResult((ctf) => {
    if (ctf) {
      watchFullCtf(ctf);
    }
  });
  return wrappedQuery;
}

export function getAllCtfs() {
  const query = useCtfsQuery();
  const wrappedQuery = wrapQuery(query, [], (data) =>
    data.ctfs.nodes.map(buildCtf)
  );
  wrappedQuery.onResult((ctfs) => {
    ctfs.forEach((ctf) => watchCtf(ctf));
  });
  watchCtfList(() => void wrappedQuery.refetch());
  return wrappedQuery;
}

/* Mutations */

export async function createCtf(ctf: CtfInput) {
  const { mutate } = useCreateCtfMutation({});
  return await mutate(ctf);
}

export async function deleteCtf(ctf: Ctf) {
  const { mutate } = useDeleteCtfbyIdMutation({});
  return await mutate({ id: ctf.id });
}

export async function updateCtf(ctf: Ctf, patch: CtfPatch) {
  const { mutate } = useUpdateCtfByIdMutation({});
  await mutate({ id: ctf.id, ...patch });
}

export async function updateCtfCredentials(ctf: Ctf, credentials: string) {
  const { mutate } = useUpdateCredentialsForCtfIdMutation({});
  await mutate({ ctfId: ctf.id, credentials });
}

export async function importCtf(id: number) {
  const { mutate } = useImportctfMutation({});
  await mutate({ id });
}

export async function inviteUserToCtf(ctf: Ctf, profile: Profile) {
  const { mutate } = useInviteUserToCtfMutation({});
  await mutate({ ctfId: ctf.id, profileId: profile.id });
}

export async function uninviteUserToCtf(ctf: Ctf, profile: Profile) {
  const { mutate } = useUninviteUserToCtfMutation({});
  await mutate({ ctfId: ctf.id, profileId: profile.id });
}

/* Subscriptions */

export function watchCtfList(refetch: () => void) {
  const { onResult: ctfCreated } = useSubscribeToCtfCreatedSubscription();
  const { onResult: ctfDeleted } = useSubscribeToCtfDeletedSubscription();
  ctfCreated(() => refetch());
  ctfDeleted(() => refetch());
}

export function watchCtf(ctf: Ctf) {
  useSubscribeToCtfSubscription({ topic: `update:ctfs:${ctf.id}` });
}

export function watchFullCtf(ctf: Ctf) {
  ctf.tasks.forEach((t) => watchTask(t));
  useSubscribeToFullCtfSubscription({ topic: `update:ctfs:${ctf.id}` });
}
