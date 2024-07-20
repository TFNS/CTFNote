import { ParsedTask, Parser } from '.';
import { parseJsonStrict } from '../utils';

const ImaginaryParser: Parser = {
  name: 'ImaginaryCTF parser',
  hint: 'paste imaginary /api/challenges/released',
  parse(s): ParsedTask[] {
    const tasks: ParsedTask[] = [];
    const data =
      parseJsonStrict<
        [{ title: string; category: string; description: string }]
      >(s);
    if (data == null) {
      return [];
    }

    for (const challenge of data) {
      if (!challenge.description || !challenge.title) {
        continue;
      }

      tasks.push({
        title: challenge.title,
        tags: [challenge.category],
        description: challenge.description,
      });
    }

    return tasks;
  },
  isValid(s) {
    const data =
      parseJsonStrict<
        [
          {
            title: string;
            category: string;
            description: string;
            release_date: string;
          }
        ]
      >(s);
    if (data == null || data.length < 1) {
      return false;
    }
    return (
      data[0].title != null &&
      data[0].category != null &&
      data[0].description != null &&
      data[0].release_date != null
    );
  },
};

export default ImaginaryParser;
