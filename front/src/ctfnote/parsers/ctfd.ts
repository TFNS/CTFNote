import { ParsedTask, Parser } from '.';
import { parseJson, parseJsonStrict } from '../utils';

interface CTFdTags {
  value: string;
}

const CTFDParser: Parser = {
  name: 'CTFd/RCTF parser',
  hint: 'paste ctfd /api/v1/challenges or rctf /api/v1/challs',

  parse(s: string): ParsedTask[] {
    const tasks = [];
    const data = parseJsonStrict<{
      data: { name: string; category: string; tags: CTFdTags[] }[];
    }>(s);
    if (!Array.isArray(data?.data)) {
      return [];
    }
    for (const task of data.data) {
      if (!task.name || !task.category) {
        continue;
      }
      const tags: Set<string> = new Set();
      if (task.tags != null && Array.isArray(task.tags))
        task.tags.forEach((t) => tags.add(t.value));

      tags.add(task.category);
      tasks.push({ title: task.name, tags: Array.from(tags.values()) });
    }
    return tasks;
  },
  isValid(s) {
    const data = parseJson<{ data?: unknown }>(s);
    return Array.isArray(data?.data);
  },
};

export default CTFDParser;
