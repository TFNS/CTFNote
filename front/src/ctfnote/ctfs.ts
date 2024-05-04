import { useApolloClient } from '@vue/apollo-composable';
import { date } from 'quasar';
import slugify from 'slugify';
import {
  CtfFragment,
  CtfInput,
  CtfPatch,
  CtfSecretFragment,
  CtftimeCtfById,
  CtftimeCtfByIdQuery,
  InvitationFragment,
  TagFragment,
  TaskFragment,
  useCreateCtfMutation,
  useCtfsByDateQuery,
  useCtfsQuery,
  useDeleteCtfbyIdMutation,
  useGetFullCtfQuery,
  useImportctfMutation,
  useInviteUserToCtfMutation,
  useSetDiscordEventLinkMutation,
  useSubscribeToCtfCreatedSubscription,
  useSubscribeToCtfDeletedSubscription,
  useSubscribeToCtfSubscription,
  useSubscribeToFlagSubscription,
  useSubscribeToTaskSubscription,
  useUninviteUserToCtfMutation,
  useUpdateCredentialsForCtfIdMutation,
  useUpdateCtfByIdMutation,
} from 'src/generated/graphql';
import { MaybeRefOrGetter, computed, reactive, toValue } from 'vue';
import { Ctf, CtfInvitation, Profile, Task, makeId } from './models';
import { buildTag } from './tags';
import { buildWorkingOn } from './tasks';
import { wrapQuery } from './utils';

type FullCtfResponse = {
  ctf: CtfFragment & {
    tasks: { nodes: TaskFragment[] };
    secrets: CtfSecretFragment | null;
    invitations: { nodes: InvitationFragment[] };
  };
};

/* Builders */

export function safeSlugify(str: string) {
  return slugify(str) || 'no-slug-for-you';
}

export function buildInvitation(invitation: InvitationFragment): CtfInvitation {
  return {
    ...invitation,
    ctfId: makeId<Ctf>(invitation.ctfId),
    profileId: makeId<Profile>(invitation.profileId),
  };
}

export function buildTask(task: TaskFragment): Task {
  const slug = safeSlugify(task.title);
  return {
    ...task,
    id: makeId(task.id),
    ctfId: makeId(task.ctfId),
    slug,
    solved: task.solved ?? false,
    workOnTasks: task.workOnTasks.nodes.map((w) => buildWorkingOn(w)),
    assignedTags: task.assignedTags.nodes
      .filter((t) => t.__typename && t.tag?.__typename)
      .map((t) => buildTag(t.tag as TagFragment)),
  };
}

function extractDate(d: string) {
  const masks = [
    'YYYY-MM-DDTHH:mm:ss.SSSZ',
    'YYYY-MM-DDTHH:mm:ss.SSZ',
    'YYYY-MM-DDTHH:mm:ss.SZ',
    'YYYY-MM-DDTHH:mm:ssZ',
  ];
  for (const mask of masks) {
    const r = date.extractDate(d, mask);
    if (r.valueOf() > 0) {
      return r;
    }
  }
  throw 'invalid date';
}

export function buildCtf(ctf: CtfFragment): Ctf {
  const slug = safeSlugify(ctf.title);
  const params = { ctfId: ctf.id, ctfSlug: slug };
  const infoLink = { name: 'ctf-info', params };
  const tasksLink = { name: 'ctf-tasks', params };
  const guestsLink = { name: 'ctf-guests', params };

  return {
    ...ctf,
    id: makeId(ctf.id),
    ctfUrl: ctf.ctfUrl ?? null,
    logoUrl: ctf.logoUrl ?? null,
    ctftimeUrl: ctf.ctftimeUrl ?? null,
    granted: ctf.granted ?? false,
    credentials: null,
    slug,
    infoLink,
    tasksLink,
    guestsLink,
    startTime: extractDate(ctf.startTime),
    endTime: extractDate(ctf.endTime),
    tasks: [],
    invitations: [],
    discordEventLink: ctf.discordEventLink ?? null,
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

export function useFetchFromCtftime() {
  const { resolveClient } = useApolloClient();

  return (id: number) => {
    const client = resolveClient();

    return client
      .query<CtftimeCtfByIdQuery>({
        query: CtftimeCtfById,
        variables: { id },
      })
      .then((r) => {
        if (!r.data.ctftimeCtfById) {
          throw new Error('Ctf not found');
        }
        return r.data.ctftimeCtfById;
      });
  };
}

export function useCtfsByDate(
  params: MaybeRefOrGetter<{ year: number; month: number }>
) {
  const ctfs = reactive(new Map<string, Ctf>());
  const query = useCtfsByDateQuery(params);

  query.onResult((result) => {
    result.data?.ctfsByDate?.ctfs?.forEach((node) => {
      const ctf = buildCtf(node);
      ctfs.set(ctf.nodeId, ctf);
    });
  });

  useSubscribeToCtfCreatedSubscription().onResult((result) => {
    if (!result.data) return;
    if (result.data.listen.relatedNode?.__typename !== 'Ctf') return;
    const ctf = buildCtf(result.data.listen.relatedNode);
    ctfs.set(ctf.nodeId, ctf);
  });

  useSubscribeToCtfDeletedSubscription().onResult((result) => {
    if (result.data?.listen?.relatedNodeId) {
      ctfs.delete(result.data.listen.relatedNodeId);
    }
  });

  return {
    ctfs: computed(() => {
      return Array.from(ctfs.values())
        .filter((ctf) => {
          const monthStart = date.buildDate({
            year: toValue(params).year,
            month: toValue(params).month,
            day: 1,
          });
          const monthEnd = date.addToDate(monthStart, { months: 1 });
          const start = ctf.startTime.getTime();
          const end = ctf.endTime.getTime();

          return start <= monthEnd.getTime() && end >= monthStart.getTime();
        })
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }),
    loading: query.loading,
  };
}

export function getCtf(...args: Parameters<typeof useGetFullCtfQuery>) {
  const query = useGetFullCtfQuery(...args);
  const wrappedQuery = wrapQuery(query, null, (data) => buildFullCtf(data));

  return wrappedQuery;
}

export function getAllCtfs() {
  const query = useCtfsQuery();
  const wrappedQuery = wrapQuery(query, [], (data) =>
    data.ctfs.nodes.map(buildCtf)
  );
  return wrappedQuery;
}

/* Mutations */

export function useCreateCtf() {
  const { mutate } = useCreateCtfMutation({});
  return (ctf: CtfInput) =>
    mutate(ctf).then((r) => {
      if (r?.data?.createCtf?.ctf) {
        return buildCtf(r.data.createCtf.ctf);
      }
      throw new Error('Failed to create CTF');
    });
}

export function useDeleteCtf() {
  const { mutate } = useDeleteCtfbyIdMutation({});
  return (ctf: Ctf) => mutate({ id: ctf.id });
}

export function useUpdateCtf() {
  const { mutate } = useUpdateCtfByIdMutation({});
  return (ctf: Ctf, patch: CtfPatch) =>
    mutate({ id: ctf.id, ...patch }).then((r) => {
      if (r?.data?.updateCtf?.ctf) {
        return buildCtf(r.data.updateCtf.ctf);
      }
      throw new Error('Failed to update CTF');
    });
}

export function useUpdateCtfCredentials() {
  const { mutate } = useUpdateCredentialsForCtfIdMutation({});
  return (ctf: Ctf, credentials: string) =>
    mutate({ ctfId: ctf.id, credentials });
}

export function useImportCtf() {
  const { mutate } = useImportctfMutation({});

  return async (id: number) => mutate({ id });
}

export function useInviteUserToCtf() {
  const { mutate } = useInviteUserToCtfMutation({});
  return (ctf: Ctf, profile: Profile) =>
    mutate({ ctfId: ctf.id, profileId: profile.id });
}

export function useUninviteUserToCtf() {
  const { mutate } = useUninviteUserToCtfMutation({});
  return (ctf: Ctf, profile: Profile) =>
    mutate({ ctfId: ctf.id, profileId: profile.id });
}

export function useSetDiscordEventLink() {
  const { mutate } = useSetDiscordEventLinkMutation({});
  return (ctf: Ctf, discordEventLink: string) =>
    mutate({ id: ctf.id, link: discordEventLink });
}

/* Subscription */

export function useOnFlag() {
  const sub = useSubscribeToFlagSubscription();
  const onResult = function (cb: (task: Task) => void) {
    sub.onResult((data) => {
      const node = data.data?.listen.relatedNode;
      if (!node || node.__typename != 'Task') return;
      cb(buildTask(node));
    });
  };
  return { ...sub, onResult };
}

export function useOnCtfUpdate() {
  const sub = useSubscribeToCtfSubscription();
  const onResult = function (cb: (ctf: Ctf) => void) {
    sub.onResult((data) => {
      const node = data.data?.listen.relatedNode;
      if (!node || node.__typename != 'Ctf') return;
      cb(buildCtf(node));
    });
  };
  return { ...sub, onResult };
}

export function useOnTaskUpdate() {
  const sub = useSubscribeToTaskSubscription();
  const onResult = function (cb: (task: Task) => void) {
    sub.onResult((data) => {
      const node = data.data?.listen.relatedNode;
      if (!node || node.__typename != 'Task') return;
      cb(buildTask(node));
    });
  };
  return { ...sub, onResult };
}

export function useOnCtfDeleted() {
  const sub = useSubscribeToCtfDeletedSubscription();
  const onResult = function (cb: (ctf: Ctf) => void) {
    sub.onResult((data) => {
      const node = data.data?.listen.relatedNode;
      if (!node || node.__typename != 'Ctf') return;
      cb(buildCtf(node));
    });
  };
  return { ...sub, onResult };
}

export function useOnCtfCreated() {
  const sub = useSubscribeToCtfCreatedSubscription();
  const onResult = function (cb: (ctf: Ctf) => void) {
    sub.onResult((data) => {
      const node = data.data?.listen.relatedNode;
      if (!node || node.__typename != 'Ctf') return;
      cb(buildCtf(node));
    });
  };
  return { ...sub, onResult };
}
