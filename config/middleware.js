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
  // health - https://github.com/AlexeyKhristov/koa-ping
  require('koa-ping')('/health'),
  // (ctx, next) => {
  //   console.log(`${ctx.method} ${ctx.url}`);
  //   return next();
  // },

  // https://github.com/dlau/koa-body
  require('koa-body')({
    jsonLimit: `${process.env.MAX_REQ_BODY_SIZE_KB}kb`,
  }),
];
