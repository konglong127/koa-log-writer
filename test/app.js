const koa = require('koa');
const app = new koa();
const wlog = require('../index');
const router = require('koa-route');

app.use(wlog({
  print: true,		//Output or not, default true
  logPath: './log',	//log path, default './log'
  logSize: 102400,		//log file size, default 51200
  extension: 'txt'
}));

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
    try {
      throw new Error('oh no');
    } catch (error) {
      ctx.log.write({
        type: 'error',
        info: error
      });
      ctx.repsonse.body = '500';
    }

  })
);

app.use(async (ctx, next) => {
  ctx.log.write({
    type: 'query',
    info: `pass\n`
  });

  await next();
});

app.use(async (ctx, next) => {
  for (let i = 0; i < 3000; ++i) {
    ctx.log.write({
      type: 'query',
      info: `${JSON.stringify(ctx.request)}\n`
    });
  }
  await next();
});

app.use(async (ctx, next) => {
  if (ctx.request.url === '/' && ctx.request.method == 'GET') {
    ctx.response.body = 'ok';
    for (let i = 0; i < 3000; ++i) {
      ctx.log.write({
        type: 'api',
        info: `${JSON.stringify(ctx.request)}\n`
      });
    }
  } else if (ctx.request.url === '/abc' && ctx.request.method == 'GET') {
    ctx.response.body = 'abc';
  } else {
    ctx.response.body = 'others';
  }
  await next();
});


module.exports = app;
// app.listen(8080, () => {
//   console.log('127.0.0.1:8080');
// });
