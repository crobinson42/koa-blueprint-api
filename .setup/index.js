process.env.NODE_ENV = process.env.NODE_ENV || "development";
require("dotenv-flow").config();

module.exports = function setupApp(opts = {}) {
  // Order matters - run all setup/helper initialization
  require("./setup/globals")(opts.globals);
  // Load helpers
  require('./setup/helpers')(opts.helpers);

  // Setup app
  const app = require("./setup/app")(opts.app);

  return app;
};
