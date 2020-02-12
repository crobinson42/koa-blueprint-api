/* global _config, Policies */
const debug = require("debug")("kba:setup:helper:policies");
const _ = require("lodash");
const isObject = require('isobject');

const { locked } = require("../../util/responses");

module.exports = function setupPolicies() {
  // Convenience helper method to get policies for a controller/method
  Object.defineProperty(global._config, "_getControllerMethodPolicyList", {
    enumerable: false,
    value: getControllerMethodPolicyList,
    writable: false
  });
};

function getControllerMethodPolicyList({ controller, method }) {
  const policies = [];

  // check if policies exist or return early
  if (!_config.policies || typeof _config.policies !== "object") {
    debug("config/policies.js does not exist or is not exporting an object");
    return policies;
  }
  // check if controller has policy rule for all methods (ie: is not an object)
  else if (!isObject(getControllerPolicyValue(controller)) && getControllerPolicyValue(controller) !== undefined) {
    addPolicy(getControllerPolicyValue(controller), policies);
    return policies;
  }

  // first look for explicit controller.method policies
  if (getControllerMethodPolicyValue(controller, method) !== undefined) {
    addPolicy(getControllerMethodPolicyValue(controller, method), policies);
  }
  // if no specific policies were added, look for wildcards next
  else {
    if (controllerHasWildCard(controller)) {
      // first check controller level wildcards
      addPolicy(_config.policies[controller]["*"], policies);
    } else if (policyTopLevelHasWildCard()) {
      // then check for top level wildcards last
      addPolicy(_config.policies["*"], policies);
    }
  }

  if (policies.length) {
    debug(`Loaded ${policies.length} Policies for ${controller}.${method}`);
    debug(`   ${controller}.${method} policies:`, policies);
  }

  return policies;
}

function addPolicy(policy, list) {
  switch (typeof policy) {
    case "function":
      list.push(policy);
      break;
    case "object": // array
      if (Array.isArray(policy)) {
        list.push(
          ...policy.map(p => {
            if (Policies[p]) return Policies[p];
            throw new Error(`Policy does not exist: ${p}`);
          })
        );
      }
      break;
    case "boolean":
      if (!policy) {
        list.push(locked);
      }
      break;
    case "string":
      if (Policies[policy]) {
        list.push(Policies[policy]);
      } else {
        throw new Error(`Policy does not exist: ${policy}`);
      }
      break;
    default:
      break;
  }

  return list;
}

// Check if a controller has a policy wild card
function controllerHasWildCard(controller) {
  return (
    _config.policies[controller] &&
    Object.prototype.hasOwnProperty.call(_config.policies[controller], "*")
  );
}

function getControllerPolicyValue(controller) {
  return _.get(_config.policies, `[${controller}]`, undefined);
}

function getControllerMethodPolicyValue(controller, method) {
  return _.get(_config.policies, `[${controller}][${method}]`, undefined);
}

// check if the top level policies object has a wildcard
function policyTopLevelHasWildCard() {
  return (
    _config.policies &&
    Object.prototype.hasOwnProperty.call(_config.policies, "*")
  );
}
