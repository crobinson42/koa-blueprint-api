
module.exports = function loadHelpers(opts = {}) {
  require("./hooks")(opts.hooks);
  require("./policies")(opts.policies);
  require("./routes")(opts.routes);
};