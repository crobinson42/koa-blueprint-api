// todo: move all js-data resources to a package
// const { DataStore, Mappers } = require('@therms/js-data-resources');

module.exports = {
  ...Services.JSDataCRUD(Models.organization),

  test(ctx) {
    ctx.body = 'woohoo you were here!'
  }
};
