// todo: add https://www.npmjs.com/package/command-line-args

const chalk = require('chalk');
// setup our app/framework
const app = require('../setup/index')({
  app: {
    // optionally pass your own Koa instance
    koaInstance: undefined,
    // optionally set a router prefix
    prefix: '/api',
  },
  root: __dirname
});

// require('koa-qs')(app);

app.listen(process.env.PORT, () => console.log(
  chalk.yellow.bgBlue(`Server running on port ${process.env.PORT}`),
));
