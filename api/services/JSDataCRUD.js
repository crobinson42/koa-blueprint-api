const { Mapper } = require("js-data");

module.exports = function jsDataCRUD(jsDataMapper) {
  const mapper =
    (typeof jsDataMapper === "string" && Models[jsDataMapper]) || jsDataMapper;

  if (!mapper instanceof Mapper)
    throw new Error(
      "jsDataCRUD.js param must be a string for a JS-Data Model that exports a Mapper or a JS-Data Mapper"
    );

  return {
    async create(ctx) {
      await mapper
        .create(ctx.request.body)
        .then(records => (ctx.body = records));
    },

    async destroy(ctx) {
      await mapper.destroy(ctx.params.id).then(records => (ctx.body = records));
    },

    async find(ctx) {
      await mapper.findAll(ctx.request.query).then(records => {
        ctx.body = records;
      });
    },

    async get(ctx) {
      await mapper.find(ctx.params.id).then(records => {
        ctx.body = records;
      });
    },

    async update(ctx) {
      await mapper
        .update(ctx.params.id, ctx.request.body)
        .then(records => (ctx.body = records));
    }
  };
};
