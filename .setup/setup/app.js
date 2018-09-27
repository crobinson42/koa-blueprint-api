/* global _config, Controllers, Hooks */
const Koa = require("koa");
const Router = require("koa-router");
const { notImplemented } = require("../util/responses");


module.exports = function setupApp(opts = {}) {
  const app = new Koa();
  const router = new Router();

  // load controller routes on koa-router
  Object.entries(Controllers).forEach(([ctrlName, controller]) => {
    const controllerName = ctrlName.toLowerCase();

    // add non CRUD controller methods
    Object.entries(controller)
    // order matters - add CRUD methods after custom named methods
      .filter(
        ([key]) => !["find", "get", "create", "update", "destroy"].includes(key)
      )
      .forEach(([methodName, method]) => {
        const ctrlMthdCustomRouteConfigList = _config._getControllerMethodCustomRouteList({
          controller: ctrlName,
          method: methodName
        });
        const methodMiddleware = [
          ..._config._getControllerMethodPolicyList({
            controller: ctrlName,
            method: methodName
          }),
          ...Hooks._getControllerMethodHookList({
            controller: ctrlName,
            method: methodName
          })
        ];

        // if a route(s) is defined for this controller.method - use it
        if (ctrlMthdCustomRouteConfigList) {
          // we get back a list since a method can have multiple custom routes defined
          ctrlMthdCustomRouteConfigList.forEach(route => {
            const routerMethod = (route.method || "all").toLocaleLowerCase();
            router[routerMethod](
              route.path,
              ...methodMiddleware,
              method
            );
          })
        } else {
          // if no route is defined, default to all http methods for controller.method
          router.all(
            `/${controllerName}/${methodName}`,
            ...methodMiddleware,
            method
          );
        }
      });

    // todo: currently not implementing CRUD methods custom routing from config/routes.js

    router.get(
      `/${controllerName}`,
      ..._config._getControllerMethodPolicyList({
        controller: ctrlName,
        method: "find"
      }),
      ...Hooks._getControllerMethodHookList({
        controller: ctrlName,
        method: "find"
      }),
      controller.find || notImplemented
    );
    router.get(
      `/${controllerName}/:id`,
      ..._config._getControllerMethodPolicyList({
        controller: ctrlName,
        method: "get"
      }),
      ...Hooks._getControllerMethodHookList({
        controller: ctrlName,
        method: "get"
      }),
      controller.get || notImplemented
    );
    router.post(
      `/${controllerName}`,
      ..._config._getControllerMethodPolicyList({
        controller: ctrlName,
        method: "create"
      }),
      ...Hooks._getControllerMethodHookList({
        controller: ctrlName,
        method: "create"
      }),
      controller.create || notImplemented
    );
    router.put(
      `/${controllerName}/:id`,
      ..._config._getControllerMethodPolicyList({
        controller: ctrlName,
        method: "update"
      }),
      ...Hooks._getControllerMethodHookList({
        controller: ctrlName,
        method: "update"
      }),
      controller.update || notImplemented
    );
    router.del(
      `/${controllerName}/:id`,
      ..._config._getControllerMethodPolicyList({
        controller: ctrlName,
        method: "destroy"
      }),
      ...Hooks._getControllerMethodHookList({
        controller: ctrlName,
        method: "destroy"
      }),
      controller.destroy || notImplemented
    );
  });

  // load middleware
  if (Array.isArray(_config.middleware)) {
    _config.middleware.forEach(middleware => app.use(middleware));
  }

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};
