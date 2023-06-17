import CTFDParser from './ctfd';
import ECSCParser from './ecsc';
import RawParser from './raw';
import HTBParser from './htb';
import PicoParser from './pico';

export type ParsedTask = {
  title: string;
  tags: string[];
  description?: string;
  keep?: boolean;
};

export type Parser = {
  name: string;
  hint: string;
  isValid(s: string): boolean;
  parse(s: string): ParsedTask[];
};

export default [RawParser, CTFDParser, ECSCParser, HTBParser, PicoParser];
