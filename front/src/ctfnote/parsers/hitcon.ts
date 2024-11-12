import { ParsedTask, Parser } from '.';
import { parseJsonStrict } from '../utils';

const HitconParser: Parser = {
  name: 'HITCONCTF parser',
  hint: 'paste hitcon /dashboard/challenge_data',
  parse(s): ParsedTask[] {
    const tasks: ParsedTask[] = [];
    const data =
      parseJsonStrict<
        [{ name: string; category: string; description: string }]
      >(s);
    if (data == null) {
      return [];
    }

    for (const challenge of data) {
      if (!challenge.description || !challenge.name) {
        continue;
      }

      tasks.push({
        title: challenge.name,
        tags: challenge.category.split(','),
        description: challenge.description,
      });
    }

    return tasks;
  },
};

export default HitconParser;
