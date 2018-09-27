/* global _config, Controllers, Hooks */
const debug = require('debug')('kba:setup:app');
const Koa = require('koa');
const Router = require('koa-router');
const { notImplemented } = require('../util/responses');


module.exports = function setupApp(opts = {}) {
  debug('running "setupApp()"');

  const app = new Koa();
  debug('koa initialized');
  const router = new Router();
  debug('koa-router initialized');

  debug('loading Controllers routes to koa-router');
  // load controller routes on koa-router
  Object.entries(Controllers).forEach(([ctrlName, controller]) => {
    debug(`loading Controller "${ctrlName}" routes`);
    const controllerName = ctrlName.toLowerCase();

    // add non CRUD controller methods
    Object.entries(controller)
    // order matters - add CRUD methods after custom named methods
      .filter(
        ([key]) => !['find', 'get', 'create', 'update', 'destroy'].includes(key),
      )
      .forEach(([methodName, method]) => {
        debug(`   loading ${methodName}`);
        const ctrlMthdCustomRouteConfigList = _config._getControllerMethodCustomRouteList({
          controller: ctrlName,
          method: methodName,
        });
        const methodMiddleware = [
          ..._config._getControllerMethodPolicyList({
            controller: ctrlName,
            method: methodName,
          }),
          ...Hooks._getControllerMethodHookList({
            controller: ctrlName,
            method: methodName,
          }),
        ];

        // if a route(s) is defined for this controller.method - use it
        if (ctrlMthdCustomRouteConfigList) {
          // we get back a list since a method can have multiple custom routes defined
          ctrlMthdCustomRouteConfigList.forEach((route) => {
            const routerMethod = (route.method || 'all').toLocaleLowerCase();
            router[routerMethod](
              route.path,
              ...methodMiddleware,
              method,
            );
          });
        } else {
          // if no route is defined, default to all http methods for controller.method
          router.all(
            `/${controllerName}/${methodName}`,
            ...methodMiddleware,
            method,
          );
        }
      });

    // todo: currently not implementing CRUD methods custom routing from config/routes.js
    debug('   loading CRUD routes');
    router.get(
      `/${controllerName}`,
      ..._config._getControllerMethodPolicyList({
        controller: ctrlName,
        method: 'find',
      }),
      ...Hooks._getControllerMethodHookList({
        controller: ctrlName,
        method: 'find',
      }),
      controller.find || notImplemented,
    );
    router.get(
      `/${controllerName}/:id`,
      ..._config._getControllerMethodPolicyList({
        controller: ctrlName,
        method: 'get',
      }),
      ...Hooks._getControllerMethodHookList({
        controller: ctrlName,
        method: 'get',
      }),
      controller.get || notImplemented,
    );
    router.post(
      `/${controllerName}`,
      ..._config._getControllerMethodPolicyList({
        controller: ctrlName,
        method: 'create',
      }),
      ...Hooks._getControllerMethodHookList({
        controller: ctrlName,
        method: 'create',
      }),
      controller.create || notImplemented,
    );
    router.put(
      `/${controllerName}/:id`,
      ..._config._getControllerMethodPolicyList({
        controller: ctrlName,
        method: 'update',
      }),
      ...Hooks._getControllerMethodHookList({
        controller: ctrlName,
        method: 'update',
      }),
      controller.update || notImplemented,
    );
    router.del(
      `/${controllerName}/:id`,
      ..._config._getControllerMethodPolicyList({
        controller: ctrlName,
        method: 'destroy',
      }),
      ...Hooks._getControllerMethodHookList({
        controller: ctrlName,
        method: 'destroy',
      }),
      controller.destroy || notImplemented,
    );
  });
  debug('all controller routes loaded');

  debug('loading middleware');
  // load middleware
  if (Array.isArray(_config.middleware)) {
    _config.middleware.forEach(middleware => app.use(middleware));
  }

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};
