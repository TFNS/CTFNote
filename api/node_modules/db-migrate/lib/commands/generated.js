
'use strict';

const path = require('path');

const files = {
  "check": require('./check.js'),
  "create-migration": require('./create-migration.js'),
  "db": require('./db.js'),
  "down": require('./down.js'),
  "dump": require('./dump.js'),
  "fn/plugin": require('./fn/plugin.js'),
  "generated": require('./generated.js'),
  "helper/assert": require('./helper/assert.js'),
  "helper/load-config": require('./helper/load-config.js'),
  "helper/migration-hook": require('./helper/migration-hook.js'),
  "helper/register-events": require('./helper/register-events.js'),
  "index": require('./index.js'),
  "on-complete": require('./on-complete.js'),
  "run": require('./run.js'),
  "seed": require('./seed.js'),
  "set-default-argv": require('./set-default-argv.js'),
  "sync": require('./sync.js'),
  "transition": require('./transition.js'),
  "undo-seed": require('./undo-seed.js'),
  "up": require('./up.js')
}

function register (module) {
  return files[module];
}

module.exports = register;
