## config/middleware.js

Middleware is ran before anything else in the application. The file `config/middleware.js` must export an array of valid koa methods. 

> If you write custom middleware and experience a "hang" you might be missing `return next()` 
at the end of your method

```js
// Addtional Koa middleware:
// https://github.com/koajs/compress
// https://github.com/koajs/send
// https://github.com/venables/koa-helmet
// https://github.com/koajs/ratelimit
// https://github.com/koajs/rewrite

module.exports = [
  require('koa-logger')(),
  require('koa-useragent'),
  require('@koa/cors')(),
  require('koa-body')(),

  // catch errors
  async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      // return custom error message
        ctx.status = 400;
        ctx.body = { message: 'Error' };
    }
  },
];

```

### Common Middleware

This package exports common middleware to be used. 

Example use:

```
// config/middleware.js

const { getCommonMiddleware } = require('koa-blueprint-api');

const commonMiddlewareOpts = {}; // optional

module.exports = [
  ...getCommonMiddleware(commonMiddlewareOpts),
  
  // add your own middlware here
  (ctx, next) => { ... }
];
```
