module.exports = {
  ...Services.JSDataCRUD('region'),

  test(ctx) {
    ctx.body = "Region!!";
  }
};
