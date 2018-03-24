var logger = require('../util/log4jsUtil');
var _ = require("underscore")._;
var EventProxy = require('eventproxy');
var moment = require('moment');
var utility = require('utility');
var config = require('../config');
var ResKit = require('yanxxit-reskit');
var co = require("co")
var path = require("path")
var fs = require("fs");
var p = console;

var redis = require('redis');


/**
 * 进入首页
 * @param req
 * @param res
 */
exports.login = function (req, res) {
    res.render('redis_login', { title: '选择登录' });
};
//登录session
exports.loginSession = function (req, res) {
    let redis = {
        name: req.body.name || "local",
        host: req.body.host || "127.0.0.1",
        port: req.body.port || 6379,
        db: req.body.db || 0
    }
    let list = require("../config/db.json");
    list[redis.name] = redis;
    let info = JSON.stringify(list);
    fs.writeFile(path.join(__dirname, '../config/db.json'), info, { encoding: 'utf-8' }, function (err) {
        if (err) return res.fail(err);
        return res.success("login success");
    });
};

exports.main = function (req, res) {
    res.render('redis_main', { title: '查看页面' });
};

//登录
exports.check_login = function (req, res, next) {
    let db_name = req.query.db_name;
    req.headers["redis"] = require("../config/db.json")[db_name];
    next()
};

//加载
exports.main_load = function (req, res) {
    res.success(req.headers["redis"]);
};

//查询所有key
exports.keys = function (req, res) {
    let db = req.query.db;
    let redis_conf = req.headers["redis"];
    var RedisClient = redis.createClient({
        host: redis_conf.host,
        port: redis_conf.port,
        db: db,//使用第几个数据库
        prefix: ''//数据表前辍即schema 表前缀，可以通过这个区分表 默认在所有的地方都加的 ：需要加的，命名空间
    });

    RedisClient.on('error', function (err) {
        console.log('Error ' + err)
    });
    RedisClient.keys("**", function (err, data) {
        p.log(err, data)
        if (err) return []
        return res.json(data);
    })
};
//查询所有key
exports.values = function (req, res) {
    var redis_conf = req.headers["redis"];
    let key = req.body.key;
    var RedisClient = redis.createClient({
        host: redis_conf.host,
        port: redis_conf.port,
        db: req.body.db,//使用第几个数据库
        prefix: ''//数据表前辍即schema 表前缀，可以通过这个区分表 默认在所有的地方都加的 ：需要加的，命名空间
    });

    RedisClient.on('error', function (err) {
        console.log('Error ' + err)
    });
    RedisClient.get(key, function (err, data) {
        p.log(err, data)
        if (err) return {}
        return res.json(data);
    })
};