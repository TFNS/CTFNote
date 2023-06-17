import { date } from 'quasar';
import slugify from 'slugify';
import {
  CtfFragment,
  CtfInput,
  CtfPatch,
  CtfSecretFragment,
  InvitationFragment,
  SubscribeToCtfCreatedDocument,
  SubscribeToCtfCreatedSubscription,
  SubscribeToCtfCreatedSubscriptionVariables,
  SubscribeToCtfDeletedDocument,
  SubscribeToCtfDeletedSubscription,
  SubscribeToCtfDeletedSubscriptionVariables,
  TagFragment,
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
  useSubscribeToFlagSubscription,
  useSubscribeToTaskSubscription,
  useUninviteUserToCtfMutation,
  useUpdateCredentialsForCtfIdMutation,
  useUpdateCtfByIdMutation,
} from 'src/generated/graphql';
import { CtfInvitation, makeId } from './models';
import { Ctf, Profile, Task } from './models';
import { wrapQuery } from './utils';
import { buildTag } from './tags';

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
    workOnTasks: task.workOnTasks.nodes.map((n) =>
      makeId<Profile>(n.profileId)
    ),
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

  /* Watch deletion */
  query.subscribeToMore<
    SubscribeToCtfDeletedSubscriptionVariables,
    SubscribeToCtfDeletedSubscription
  >({
    document: SubscribeToCtfDeletedDocument,
    updateQuery(oldResult, { subscriptionData }) {
      const nodeId = subscriptionData.data.listen.relatedNodeId;
      if (!nodeId) return oldResult;
      const nodes = oldResult.incomingCtf?.nodes.slice() ?? [];
      return {
        incomingCtf: {
          __typename: 'CtfsConnection',
          nodes: nodes.filter((ctf) => ctf.nodeId != nodeId),
        },
      };
    },
  });

  /* Watch creation */
  query.subscribeToMore<
    SubscribeToCtfCreatedSubscriptionVariables,
    SubscribeToCtfCreatedSubscription
  >({
    document: SubscribeToCtfCreatedDocument,
    updateQuery(oldResult, { subscriptionData }) {
      const node = subscriptionData.data.listen.relatedNode;
      if (!node || node.__typename != 'Ctf') return oldResult;
      const nodes = oldResult.incomingCtf?.nodes.slice() ?? [];

      const endTime = extractDate(node.endTime);
      if (endTime > new Date()) {
        nodes.push(node);
      }
      return {
        incomingCtf: {
          __typename: 'CtfsConnection',
          nodes,
        },
      };
    },
  });

  return wrappedQuery;
}

export function getPastCtfs(...args: Parameters<typeof usePastCtfsQuery>) {
  const query = usePastCtfsQuery(...args);
  const wrappedQuery = wrapQuery(query, { total: 0, ctfs: [] }, (data) => ({
    total: data.pastCtf.totalCount,
    ctfs: data.pastCtf.nodes.map(buildCtf),
  }));

  /* Watch deletion */
  query.subscribeToMore<
    SubscribeToCtfDeletedSubscriptionVariables,
    SubscribeToCtfDeletedSubscription
  >({
    document: SubscribeToCtfDeletedDocument,
    updateQuery(oldResult, { subscriptionData }) {
      const nodeId = subscriptionData.data.listen.relatedNodeId;
      if (!nodeId) return oldResult;
      const nodes = oldResult.pastCtf?.nodes.slice() ?? [];
      const newNodes = nodes.filter((ctf) => ctf.nodeId != nodeId);
      return {
        pastCtf: {
          __typename: 'CtfsConnection',
          nodes: newNodes,
          totalCount: (oldResult.pastCtf?.totalCount ?? 0) - 1,
        },
      };
    },
  });

  /* Watch creation */
  query.subscribeToMore<
    SubscribeToCtfCreatedSubscriptionVariables,
    SubscribeToCtfCreatedSubscription
  >({
    document: SubscribeToCtfCreatedDocument,
    updateQuery(oldResult, { subscriptionData }) {
      const node = subscriptionData.data.listen.relatedNode;
      if (!node || node.__typename != 'Ctf') return oldResult;
      const nodes = oldResult.pastCtf?.nodes.slice() ?? [];

      const endTime = extractDate(node.endTime);
      if (endTime < new Date()) {
        nodes.push(node);
        nodes.sort((a, b) =>
          Number(new Date(a.startTime)) > Number(new Date(b.startTime))
            ? -1
            : Number(new Date(a.startTime)) < Number(new Date(b.startTime))
            ? 1
            : 0
        );
      }
      return {
        pastCtf: {
          __typename: 'CtfsConnection',
          nodes,
          totalCount: (oldResult.pastCtf?.totalCount ?? 0) + 1,
        },
      };
    },
  });

  return wrappedQuery;
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
  return (ctf: CtfInput) => mutate(ctf);
}

export function useDeleteCtf() {
  const { mutate } = useDeleteCtfbyIdMutation({});
  return (ctf: Ctf) => mutate({ id: ctf.id });
}

export function useUpdateCtf() {
  const { mutate } = useUpdateCtfByIdMutation({});
  return (ctf: Ctf, patch: CtfPatch) => mutate({ id: ctf.id, ...patch });
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
