const koa = require('koa');
const app = new koa();
const wlog = require('./index');

app.use(wlog());

app.use(async (ctx, next) => {
  ctx.log.write({
    type: 'query',
    info: `1111111111111111111111111111\n`
  });

  await next();
});

app.use(async (ctx, next) => {
  ctx.log.write({
    type: 'query',
    info: `22222222222222222222222222\n`
  });
  ctx.log.write({
    type: 'query',
    info: `33333333333333333333333333\n`
  });
  await next();
});

app.use(async (ctx, next) => {
  if (ctx.request.url === '/' && ctx.request.method == 'GET') {
    ctx.response.body = 'ok';
    ctx.log.write({
      type: 'api',
      info: `write111\n`
    });
  } else if (ctx.request.url === '/abc' && ctx.request.method == 'GET') {
    ctx.response.body = 'abc';
  } else {
    ctx.response.body = 'others';
  }
  await next();
});

app.listen(8080, () => {
  console.log('127.0.0.1:8080');
});
