/* global Controllers */

// setup our app framework
require('./util/setup');

const Koa = require('koa');
const Router = require('koa-router');
const middleware = require('./config/middleware');

const app = new Koa();
const router = new Router();

// load controller routes
Object.entries(Controllers).forEach(([ctrlName, controller]) => {
  const controllerName = ctrlName.toLowerCase();

  Object.entries(controller)
    // order matters - add these CRUD methods after custom named methods
    .filter(([key]) => !['find', 'get', 'create', 'update', 'delete'].includes(key))
    .forEach(([methodName, method]) => {
      router.all(
        `/${controllerName}/${methodName}`,
        method,
      );
    });

  router.get(`/${controllerName}`, controller.find);
  router.get(`/${controllerName}/:id`, controller.get);
  router.post(`/${controllerName}`, controller.create);
  router.put(`/${controllerName}/:id`, controller.update);
  router.del(`/${controllerName}/:id`, controller.delete);
});

// load middleware
app.use.call(app, ...middleware);

app.use(router.routes());

app.listen(process.env.PORT, () => console.log('Server running on port', process.env.PORT));
