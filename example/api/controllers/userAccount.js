const qs = require('qs');

module.exports = {
  ...Services.JSDataCRUD('userAccount'),

  test(ctx) {
    // ctx.body = 'test'
    ctx.body = `userAccount.test() :option = ${ctx.params.id}`;
  },
};
