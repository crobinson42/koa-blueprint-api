module.exports.before = {
  async find(ctx, next) {
    console.log('user ~BEFORE~ hook');
    // await new Promise(r => setTimeout(r, 500));
    return next();
  },
};

module.exports.after = {
  async find(ctx) {
    console.log('user *AFTER* hook, here\'s the body:', ctx.body);
    await new Promise(r => setTimeout(r, 500));
  },
  async get(ctx) {
    console.log('user/:id *AFTER* hook, here\'s the body:', ctx.body);
    await new Promise(r => setTimeout(r, 500));
  },
};
