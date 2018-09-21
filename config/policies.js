module.exports = {
  '*': true,
  organization: {
    '*': 'jwt',
    test: true,
  },
  user: {
    create: ['isAdmin'],
  },
};
