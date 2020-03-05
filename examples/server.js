const path = require('path');
const fs = require('fs');
const { exec, fork } = require('child_process');
// require('shelljs/global');

const koa = require('koa');
const static = require('koa-static');
const open = require('open');

const sdkProcess = exec('npm run dev:dist', {
  cwd: path.resolve(__dirname)
}, (err, stdout, stderr) => {
  if (err) {
    console.log('子进程开启失败:' + err);
    process.exit();
  } else {
    console.log('子进程标准输出\r\n' + stdout.toString());
  }
})

// https://github.com/shelljs/shelljs/blob/master/src/exec.js
sdkProcess.stdout.pipe(process.stdout);
sdkProcess.stderr.pipe(process.stderr);

// exec('npm run dev:dist', { async: true })

const app = new koa();
app.use(static(path.resolve(__dirname, '../dist')));

app.use(async (ctx, next) => {
  if (ctx.path == '/') {
    const html = fs.readFileSync(__dirname + '/index.html', {
      encoding: 'utf8'
    })
    ctx.body = html;
  }
})

app.listen(8080);
open('http://localhost:8080');