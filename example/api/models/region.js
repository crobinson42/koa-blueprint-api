// schema is optional
const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "region",
  description: "An Organization Region",

  properties: {
    id: "string",
    name: { type: "string" }
  },

  required: []
};

Services.store.defineMapper({
  name: "region",
  schema
});

module.exports = Services.store.getMapper("region");
