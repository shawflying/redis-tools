var config = require('./config');
var logger = require("./util/log4jsUtil");
var path = require('path');
var express = require('express');
var session = require('express-session');
var webRouter = require('./router');
var bodyParser = require('body-parser');
var compression = require('compression');
var _ = require("underscore")._;
var ejs = require('ejs');
var resFormat = require('./config/res');

var app = express();

app.set('views', path.join(__dirname, 'view'));//设置视图页面显示目录
//app.set('view engine', 'ejs');//设置编辑引擎
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.set('x-powered-by', false);

app.use('/' + config.app + '/public', express.static(path.join(__dirname, 'public'), {maxAge: '3d'}));//设置静态文件目录
app.use(require('response-time')());//显示请求运行时间
app.use(compression());//动态文件的gzip压缩
app.use(bodyParser.json());//body-parser 解析json格式数据 {"data":{"name":"张三","age":25}}  req.body.data.name (获取到张三)
app.use(bodyParser.urlencoded({extended: true}));//必须的 //此项必须在 bodyParser.json 下面,为参数编码
app.use(require('method-override')());//methodOverride中间件必须结合bodyParser中间件一起使用,为bodyParser中间件提供伪HTTP方法支持.
app.use(require('cookie-parser')(config.session_secret));//处理每一个请求的cookie。 通过req.cookies可以取到传过来的cookie，并把它们转成对象。

app.use(resFormat.resFormat)

app.use(session({
    secret: config.session_secret,
    name: config.cookie_name,
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 100000 * 60 * 60, httpOnly: true}
}));

app.locals.app = config.app;
app.locals.online = !config.debug;

//判断是否是特定访问
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use('/', webRouter);//进入路由

var server = app.listen(config.port, function () {
    logger.info('监听日志：' + config.port);
    logger.info("local: " + config.host + '/' + config.app + '/main');
});