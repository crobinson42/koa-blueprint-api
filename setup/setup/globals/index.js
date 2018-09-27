const path = require('path');
const debug = require('debug')('kba:setup:globals');

const { getDirFileList, loadGlobals } = require('./helpers');

const defaultOpts = {};
const defaultDirPaths = {
  configDir: './config',
  servicesDir: './api/services',
  modelsDir: './api/models',
  policiesDir: './api/policies',
  hooksDir: './api/hooks',
  controllersDir: './api/controllers',
};

// load/register globals from /api dir
module.exports = function setupGlobals(opts = {}) {
  debug(`options ${JSON.stringify(opts)}`);

  let _opts = {
    ...defaultOpts,
    ...defaultDirPaths,
  };

  if (opts.root) {
    // re-assign dirPaths with opts.root
    Object.keys(defaultDirPaths).forEach(pathKey => {
      _opts[pathKey] = path.join(opts.root, _opts[pathKey]);
    });
  }

  // in case the opts contains any dirPath keys, we layover the defaults
  Object.assign(_opts, opts);

  debug(`final options ${JSON.stringify(opts)}`);

  /**
   ****** ORDER MATTERS ******
   * Do NOT change order - app
   * and controllers relies on
   * this order of loading
   */
  debug(`loading configDir`);
  loadGlobals('_config', getDirFileList(_opts.configDir));
  debug(`configDir loaded`);

  debug(`loading servicesDir`);
  loadGlobals('Services', getDirFileList(_opts.servicesDir));
  debug(`servicesDir loaded`);

  debug(`loading modelsDir`);
  loadGlobals('Models', getDirFileList(_opts.modelsDir));
  debug(`modelsDir loaded`);

  debug(`loading policiesDir`);
  loadGlobals('Policies', getDirFileList(_opts.policiesDir));
  debug(`policiesDir loaded`);

  debug(`loading hooksDir`);
  loadGlobals('Hooks', getDirFileList(_opts.hooksDir));
  debug(`hooksDir loaded`);

  debug(`loading controllersDir`);
  loadGlobals('Controllers', getDirFileList(_opts.controllersDir));
  debug(`controllersDir loaded`);
};
