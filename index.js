const humanize = require('humanize-number')
const chalk = require('chalk')
const sizeof = require('object-sizeof')
const writerLogger = require('./write');
const fs = require('fs');

const colorCodes = {
  7: 'magenta',
  5: 'red',
  4: 'yellow',
  3: 'cyan',
  2: 'green',
  1: 'green',
  0: 'yellow'
}

function logger(opts) {
  opts = opts || {};
  opts.print = 'print' in opts ? opts.print : true;
  opts.logPath = 'logPath' in opts ? opts.logPath : './log';
  opts.logSize = 'logSize' in opts ? opts.logSize : 50430;
  opts.log = 'log' in opts ? opts.log : false;
  const { print, logPath, logSize, log } = opts;

  return async function (ctx, next) {

    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath);
    }

    ctx.log = new writerLogger({ logPath, logSize });
    //ctx.sizeof=sizeof;

    if (print) {
      const start = ctx[Symbol.for('request-received.startTime')] ?
        ctx[Symbol.for('request-received.startTime')].getTime() :
        Date.now();

      const size = sizeof(ctx.request.params)
        + sizeof(ctx.request.body) + sizeof(ctx.request.query);

      const logInfo =
        '  ' + chalk.gray('<--') +
        ' ' + chalk.bold(ctx.method) +
        ' ' + chalk.gray(ctx.host) + chalk.gray(ctx.originalUrl) +
        ' ' + chalk.gray(size + 'b');

      ctx.log.logInfo = logInfo;

      if (typeof (log) === 'function') {
        log(logInfo);
      }

      console.log(logInfo);

      try {
        await next();

        ResponseLogPrint(ctx, start, sizeof(ctx.response.body || null), null);

      } catch (err) {

        ResponseLogPrint(ctx, start, sizeof(ctx.response.body || null), err);

        throw err;
      }
    } else {
      await next();
    }


  }
}

function ResponseLogPrint(ctx, start, size, err) {

  const status = err
    ? (err.isBoom ? err.output.statusCode : err.status || 500)
    : (ctx.status || 404);

  const s = status / 100 | 0;

  // const color = colorCodes.hasOwnProperty(s) ? colorCodes[s] : colorCodes[0];
  const color = colorCodes[s] !== undefined ? colorCodes[s] : colorCodes[0];

  if (~[204, 205, 304].indexOf(status) || size == null) {
    size = '0';
  }

  const upstream = err ? chalk.red('xxx')
    : chalk.gray('-->');

  const logInfo = '  ' + upstream +
    ' ' + chalk.bold(ctx.method) +
    ' ' + chalk.gray(ctx.host) + chalk.gray(ctx.originalUrl) +
    ' ' + chalk[color](status) +
    ' ' + chalk.gray(time(start)) +
    ' ' + chalk.gray(size + 'b');

  ctx.log.logInfo = logInfo;

  console.log(logInfo);
}

function time(start) {

  const delta = Date.now() - start;

  return humanize(delta < 10000
    ? delta + 'ms'
    : Math.round(delta / 1000) + 's');
}

module.exports = logger;