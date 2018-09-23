const { getDirFileList, loadGlobals } = require('./helpers');

const defaultOpts = {
  configDir: './config',
  servicesDir: './api/services',
  modelsDir: './api/models',
  policiesDir: './api/policies',
  hooksDir: './api/hooks',
  controllersDir: './api/controllers',
};

// load/register globals from /api dir
module.exports = function setupGlobals(opts = {}) {
  const _opts = {
    ...defaultOpts,
    ...opts
  };

  /**
   ****** ORDER MATTERS ******
   * Do NOT change order - app
   * and controllers relies on
   * this order of loading
   */
  loadGlobals('_config', getDirFileList(_opts.configDir));
  loadGlobals('Services', getDirFileList(_opts.servicesDir));
  loadGlobals('Models', getDirFileList(_opts.modelsDir));
  loadGlobals('Policies', getDirFileList(_opts.policiesDir));
  loadGlobals('Hooks', getDirFileList(_opts.hooksDir));
  loadGlobals('Controllers', getDirFileList(_opts.controllersDir));
};
