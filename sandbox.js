const Koa = require('koa');


const app = new Koa();

app.use(docs.get('/docs', {
  title: 'API',
  version: require('./package.json').version,

  theme: 'simplex',    // Specify a theme from www.bootswatch.com;
                       // default is un-themed bootstrap

  // routeHandlers: 'disabled',  // Hide the route implementation code from docs

  groups: [
    { groupName: 'Pets', routes: [/*  ... route specs ...  */] },
    { groupName: 'Store', routes: [/*  ... route specs ...  */] }
  ]
}));


// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
