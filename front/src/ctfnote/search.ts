import { useApolloClient } from '@vue/apollo-composable';
import { SearchCtFsDocument, SearchCtFsQuery, SearchTasksDocument, SearchTasksQuery } from 'src/generated/graphql';
import { buildCtf, buildTask } from './ctfs';
import { Ctf, Task } from './models';

export async function searchCtfs(search: string): Promise<Ctf[]> {
    const { client } = useApolloClient();

    const result = await client.query<SearchCtFsQuery>({
        query: SearchCtFsDocument,
        variables: {
            search
        }
    });

    if (!result.data.ctfs) return [];

    return result.data.ctfs?.nodes.map(c => buildCtf(c));
}

export async function searchTasks(search: string): Promise<Task[]> {
    const { client } = useApolloClient();

    const result = await client.query<SearchTasksQuery>({
        query: SearchTasksDocument,
        variables: {
            search
        }
    });

    if (!result.data.tasks) return [];

    return result.data.tasks?.nodes.map(t => buildTask(t));
}