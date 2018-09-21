module.exports = {
  async create(ctx) {
    // todo: DBname.create()
    ctx.body = { name: 'Company Name' };
  },

  async find(ctx) {
    // todo: DBname.find()
    ctx.body = { name: 'Company Name' };
  },

  async get(ctx) {
    ctx.body = { id: ctx.params.id, name: 'Company Name' };
  },

  test(ctx) {
    ctx.body = 'woohoo you were here!'
  }
};
