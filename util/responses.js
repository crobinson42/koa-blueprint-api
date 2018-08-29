module.exports = {
  koaNotImplemented(ctx) {
    console.log(`NOT IMPLEMENTED - ${ctx.method} ${ctx.url}`);
    ctx.status = 501;
    ctx.body = 'not implemented';
  },
};
