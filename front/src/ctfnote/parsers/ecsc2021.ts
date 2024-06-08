import { ParsedTask, Parser } from '.';
import { parseJson, parseJsonStrict } from '../utils';

const ECSC2021Parser: Parser = {
  name: 'ECSC 2021 (Prague) parser',
  hint: 'paste ECSC platform /stats.json',

  parse(s: string): ParsedTask[] {
    const tasks = [];
    const data = parseJsonStrict<[{ task: string; contract: string }]>(s);
    if (!Array.isArray(data)) {
      return [];
    }

    for (const task of data) {
      if (!task.task || !task.contract) {
        continue;
      }
      tasks.push({ title: task.task, tags: [task.contract] });
    }
    return tasks;
  },
  isValid(s) {
    const data = parseJson<[{ task: string; contract: string }]>(s);
    return Array.isArray(data);
  },
};

export default ECSC2021Parser;
