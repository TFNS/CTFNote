import { useApolloClient } from '@vue/apollo-composable';
import {
  SearchAllDocument,
  SearchAllQuery,
  SearchCtFsDocument,
  SearchCtFsQuery,
  SearchTagsDocument,
  SearchTagsQuery,
  SearchTasksDocument,
  SearchTasksQuery,
} from 'src/generated/graphql';
import { buildCtf, buildTask } from './ctfs';
import { Ctf, Task } from './models';
import { ApolloQueryResult } from '@apollo/client';

export async function searchCtfs(search: string): Promise<Ctf[]> {
  const { client } = useApolloClient();

  const result = await client.query<SearchCtFsQuery>({
    query: SearchCtFsDocument,
    variables: {
      search,
    },
  });

  if (!result.data.ctfs) return [];

  return result.data.ctfs?.nodes.map((c) => buildCtf(c));
}

export async function searchTasks(search: string): Promise<Task[]> {
  const { client } = useApolloClient();

  const result = await client.query<SearchTasksQuery>({
    query: SearchTasksDocument,
    variables: {
      search,
    },
  });

  if (!result.data.tasks) return [];

  return result.data.tasks?.nodes.map((t) => buildTask(t));
}

export async function searchTags(search: string): Promise<Task[]> {
  const { client } = useApolloClient();

  const result = await client.query<SearchTagsQuery>({
    query: SearchTagsDocument,
    variables: {
      search,
    },
  });

  if (!result.data.tags) return [];

  return result.data.tags?.nodes.flatMap((n) =>
    n.tasksByAssignedTagTagIdAndTaskId.nodes.map((t) => buildTask(t))
  );
}

export async function searchAll(search: string): Promise<Array<Task | Ctf>> {
  const { client } = useApolloClient();

  const result: ApolloQueryResult<SearchAllQuery> =
    await client.query<SearchAllQuery>({
      query: SearchAllDocument,
      variables: {
        search,
      },
    });

  let returnValue: Array<Task | Ctf> = [];

  if (result.data.ctfs) {
    returnValue = returnValue.concat(
      result.data.ctfs?.nodes.map((t) => buildCtf(t))
    );
  }

  if (result.data.tasks) {
    returnValue = returnValue.concat(
      result.data.tasks?.nodes.map((t) => buildTask(t))
    );
  }

  if (result.data.tags) {
    returnValue = returnValue.concat(
      result.data.tags?.nodes.flatMap((n) =>
        n.tasksByAssignedTagTagIdAndTaskId.nodes.map((t) => buildTask(t))
      )
    );
  }

  return returnValue;
}
