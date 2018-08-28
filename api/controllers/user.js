module.exports = {
  async create(ctx) {
    // todo: DBname.create()
    ctx.body = { name: 'cory' };
  },

  async find(ctx) {
    // todo: DBname.find()
    ctx.body = { name: 'cory' };
  },

  async get(ctx) {
    ctx.body = { id: ctx.params.id, name: 'cory' };
  },

  test(ctx) {
    ctx.body = 'test';
  },
};
