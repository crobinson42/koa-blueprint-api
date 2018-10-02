module.exports = {
  ...Services.JSDataCRUD(Models.organization),

  test(ctx) {
    ctx.body = 'woohoo you were here!'
  }
};
