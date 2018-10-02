const { Store } = require('@therms/models');

// module.exports = Store.getMapper('user');

// schema is optional
const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'user',
  description: 'A User',

  // properties: {
  //   id: 'string',
  //   name: { type: 'string' },
  //   last: 'string',
  // },

  // required: ["last"]
};

// Services.store.defineMapper('user', {
Store.defineMapper('user', {
  // schema,

  relations: {
    belongsTo: {
      organization: {
        foreignKey: 'id',
        localField: 'org',
      },
    },
  },
});
//
module.exports = Store.getMapper('user');
