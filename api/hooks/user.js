module.exports.before = {
  async find(ctx) {
    console.log('user ~BEFORE~ hook');
    await new Promise(r => setTimeout(r, 500));
  },
};

module.exports.after = {
  async find(ctx) {
    console.log('user *AFTER* hook');
    await new Promise(r => setTimeout(r, 500));
  },
};
