# koa-log-writer

Writing and printing middleware for koa.

# Install

```
npm install koa-log-writer
```

# Example

```
const koa = require('koa');
const app = new koa();
const wlog = require('koa-log-writer');

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
```

# Config

```
app.use(wlog({
  print:true,		//Output or not
  logPath:'./log',	//log path
  logSize:50340		//log file size
}));

```

# Output

```
 <-- GET 127.0.0.1:8080/ 0b
  --> GET 127.0.0.1:8080/ 200 9ms 4b
  <-- GET 127.0.0.1:8080/favicon.ico 0b
  --> GET 127.0.0.1:8080/favicon.ico 200 3ms 12b
```
