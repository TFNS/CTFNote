import CTFDParser from './ctfd';
import ECSC2021Parser from './ecsc2021';
import RawParser from './raw';
import HTBParser from './htb';
import PicoParser from './pico';
import justCTFParser from './justctf';
import AngstromParser from './angstrom';

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

export default [
  RawParser,
  CTFDParser,
  ECSC2021Parser,
  HTBParser,
  PicoParser,
  justCTFParser,
  AngstromParser,
];
