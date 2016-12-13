const fs = require('fs');
const koa = require('koa');
const https = require('https');
const serve = require('koa-static');
const ssl = require('koa-sslify');
const router = require('koa-router')();

const PORT = 4443;
const app = koa();

app.use(ssl());
app.use(serve('.'));

const records = JSON.parse(fs.readFileSync('records.json').toString());
router.get('/new_record/:record', function* (next) {
  const record = this.query.record;
  const now = (new Date()).toLocaleString();
  records[now] = record;
  fs.writeFileSync('records.json', JSON.stringify(records));
  yield next;
});
router.get('/api_rank', function* (next) {
  this.body = JSON.stringify(records);
  yield next;
});

app.use(router.routes())
    .use(router.allowedMethods());

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
