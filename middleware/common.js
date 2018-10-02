/* eslint-disable global-require */
// common middleware
const qs = require('qs')

// eslint-disable-next-line no-unused-vars
module.exports = (opts = {}) => [
  require('koa-logger')(),
  require('koa-useragent'),
  require('@koa/cors')(),
  require('koa-body')({
    // jsonLimit: `${process.env.MAX_REQ_BODY_SIZE_KB}kb`, // default 1mb
  }),
  require('koa-respond')(),

  // query string nesting is not supported out of the box because there's no spec
  // we use the qs lib if a querystring is on the request
  (ctx, next) => {
    if (ctx.querystring) {
      const def = {
        configurable: true,
        value: qs.parse(ctx.querystring),
        writable: false,
      }
      Object.defineProperty(ctx, 'query', def)
      Object.defineProperty(ctx.request, 'query', def)
    }

    return next()
  },

  // Patch request query to be an object for operating on it as an Object
  // this is because node.js strips down the prototype for performance/speed
  (ctx, next) => {
    if (ctx.request.query && typeof ctx.request.query === 'object') {
      // node.js removed the Object.prototype on querystring https://github.com/nodejs/node/pull/6055
      // coerce query to inherit from Object.prototype
      const def = {
        value: { ...ctx.request.query },
        writable: false,
      }
      Object.defineProperty(ctx.request, 'query', def)
      Object.defineProperty(ctx, 'query', def)
    }

    return next()
  },

  // JS-Data querystring's contain JSON.stringified "where" value
  // we must JSON.parse them if they exist
  (ctx, next) => {
    if (ctx.query && ctx.query.where) {
      try {
        const def = {
          configurable: true,
          value: {
            ...ctx.query,
            where: JSON.parse(ctx.query.where),
          },
          writable: false,
        }
        Object.defineProperty(ctx, 'query', def)
        Object.defineProperty(ctx.request, 'query', def)
      } catch (e) {
        throw new Error('Unable to parse "where" in querystring')
      }
    }

    return next()
  },

  // JS-Data throw catch
  async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      // JS-Data will throw on validation failure w/ an errors array & message
      if (e && e.errors) {
        ctx.status = 422
        ctx.body = { message: e.message, errors: e.errors }
      } else {
        throw e
      }
    }
  },
]
