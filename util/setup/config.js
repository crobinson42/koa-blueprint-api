/* global _config */
const debug = require('debug')('setup:config');
const _ = require('lodash');
const { locked } = require('../responses');

function addPolicy(policy, list) {
  switch (typeof policy) {
    case 'function':
      list.push(policy);
      break;
    case 'array':
      list.push(...policy);
      break;
    case 'boolean':
      if (!policy) {
        list.push(locked);
      }
      break;
    default:
      break;
  }

  return list;
}

function getPolicyValue(controller, method) {
  return _.get(_config.policies, `${controller}.${method}`, undefined);
}

module.exports = function setupHooks() {
  // register Hooks helper method
  Object.defineProperty(global._config, '_getPolicyList', {
    enumerable: false,
    value: ({ controller, method }) => {
      const policies = [];

      if (!_config.policies || typeof _config.policies !== 'object') {
        debug('config/policies.js does not exist or is not exporting an object');
        return policies;
      }

      const policy = getPolicyValue(controller, method);

      // first look for explicit controller.method policies
      addPolicy(policy, policies);
      // if no specific policies were added, look for wildcards next
      if (!policies.length) {
        if (_config.policies[controller] && _config.policies[controller]['*']) {
          // first check controller level wildcards
          addPolicy(_config.policies[controller]['*']);
        } else if (_config.policies && _config.policies['*']) {
          // then check for top level wildcards last
          addPolicy(_config.policies['*']);
        }
      }

      if (policies.length) {
        debug('policies', policies)
      }

      return policies;
    },
    writable: false,
  });
};
