import { ParsedTask, Parser } from '.';
import { parseJsonStrict } from '../utils';

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
        },
      ]
    >(s);
    if (data == null) {
      return [];
    }

    for (const challenge of data) {
      if (
        !challenge.description ||
        !challenge.name ||
        !Array.isArray(challenge.categories)
      ) {
        continue;
      }

      tasks.push({
        title: challenge.name,
        tags: challenge.categories,
        description: challenge.description,
      });
    }
    return tasks;
  },
};

export default justCTFParser;
