import { ParsedTask, Parser } from '.';
import { parseJson, parseJsonStrict } from '../utils';

const justCTFParser: Parser = {
  name: 'justCTF parser',
  hint: 'paste /api/v1/tasks',

  parse(s: string): ParsedTask[] {
    const tasks = [];
    const data = parseJsonStrict<
      [
        {
          id: number;
          name: string;
          categories: [string];
          difficult: string;
          description: string;
          points: number;
          solvers: number;
        }
      ]
    >(s);
    if (data == null) {
      return [];
    }

    for (const challenge of data) {
      if (!challenge.description || !challenge.name) {
        continue;
      }
      let category = 'unknown';

      // as soon as CTFNote supports tags, we can rewrite this
      // and maybe add the difficulty as a tag as well
      if (challenge.categories.length > 0) category = challenge.categories[0];

      tasks.push({
        title: challenge.name,
        category: category,
        description: challenge.description,
      });
    }
    return tasks;
  },
  isValid(s) {
    const data = parseJson<
      [
        {
          id: number;
          name: string;
          categories: [string];
          difficult: string;
          description: string;
          points: number;
          solvers: number;
        }
      ]
    >(s);
    return (
      data != null &&
      data?.length > 0 &&
      data[0].id != null &&
      data[0].name != null &&
      Array.isArray(data[0].categories) &&
      data[0].points != null
    );
  },
};

export default justCTFParser;
