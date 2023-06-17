import { ParsedTask, Parser } from '.';

const RawParser: Parser = {
  name: 'Raw parser',
  hint: 'name | tag 1 | tag 2 | tag 3',
  parse(s): ParsedTask[] {
    const tasks: ParsedTask[] = [];
    for (const line of s.trim().split('\n')) {
      const [title_str, ...tag_str] = line.split('|');
      const title = title_str.trim();
      const tags = [];
      for (const tag of tag_str) {
        tags.push(tag.toString().trim());
      }
      if (!title || !tags) {
        continue;
      }
      tasks.push({ title, tags });
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
