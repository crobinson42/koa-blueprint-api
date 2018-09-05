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

  async update(ctx) {
    ctx.body = { id: ctx.params.id, name: 'updated!' };
  },

  test(ctx) {
    console.log('ctx.query', ctx.query)
    ctx.body = 'user/test routes, boom shakalacka';
  },
};
