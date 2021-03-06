/* global Hooks */
const debug = require('debug')('kba:setup:helper:hooks');

module.exports = function setupHooks() {
  // register Hooks helper method
  Object.defineProperty(global.Hooks, '_getControllerMethodHookList', {
    enumerable: false,
    value: getControllerMethodHookList,
    writable: false,
  });
};

function getControllerMethodHookList ({ controller, method }) {
  const before = [];
  const after = [];

  if (Hooks[controller]) {
    if (Hooks[controller].before && Hooks[controller].before[method]) {
      before.push(Hooks[controller].before[method]);
    }
    if (Hooks[controller].after && Hooks[controller].after[method]) {
      after.push(async (ctx, next) => {
        await next();
        try {
          Hooks[controller].after[method](ctx, () => { debug(`Hooks.after.${controller}.${method} called "next()" which is not allowed in Hooks.after methods`)});
        } catch (e) {
          debug(`Error: Hooks.${controller}.${method}`, e);
        }
      });
    }
  }

  return [...after, ...before];
}
