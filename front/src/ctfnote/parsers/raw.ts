import { Parser } from '.';

const RawParser: Parser = {
  name: 'Raw parser',
  hint: 'name | category',
  parse(s) {
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

export default RawParser;
