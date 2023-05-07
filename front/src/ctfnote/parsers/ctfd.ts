import { ParsedTask, Parser } from '.';
import { parseJson, parseJsonStrict } from '../utils';

const CTFDParser: Parser = {
  name: 'CTFd/RCTF parser',
  hint: 'paste ctfd /api/v1/challenges or rctf /api/v1/challs',

  parse(s: string): ParsedTask[] {
    const tasks = [];
    const data = parseJsonStrict<{
      data: { name: string; category: string }[];
    }>(s);
    if (!Array.isArray(data?.data)) {
      return [];
    }
    for (const task of data.data) {
      if (!task.name || !task.category) {
        continue;
      }
      tasks.push({ title: task.name, tags: [task.category] });
    }
    return tasks;
  },
  isValid(s) {
    const data = parseJson<{ data?: unknown }>(s);
    return Array.isArray(data?.data);
  },
};

export default CTFDParser;
