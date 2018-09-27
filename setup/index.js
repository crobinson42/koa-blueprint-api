process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const debug = require('debug')('kba:setup');

/**
 * options:
 * {
 *   root: string // root dir
 *   globals: object // passed to globals setup
 *   helpers: object // passed to helpers setup
 * }
 */
module.exports = function setupApp(opts = {}) {
  debug(`options ${JSON.stringify(opts)}`);

  require('dotenv-flow').config({ cwd: opts.root });

  debug('initializing globals');
  // Order matters - run all setup/helper initialization
  require('./setup/globals')({ ...opts.globals, root: opts.root });
  debug('globals initialized');

  debug('initializing helpers');
  // Load helpers
  require('./setup/helpers')(opts.helpers);
  debug('helpers initialized');

  debug('initializing app');
  // Setup app
  const app = require('./setup/app')(opts.app);
  debug('app initialized');

  return app;
};
