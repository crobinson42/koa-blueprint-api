const { Container } = require("js-data");

const MongoDBAdapter = require("./mongoAdapter");

const adapter = new MongoDBAdapter({
  debug: false,
  uri: "mongodb://localhost:27017/js-data-test"
});

const store = new Container();

store.registerAdapter("mongo", adapter, { default: true });

module.exports = store;
