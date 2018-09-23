process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv-flow').config();

// Order matters - run all setup/helper initialization
require('./globals')();
require('./hooks')();
require('./policies')();
require('./routes')();

// Setup app
const app = require('./app')();

module.exports = app;
