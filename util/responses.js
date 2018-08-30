module.exports = {
  locked(ctx) {
    ctx.status = 423;
    ctx.body = 'locked';
  },
  notImplemented(ctx) {
    console.log(`NOT IMPLEMENTED - ${ctx.method} ${ctx.url}`);
    ctx.status = 501;
    ctx.body = 'not implemented';
  },
};
