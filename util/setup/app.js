/* global Controllers, Hooks */

const Koa = require('koa');
const Router = require('koa-router');
const middleware = require('../../config/middleware'); // todo: try/catch is this file required
const { koaNotImplemented } = require('../responses');

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
          ...Hooks._getHookList({ controller: ctrlName, method: methodName }),
          method,
        );
      });

    router.get(
      `/${controllerName}`,
      ...Hooks._getHookList({ controller: ctrlName, method: 'find' }),
      controller.find || koaNotImplemented,
    );
    router.get(
      `/${controllerName}/:id`,
      ...Hooks._getHookList({ controller: ctrlName, method: 'get' }),
      controller.get || koaNotImplemented,
    );
    router.post(
      `/${controllerName}`,
      ...Hooks._getHookList({ controller: ctrlName, method: 'create' }),
      controller.create || koaNotImplemented,
    );
    router.put(
      `/${controllerName}/:id`,
      ...Hooks._getHookList({ controller: ctrlName, method: 'update' }),
      controller.update || koaNotImplemented,
    );
    router.del(
      `/${controllerName}/:id`,
      ...Hooks._getHookList({ controller: ctrlName, method: 'delete' }),
      controller.delete || koaNotImplemented,
    );
  });

  // load middleware
  app.use.call(app, ...middleware);

  app.use(router.routes());

  return app;
};
