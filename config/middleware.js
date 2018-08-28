const koaBody = require('koa-body');

// koa middleware applied in order
module.exports = [
  // req logger
  (ctx, next) => {
    console.log(`${ctx.method} ${ctx.url}`);
    next();
  },

  koaBody({
    jsonLimit: `${process.env.MAX_REQ_BODY_SIZE_KB}kb`,
  }),
];
