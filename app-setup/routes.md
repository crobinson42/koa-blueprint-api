## config/routes.js

Define custom URL routes to map to controller methods in `config/routes.js`.

Optionally restrict to only route on a specific HTTP method to a controller method
by prefixing the route with the HTTP method (DELETE, GET, POST, PUT). If the HTTP
method is ommitted then all requests that match the path will be routed to the 
controller method. 

>NOTE: You can only define custom routing on NON CRUD methods. All controller methods
that are mapped to a CRUD operation will be ignored, which includes: `create`, `destroy`, 
`find`, `get`, & `update`. 

#### Format 

`'[HTTP Method] [url path]': '[controller].[method]'`

> You can define url params, ie: `/user/:id` and they will be made available
on the koa context, ie: `ctx.params.id`. You can define an optional url param
by placing a question mark ("?") at the end of the url param, ie: `/user/:id?`


```js
// config/routes.js
module.exports = {
  'GET /user/test/:param1/:param2?': 'user.testMethod',
  // or omit the HTTP method and will default to route all HTTP methods
  '/user/test/:param1/:param2': 'user.testMethod'
};
``` 

```js
// api/controllers/user.js
module.exports = {
  testMethod(ctx) {
    ctx.body = `response -> route param1 = ${ctx.param1}, optional route param2 = ${ctx.param2}`
  }
};
``` 

> Uses `koa-router` library