module.exports = {
  '*': true,
  organization: {
    '*': 'jwt',
    test: true,
  },
  region: false,
  user: {
    create: ['isAdmin'],
    destroy: false,
  },
};
