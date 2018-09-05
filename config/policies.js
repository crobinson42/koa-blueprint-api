module.exports = {
  '*': true,
  organization: {
    '*': 'jwt',
  },
  user: {
    create: ['isAdmin'],
  },
};
