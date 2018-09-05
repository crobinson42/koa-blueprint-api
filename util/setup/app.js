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
        ([key]) => !['find', 'get', 'create', 'update', 'delete'].includes(key),
      )
      .forEach(([methodName, method]) => {
        router.all(
          `/${controllerName}/${methodName}`,
          ..._config._getPolicyList({
            controller: ctrlName,
            method: methodName,
          }),
          ...Hooks._getHookList({ controller: ctrlName, method: methodName }),
          method,
        );
      });

    router.get(
      `/${controllerName}`,
      ..._config._getPolicyList({ controller: ctrlName, method: 'find' }),
      ...Hooks._getHookList({ controller: ctrlName, method: 'find' }),
      controller.find || notImplemented,
    );
    router.get(
      `/${controllerName}/:id`,
      ..._config._getPolicyList({ controller: ctrlName, method: 'get' }),
      ...Hooks._getHookList({ controller: ctrlName, method: 'get' }),
      controller.get || notImplemented,
    );
    router.post(
      `/${controllerName}`,
      ..._config._getPolicyList({ controller: ctrlName, method: 'create' }),
      ...Hooks._getHookList({ controller: ctrlName, method: 'create' }),
      controller.create || notImplemented,
    );
    router.put(
      `/${controllerName}/:id`,
      ..._config._getPolicyList({ controller: ctrlName, method: 'update' }),
      ...Hooks._getHookList({ controller: ctrlName, method: 'update' }),
      controller.update || notImplemented,
    );
    router.del(
      `/${controllerName}/:id`,
      ..._config._getPolicyList({ controller: ctrlName, method: 'delete' }),
      ...Hooks._getHookList({ controller: ctrlName, method: 'delete' }),
      controller.delete || notImplemented,
    );
  });

  // load middleware
  app.use.call(app, ..._config.middleware);

  app.use(router.routes());

  return app;
};
