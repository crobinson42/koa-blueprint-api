/* global _config, Controllers, Hooks */

const Koa = require('koa');
const Router = require('koa-router');
const { notImplemented } = require('../responses');

module.exports = function setupApp() {
  const app = new Koa();
  const router = new Router();

  // load controller routes
  Object.entries(Controllers).forEach(([ctrlName, controller]) => {
    const controllerName = ctrlName.toLowerCase();

    Object.entries(controller)
      // order matters - add these CRUD methods after custom named methods
      .filter(
        ([key]) => !['find', 'get', 'create', 'update', 'destroy'].includes(key),
      )
      .forEach(([methodName, method]) => {
        router.all(
          `/${controllerName}/${methodName}`,
          ..._config._getControllerMethodPolicyList({
            controller: ctrlName,
            method: methodName,
          }),
          ...Hooks._getControllerMethodHookList({ controller: ctrlName, method: methodName }),
          method,
        );
      });

    router.get(
      `/${controllerName}`,
      ..._config._getControllerMethodPolicyList({ controller: ctrlName, method: 'find' }),
      ...Hooks._getControllerMethodHookList({ controller: ctrlName, method: 'find' }),
      controller.find || notImplemented,
    );
    router.get(
      `/${controllerName}/:id`,
      ..._config._getControllerMethodPolicyList({ controller: ctrlName, method: 'get' }),
      ...Hooks._getControllerMethodHookList({ controller: ctrlName, method: 'get' }),
      controller.get || notImplemented,
    );
    router.post(
      `/${controllerName}`,
      ..._config._getControllerMethodPolicyList({ controller: ctrlName, method: 'create' }),
      ...Hooks._getControllerMethodHookList({ controller: ctrlName, method: 'create' }),
      controller.create || notImplemented,
    );
    router.put(
      `/${controllerName}/:id`,
      ..._config._getControllerMethodPolicyList({ controller: ctrlName, method: 'update' }),
      ...Hooks._getControllerMethodHookList({ controller: ctrlName, method: 'update' }),
      controller.update || notImplemented,
    );
    router.del(
      `/${controllerName}/:id`,
      ..._config._getControllerMethodPolicyList({ controller: ctrlName, method: 'destroy' }),
      ...Hooks._getControllerMethodHookList({ controller: ctrlName, method: 'destroy' }),
      controller.destroy || notImplemented,
    );
  });

  // load middleware
  if (Array.isArray(_config.middleware)) {
    _config.middleware.forEach(middleware => app.use(middleware))
  }
  
  app.use(router.routes());
  return app;
};
