import { ParsedTask, Parser } from '.';
import { parseJsonStrict } from '../utils';

const KITCTFParser: Parser = {
  name: 'KITCTF parser',
  hint: 'paste /api/challenges',

  parse(s: string): ParsedTask[] {
    const tasks = [];
    const data =
      parseJsonStrict<
        Array<{ name: string; tags: string[]; description: string }>
      >(s);
    if (!Array.isArray(data)) {
      return [];
    }
    for (const task of data) {
      if (!task.name || !task.tags) {
        continue;
      }
      tasks.push({
        title: task.name,
        tags: task.tags,
        description: task.description,
      });
    }
    return tasks;
  },
};

export default KITCTFParser;
