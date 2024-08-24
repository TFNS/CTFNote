import { ParsedTask, Parser } from '.';
import { parseJsonStrict } from '../utils';

const AngstromParser: Parser = {
  name: 'ångstromCTF parser',
  hint: 'paste api.angstromctf.com/competitions/XX/challenges with XX being the event id',

  parse(s: string): ParsedTask[] {
    const tasks = [];
    const data =
      parseJsonStrict<
        Array<{ title: string; category: string; description: string }>
      >(s);
    if (!Array.isArray(data)) {
      return [];
    }
    for (const task of data) {
      if (!task.title || !task.category) {
        continue;
      }
      tasks.push({
        title: task.title,
        tags: [task.category],
        description: task.description,
      });
    }
    return tasks;
  },
};

export default AngstromParser;
