module.exports.before = {
  async create(ctx, next) {
    console.log(`   HOOK - user.before.create`);
    await new Promise(r => setTimeout(r, 1000)); // simulate some delay
    return next();
  },
};

module.exports.after = {
  async create(ctx) {
    console.log(`   HOOK - user.after.create`);
    console.log(ctx.response.body.toJSON())
  },
  // async get(ctx) {
  //   console.log('user/:id *AFTER* hook, here\'s the body:', ctx.body);
  //   await new Promise(r => setTimeout(r, 500));
  // },
};
