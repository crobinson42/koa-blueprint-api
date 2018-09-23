// todo: add https://www.npmjs.com/package/command-line-args

const chalk = require('chalk');
// setup our app framework
const app = require('./app-setup/index')();

app.listen(process.env.PORT, () => console.log(
  chalk.yellow.bgBlue(`Server running on port ${process.env.PORT}`),
));

