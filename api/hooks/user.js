module.exports.before = {
  async find(ctx, next) {
    console.log('user ~BEFORE~ hook');
    await new Promise(r => setTimeout(r, 500));
    next();
  },
};

module.exports.after = {
  async find(ctx, next) {
    console.log('user *AFTER* hook');
    await new Promise(r => setTimeout(r, 500));
    next();
  },
};
