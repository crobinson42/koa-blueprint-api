module.exports = {
  async create(ctx) {
    // todo: DBname.create()
    ctx.body = { name: 'Region Name' };
  },

  async destroy(ctx) {
    // todo: DBname.destry()
  },

  async find(ctx) {
    // todo: DBname.find()
    ctx.body = { name: 'Region Name' };
  },

  async get(ctx) {
    ctx.body = { id: ctx.params.id, name: 'Region Name' };
  },

  test(ctx) {
    ctx.body = 'Region!!'
  }
};
