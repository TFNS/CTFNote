import { useSearchCtFsQuery } from 'src/generated/graphql';
import { wrapQuery } from 'src/ctfnote/utils';
import { buildCtf } from './ctfs';

export function useSearchCtfs(search: string) {
    const q = useSearchCtFsQuery({ search });

    const query = wrapQuery(q, null, (data) => {
        return data.searchCtfs.edges.map(e => buildCtf(e.node));
    });
    return query;
}