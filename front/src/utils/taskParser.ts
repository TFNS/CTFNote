import { parseJson, parseJsonStrict } from './index';

type ParsedTask = {
  title: string;
  category: string;
};

type Parser = {
  name: string;
  hint: string;
  isValid(s: string): boolean;
  parse(s: string): ParsedTask[];
};

const RawParser: Parser = {
  name: 'Raw parser',
  hint: 'name | category',
  parse(s: string): ParsedTask[] {
    const tasks = [];
    for (const line of s.trim().split('\n')) {
      const [title_str, ...category_str] = line.split('|');
      const title = title_str.trim();
      const category = category_str.join('|').trim();
      if (!title || !category) {
        continue;
      }
      tasks.push({ title, category });
    }
    return tasks;
  },
  isValid(s) {
    return s
      .trim()
      .split('\n')
      .every((s) => /[^|]+\|[^|]+/.exec(s));
  },
};

const CTFDParser: Parser = {
  name: 'CTFd parser',
  hint: 'paste ctfd /api/v1/challenge',

  parse(s: string): ParsedTask[] {
    const tasks = [];
    const data =
      parseJsonStrict<{ data: { name: string; category: string }[] }>(s);
    if (!Array.isArray(data?.data)) {
      return [];
    }
    for (const task of data.data) {
      if (!task.name || !task.category) {
        continue;
      }
      tasks.push({ title: task.name, category: task.category });
    }
    return tasks;
  },
  isValid(s) {
    const data = parseJson<{ data?: unknown }>(s);
    return Array.isArray(data?.data);
  },
};




export default [RawParser, CTFDParser];
