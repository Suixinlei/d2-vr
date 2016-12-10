// Node APP
var PORT = 8124;  //应用运行端口号
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");

var mime = require("./mime").types;

var server = http.createServer(function (request, response) {
	//解析请求路径
	var pathname = decodeURIComponent(url.parse(request.url).pathname);
	if (pathname.slice(-1) === "/") {
        pathname = pathname + "index.html";
    }
    console.log(pathname)
	var realPath = path.join("./", path.normalize(pathname.replace(/…/g, "")));
	//判断路径是否存在
	fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("路径 "+ pathname + " 不存在！");
            response.end();
        } else {
        	//路径存在，读取文件并返回数据
            fs.readFile(realPath, "binary", function(err, file) {
                if (err) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.end(err);
                } else {
                	//读取文件后缀名
                	var ext = path.extname(realPath);
					ext = ext ? ext.slice(1) : "unknown";
					//根据文件后缀名查找对应的MIME类型值并返回
					var contentType = mime[ext] || "text/plain";
					
                    response.writeHead(200, {"Content-Type": contentType});
                    response.write(file, "binary");
                    response.end();
                }
			});
		}
	});
});

server.listen(PORT);

//运行成功，输出提示
console.log("Server runing at port: " + PORT);
