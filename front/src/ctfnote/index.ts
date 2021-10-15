import * as admin from './admin';
import * as auth from './auth';
import * as ctfs from './ctfs';
import * as dialogs from './dialog';
import * as me from './me';
import * as menu from './menu';
import * as settings from './settings';
import * as tasks from './tasks';
import * as profiles from './profiles'
export * from './models';
export * from './symbols';

export const ctfnote = {
  profiles,
  auth,
  settings,
  me,
  admin,
  ctfs,
  dialogs,
  tasks,
  menu,
};

export type Ctfnote = typeof ctfnote;
