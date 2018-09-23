/* global _config, Policies */
const debug = require("debug")("setup:helper:routes");
const _ = require("lodash");
const isObject = require("isobject");

module.exports = function setupRoutes() {
  // Convenience helper method to get custom defined route for a controller/method
  Object.defineProperty(global._config, "_getControllerMethodCustomRouteList", {
    enumerable: false,
    value: getControllerMethodCustomRouteList,
    writable: false
  });
};

function getControllerMethodCustomRouteList({ controller, method }) {
  if (!_config.routes) return undefined;
  else if (!isObject(_config.routes)) throw new Error('config/routes.js must export an object');

  const ctrlMethodCustomRoutes = getCtrlMethodCustomRouteConfig(_config.routes, controller, method);

  if (!ctrlMethodCustomRoutes.length)
    return undefined;

  debug(`Loaded ${ctrlMethodCustomRoutes.length} custom route for ${controller}.${method}`)
  ctrlMethodCustomRoutes.forEach(({ method: httpMthd, path }) => {
    debug(`   ${httpMthd || 'ALL'} ${path} --> ${controller}.${method}()`);
  });

  return ctrlMethodCustomRoutes; // Array<{ method: string, path: string }>
}

function getCtrlMethodCustomRouteConfig(routesObject, controller, method) {
  const controllerMethods = Object.entries(routesObject);

  const routes = [];

  controllerMethods.forEach((route) => {
    const [path, ctrlMethodString] = route;
    if (ctrlMethodString === `${controller}.${method}`) {
      routes.push({
        method: getRouteHTTPMethod(path),
        path: getRoutePath(path),
      })
    }
  });

  return routes;
}

function getRouteHTTPMethod(routePath) {
  const rgxp = /^(GET|POST|PUT|DELETE)+ /.exec(routePath)
  if (!rgxp) return undefined;
  return rgxp[0].replace(' ', '');
}

function getRoutePath(routePath) {
  const method = getRouteHTTPMethod(routePath);
  if (method) {
    return routePath.substr(method.length).replace(' ', ''); // start after the whitespace following the method
  }
  return routePath.replace(' ', '');
}