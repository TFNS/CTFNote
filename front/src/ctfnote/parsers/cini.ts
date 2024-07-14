import { ParsedTask, Parser } from '.';
import { parseJson, parseJsonStrict } from '../utils';

interface Events {
  gamePause?: unknown;
  events: [
    {
      id: number;
      name: string;
      sections: [
        {
          id: number;
          name: string;
          challenges: [
            {
              id: number;
              title: string;
              tags: string[];
              authors: string[];
              currentScore: number;
              currentGlobalSolves: number;
              hidden: boolean;
            }
          ];
        }
      ];
    }
  ];
}

const CINIParser: Parser = {
  name: 'Cybersecurity National Lab (CINI) platform and ECSC 2024 (Turin) parser',
  hint: 'paste platform /api/challenges',

  parse(s: string): ParsedTask[] {
    const tasks = [];
    const data = parseJsonStrict<Events>(s);

    for (const event of data.events) {
      for (const section of event.sections) {
        for (const chall of section.challenges) {
          tasks.push({ title: chall.title, tags: chall.tags });
        }
      }
    }

    return tasks;
  },
  isValid(s) {
    const data = parseJson<Events>(s);
    if (data == null) return false;
    return data.gamePause !== undefined && data.events !== undefined;
  },
};

export default CINIParser;
