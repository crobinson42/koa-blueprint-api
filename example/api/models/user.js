// schema is optional
const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'user',
  description: 'A User',

  properties: {
    id: 'string',
    name: { type: 'string' },
    last: 'string',
  },

  // required: ["last"]
};

Services.store.defineMapper('user', {
  // schema,

  relations: {
    belongsTo: {
      organization: {
        foreignKey: 'organization',
        localField: 'org',
      },
    },
  },
});

module.exports = Services.store.getMapper('user');
