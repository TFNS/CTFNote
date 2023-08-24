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

  return wrappedQuery;
}

/* Mutations */
export function useAddTagsForTask() {
  const { mutate: addTagsForTask } = useAddTagsForTaskMutation({});
  return (tags: Array<string>, taskId: Id<Task>) =>
    addTagsForTask({ tags: tags, taskId: taskId });
}
