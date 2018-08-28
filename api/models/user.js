const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://example.com/product.schema.json',
  title: 'Product',
  properties: {
    name: { type: 'string' },
    last: 'string',
  },
  required: ['last'],
};

// This throws because the schema isn't valid! awesome! Make sure this happens at runtime
// ajv.compile(schema);

// const validator = (data) => {
//   const valid = ajv.validate(schema, data);
//
//   if (!valid) console.log(ajv.errors);
// };
//
// console.log(validator({ name: 123 }));

// module.exports = {
//   schema,
//   validator,
// };
