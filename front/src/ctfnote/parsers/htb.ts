import { ParsedTask, Parser } from '.';
import { parseJson, parseJsonStrict } from '../utils';

// output of https://ctf.hackthebox.com/api/public/challengeCategories
const challengeCategories: { [index: number]: string } = {
  1: 'Fullpwn',
  2: 'Web',
  3: 'Pwn',
  4: 'Crypto',
  5: 'Reversing',
  6: 'Stego',
  7: 'Forensics',
  8: 'Misc',
  9: 'Start',
  10: 'PCAP',
  11: 'Coding',
  12: 'Mobile',
  13: 'OSINT',
  14: 'Blockchain',
  15: 'Hardware',
  16: 'Warmup',
  17: 'Attack',
  18: 'Defence',
  20: 'Cloud',
  21: 'Scada',
  23: 'ML',
};

const HTBParser: Parser = {
  name: 'HTB parser',
  hint: 'paste https://ctf.hackthebox.com/api/ctf/<ctfid> from the network tab',

  parse(s: string): ParsedTask[] {
    const tasks = [];
    const data = parseJsonStrict<{
      challenges: Array<{
        id: number;
        name: string;
        description: string;
        challenge_category_id: number;
      }>;
    }>(s);
    if (data == null) {
      return [];
    }

    for (const challenge of data.challenges) {
      if (
        !challenge.description ||
        !challenge.name ||
        !challenge.challenge_category_id
      ) {
        continue;
      }

      let category = challengeCategories[challenge.challenge_category_id];
      if (category == null) category = 'Unknown';

      tasks.push({
        title: challenge.name,
        tags: [category],
        description: challenge.description,
      });
    }
    return tasks;
  },
  isValid(s) {
    const data = parseJson<{
      challenges: Array<{
        id: number;
        name: string;
        description: string;
        challenge_category_id: number;
      }>;
    }>(s);
    return Array.isArray(data?.challenges);
  },
};

export default HTBParser;
