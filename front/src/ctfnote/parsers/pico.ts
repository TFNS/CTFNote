import { ParsedTask, Parser } from '.';
import { parseJson, parseJsonStrict } from '../utils';

const PicoParser: Parser = {
  name: 'picoCTF parser',
  hint: 'paste /api/challenges/?page_size=500&page=1&event=XX with XX being the event id of the running ctf',

  parse(s: string): ParsedTask[] {
    const tasks = [];
    const data = parseJsonStrict<{
      results: Array<{ name: string; category: { name: string } }>;
    }>(s);
    if (!Array.isArray(data?.results)) {
      return [];
    }
    for (const task of data.results) {
      if (!task.name || !task.category) {
        continue;
      }
      tasks.push({ title: task.name, tags: [task.category.name] });
    }
    return tasks;
  },
  isValid(s) {
    const data = parseJson<{ results?: unknown }>(s);
    return Array.isArray(data?.results);
  },
};

export default PicoParser;
