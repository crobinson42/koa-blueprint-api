const chalk = require('chalk');
// setup our app framework
const app = require('./util/setup');

app.listen(process.env.PORT, () => console.log(
  chalk.yellow.bgBlue(`Server running on port ${process.env.PORT}`),
));
