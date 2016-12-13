const fs = require('fs');
const koa = require('koa');
const https = require('https');
const serve = require('koa-static');
const ssl = require('koa-sslify');

const PORT = 4443;
const app = koa();

app.use(ssl());
app.use(serve('.'));

// index page
app.use(function* (next) {
  this.body = 'hello world from ' + this.request.url;
  yield next;
});

// SSL options
const options = {
  key: fs.readFileSync('cert/server.key'),
  cert: fs.readFileSync('cert/server.crt')
};

// start the server
// http.createServer(app.callback()).listen(80);
https.createServer(options, app.callback()).listen(PORT);

// 运行成功，输出提示
console.log(`Server runing at port: ${PORT}`);
