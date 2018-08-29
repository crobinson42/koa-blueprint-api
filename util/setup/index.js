process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv-flow').config();

// Order matters...
require('./globals')();
require('./hooks')();
const app = require('./app')();

module.exports = app;
