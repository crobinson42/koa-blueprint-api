const qs = require('qs');

module.exports = {
  ...Services.JSDataCRUD('user'),

  test(ctx) {
    // ctx.body = 'test'
    ctx.body = `user.test() :option = ${ctx.params.id}`;
  },
};
