// schema is optional
const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "organization",
  description: "An Organization",

  properties: {
    id: "string",
    name: { type: "string" }
  },

  required: []
};

Services.store.defineMapper("organization",{
  // schema,
});

module.exports = Services.store.getMapper("organization");
