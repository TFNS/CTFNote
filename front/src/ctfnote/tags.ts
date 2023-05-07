/* Builders */
import {
  TagFragment,
  useAddTagsForTaskMutation,
  useGetTagsQuery,
} from 'src/generated/graphql';
import { Id, makeId, Tag, Task } from './models';
import { wrapQuery } from './utils';
import { Ref, InjectionKey, provide, inject } from 'vue';

export function buildTag(t: TagFragment): Tag {
  return {
    ...t,
    id: makeId(t.id),
  };
}

export function tagsSortFn(a: Task, b: Task): number {
  for (const tagA of a.assignedTags) {
    for (const tagB of b.assignedTags) {
      const result = tagA.tag
        .toLocaleLowerCase()
        .localeCompare(tagB.tag.toLocaleLowerCase());
      if (result != 0) {
        return result;
      }
    }
  }

  return 0;
}

/* Global provider  */
const TagsSymbol: InjectionKey<Ref<Tag[]>> = Symbol('tags');

export function provideTags() {
  const { result: tags } = getTags();
  provide(TagsSymbol, tags);
  return tags;
}

export function injectTags() {
  const tags = inject(TagsSymbol);
  if (!tags) {
    throw 'ERROR';
  }

  return tags;
}

/* Queries */
export function getTags() {
  const query = useGetTagsQuery();
  const wrappedQuery = wrapQuery(
    query,
    [],
    (data) => data.tags?.nodes.map(buildTag) ?? []
  );

  /* Watch deletion */
  // query.subscribeToMore<
  //   SubscribeToTagDeletedSubscriptionVariables,
  //   SubscribeToTagDeletedSubscription
  // >({
  //   document: SubscribeToTagDeletedDocument,
  //   updateQuery(oldResult, { subscriptionData }) {
  //     const nodeId = subscriptionData.data.listen.relatedNodeId;
  //     if (!nodeId) return oldResult;
  //     const nodes = oldResult.tags?.nodes.slice() ?? [];
  //     const newNodes = nodes.filter((tag) => tag.nodeId != nodeId);
  //     return {
  //       tags: {
  //         __typename: 'TagsConnection',
  //         nodes: newNodes,
  //       },
  //     };
  //   },
  // });

  // /* Watch creation */
  // query.subscribeToMore<
  //   SubscribeToTagCreatedSubscriptionVariables,
  //   SubscribeToTagCreatedSubscription
  // >({
  //   document: SubscribeToTagCreatedDocument,
  //   updateQuery(oldResult, { subscriptionData }) {
  //     console.log('NEW TAG DATA CREATED', oldResult, subscriptionData);
  //     const node = subscriptionData.data.listen.relatedNode;
  //     if (!node || node.__typename != 'Tag') return oldResult;
  //     const nodes = oldResult.tags?.nodes.slice() ?? [];

  //     return {
  //       tags: {
  //         __typename: 'TagsConnection',
  //         nodes,
  //       },
  //     };
  //   },
  // });
  return wrappedQuery;
}

/* Mutations */
// export function useCreateTag() {
//   const { mutate } = useCreateTagMutation({});
//   return (tag: TagInput) => mutate(tag);
// }

// export function useCreateAssignedTags() {
//   const { mutate: createAssignedTag } = useCreateAssignedTagMutation({});
//   return (tagId: Id<Tag>, taskId: Id<Task>) =>
//     createAssignedTag({ tagId: tagId, taskId: taskId });
// }

export function useAddTagsForTask() {
  const { mutate: addTagsForTask } = useAddTagsForTaskMutation({});
  return (tags: Array<string>, taskId: Id<Task>) => {
    if (tags.length > 0) return addTagsForTask({ tags: tags, taskId: taskId });
  };
}

/* Functions */
// export async function getTagId(tag: string): Promise<Id<Tag>> {
//   const tags = provideTags();
//   const createTag = useCreateTag();
//   let foundTag: Id<Tag> | undefined | null = tags.value.find(
//     (t) => t.tag == tag
//   )?.id;
//   if (!foundTag) {
//     const result = await createTag({ tag: tag.toLowerCase() });
//     if (result?.data?.createTag?.tag) {
//       foundTag = makeId<Tag>(result.data.createTag.tag.id);
//     }
//   }
//   if (!foundTag) {
//     throw 'ERROR!';
//   }

//   return foundTag;
// }

// export async function getTagIds(tags: string[]): Promise<Array<Id<Tag>>> {
//   return Promise.all(tags.map(async (t) => await getTagId(t)));
// }
