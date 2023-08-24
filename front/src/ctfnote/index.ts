import * as admin from './admin';
import * as auth from './auth';
import * as ctfs from './ctfs';
import * as me from './me';
import * as profiles from './profiles';
import * as settings from './settings';
import * as tasks from './tasks';
import * as ui from './ui';
import * as utils from './utils';
import * as uploads from './uploads';
import * as search from './search';
import * as tags from './tags';

export const ctfnote = {
  profiles,
  auth,
  settings,
  me,
  admin,
  ctfs,
  ui,
  tasks,
  utils,
  uploads,
  search,
  tags,
};

export type Ctfnote = typeof ctfnote;

export default ctfnote;
