const koa = require('koa');
const app = new koa();
const wlog = require('../index');
const router = require('koa-route');

app.use(wlog());

app.use(
  router.get('/200', function (ctx) {
    ctx.body = 'hello world';
  })
);

app.use(
  router.get('/301', function (ctx) {
    ctx.status = 301;
  })
);

app.use(
  router.get('/304', function (ctx) {
    ctx.status = 304;
  })
);

app.use(
  router.get('/404', function (ctx) {
    ctx.status = 404;
    ctx.body = 'not found';
  })
);

app.use(
  router.get('/500', function (ctx) {
    ctx.status = 500;
    ctx.body = 'server error';
  })
);

app.use(
  router.get('/error', function (ctx) {
    try{
      throw new Error('oh no');
    }catch(error){
      ctx.log.write({
        type: 'error',
        info: error
      });
      ctx.repsonse.body='500';
    }
    
  })
);

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


module.exports=app;
// app.listen(8080, () => {
//   console.log('127.0.0.1:8080');
// });
