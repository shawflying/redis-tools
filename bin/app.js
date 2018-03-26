var app = require('../index');
var debug = require('debug')('design:server');
var http = require('http');
var config = require("../config")

exports.run = function (port) {
  if (!port) {
    // 从系统环境中获取端口设置并保存在项目中
    port = exports.normalizePort(process.env.PORT || config.port);
  }
  app.set('port', port);
  // 创建HTTP服务器
  var server = http.createServer(app);
  //在所有网络接口上监听提供的端口号
  server.listen(port, function () {
    console.log('监听日志：' + port);
    console.log("local: " + config.base_host + port + '/' + config.app + '/login');
  });
  server.on('error', (e) => {
    exports.onError(e, port)
  });
  server.on('listening', function () {// HTTP 服务器的'listening'事件监听器
    var addr = server.address();
    var bind = typeof addr === 'string' ? '管道 ' + addr : '端口 ' + addr.port;
    debug('正在监听 ' + bind);
  });
}

//使端口转换成数字，字符串，或假。
exports.normalizePort = function (val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // 指定管道
    return val;
  }
  if (port >= 0) {
    // 端口号
    return port;
  }
  return false;
}
//HTTP 服务器的'error'事件监听器
exports.onError = function (error, port) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string' ? '管道 ' + port : '端口 ' + port;
  // 给特定的监听错误设置友好的消息提示
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' 需要提升权限');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' 正在被其他程序使用');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

//产生随机数函数
exports.randomNum = function (n) {
  var rnd = "";
  for (var i = 0; i < n; i++)
    rnd += Math.floor(Math.random() * 10);
  return rnd;
}
