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

      tasks.push({
        title: challenge.name,
        tags: challenge.categories,
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
