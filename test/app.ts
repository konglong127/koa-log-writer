import koa from 'koa';
import wlog from '../index';
const app = new koa();

app.use(wlog({
  print:true,
  logPath:'./log',
  logSize:50340
}));

app.use(async (ctx, next) => {
  ctx.log.write({
    type: 'query',
    info: `this middleware passed111\n`
  });

  await next();
});

app.use(async (ctx, next) => {
  ctx.log.write({
    type: 'query',
    info: `this middleware passed2222\n`
  });

  await next();
});

app.use(async (ctx, next) => {
  if (ctx.request.url === '/' && ctx.request.method == 'GET') {
    ctx.response.body = 'ok';
    ctx.log.write({
      type: 'api',
      info: `write\n`
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
