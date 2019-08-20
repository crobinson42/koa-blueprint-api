/* eslint-disable global-require */
// common middleware
const qs = require('qs')

// eslint-disable-next-line no-unused-vars
module.exports = (opts = {}) => [
  require('koa-logger')(opts.logger),
  require('koa-useragent'),
  require('koa-body')(opts.body),
  require('koa-respond')(opts.respond),

  // query string nesting is not supported out of the box because there's no spec
  // we use the qs lib if a querystring is on the request
  (ctx, next) => {
    if (ctx.querystring) {
      const def = {
        configurable: true,
        value: qs.parse(ctx.querystring, {
          /**
           * we want boolean & number values to not be converted strings
           *
           * Extended default behavior:
           * https://github.com/ljharb/qs/blob/master/lib/utils.js#L106
           */
          decoder(str, decoder, charset) {
            const strWithoutPlus = str.replace(/\+/g, ' ');
            if (charset === 'iso-8859-1') {
              // unescape never throws, no try...catch needed:
              return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
            }

            if (/^(\d+|\d*\.\d+)$/.test(str)) {
              return parseFloat(str)
            }

            const keywords = {
              true: true,
              false: false,
              null: null,
              undefined,
            }
            if (str in keywords) {
              return keywords[str]
            }

            // utf-8
            try {
              return decodeURIComponent(strWithoutPlus);
            } catch (e) {
              return strWithoutPlus;
            }
          },
        }),
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
