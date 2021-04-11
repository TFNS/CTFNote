#!/usr/bin/env node
import { mixed } from '../interfaces';
export declare type AddFlagFn = (optionString: string, description: string, parse?: (option: string) => mixed) => AddFlagFn;
