const qs = require('qs');

module.exports = {
  test(ctx) {
    // ctx.body = 'test'
    ctx.body = `user.test() :option = ${ctx.params.id}`;
  },
};
