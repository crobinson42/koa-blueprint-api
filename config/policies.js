module.exports = {
  '*': 'jwt',
  organization: {
    '*': false,
  },
  user: {
    create: 'isAdmin',
  },
};
