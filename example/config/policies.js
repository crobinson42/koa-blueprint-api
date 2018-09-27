module.exports = {
  '*': true,
  organization: {
    // '*': 'jwt',
    test: true,
  },
  region: false,
  user: {
    // create: ['jwt', 'isAdmin'],
    destroy: false,
  },
};
