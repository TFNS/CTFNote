import * as admin from './admin';
import * as auth from './auth';
import * as ctfs from './ctfs';
import * as dialogs from './dialog';
import * as me from './me';
import * as settings from './settings';
import * as tasks from './tasks';
import * as profiles from './profiles';
export * from './models';

export const ctfnote = {
  profiles,
  auth,
  settings,
  me,
  admin,
  ctfs,
  dialogs,
  tasks,
};

export type Ctfnote = typeof ctfnote;
