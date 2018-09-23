/* eslint-disable global-require */

// todo: add https://github.com/koajs/compress
// todo: add https://github.com/koajs/send
// todo: add https://github.com/venables/koa-helmet
// todo: add https://github.com/koajs/ratelimit
// todo: just in case https://github.com/koajs/rewrite

// todo: replace ? https://github.com/tunnckoCore/koa-better-body

// koa middleware applied in order
module.exports = [
  require('koa-logger')(),
  require('koa-useragent'),
  require('@koa/cors')(),
  require('koa-body')({ // https://github.com/dlau/koa-body
    // jsonLimit: `${process.env.MAX_REQ_BODY_SIZE_KB}kb`, // default 1mb
  }),

  // Patch request query to be an object for operating on it as an Object
  (ctx, next) => {
    if (ctx.request.query && typeof ctx.request.query === 'object') {
      // node.js removed the Object.prototype on querystring https://github.com/nodejs/node/pull/6055
      // coerce query to inherit from Object.prototype
      Object.defineProperty(ctx.request, 'query',{
        value: { ...ctx.request.query },
        writable: false
      });
      Object.defineProperty(ctx, 'query',{
        value: { ...ctx.request.query },
        writable: false
      });
    }

    return next();
  },

  // JS-Data throw catch
  async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      // JS-Data will throw on validation failure w/ an errors array & message
      if (e && e.errors) {
        ctx.status = 422;
        ctx.body = { message: e.message, errors: e.errors };
      } else {
        throw e;
      }
    }
  },
];
