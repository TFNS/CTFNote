import CTFDParser from './ctfd';
import ECSCParser from './ecsc';
import RawParser from './raw';

export type ParsedTask = {
  title: string;
  category: string;
};

export type Parser = {
  name: string;
  hint: string;
  isValid(s: string): boolean;
  parse(s: string): ParsedTask[];
};

export default [RawParser, CTFDParser, ECSCParser];
