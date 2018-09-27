const jwt = require('koa-jwt');

module.exports = jwt({ secret: process.env.SECRET || 'shared-secret' });
