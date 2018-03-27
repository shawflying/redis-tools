var _ = require("underscore")._;
var EventProxy = require('eventproxy');
var moment = require('moment');
var config = require('../config');
var { sequelize, Links } = require('./redis-tools-config');
var co = require("co")
var path = require("path")
var fs = require("fs");
var p = console;

var redis = require('redis');


//进入首页
exports.login = function (req, res) {
    sequelize.sync().then(function () {
        return Links.create({
            link_name: 'dev',
            host: '127.0.0.1',
            remark: '测试环境'
        });
    }).then(function (jane) {
        console.log(jane.get({
            plain: true
        }));
    });

    sequelize.sync().then(function () {
        return Links.findAll();
    }).then(function (jane) {
        p.log(JSON.stringify(jane))
    });
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
    let data = req.headers["redis"];
    if (!_.isEmpty(data) && !_.isEmpty(data.name)) {
        res.success(data);
    } else {
        p.log(req.headers)
        res.fail("登录失败，缓存失效")
    }
};

//查询所有key
exports.keys = function (req, res) {
    let db = req.query.db;
    let redis_conf = req.headers["redis"];
    var RedisClient = redis.createClient({
        host: redis_conf.host,
        port: redis_conf.port,
        db: db,//使用第几个数据库
    });

    RedisClient.on('error', function (err) {
        p.log('Error ' + err)
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
    p.log("key:", key)
    var RedisClient = redis.createClient({
        host: redis_conf.host,
        port: redis_conf.port,
        db: req.body.db,//使用第几个数据库
    });
    var ep = new EventProxy();
    try {
        RedisClient.on('error', function (err) {
            p.log('Error ' + err)
        });

        //查看是否存在
        RedisClient.exists(key, function (err, data) {
            p.log(data)
            if (err) return res.fail(err);
            if (data <= 0) return res.fail(key + "已经过期了");
            ep.emit("type");
        });

        //校验类型
        ep.bind("type", function () {
            RedisClient.type(key, function (err, data) {
                if (err) return res.fail(err);
                if (data == "hash") { //获取所有的hash 全量数据
                    RedisClient.hgetall(key, function (err, data) {
                        return res.resJsonX(err, data)
                    });
                } else if (data == "string") {//获取string
                    RedisClient.get(key, function (err, data) {
                        return res.resJsonX(err, data)
                    })
                } else if (data == "list") {
                    RedisClient.lrange("list", 0, 100, function (err, data) {
                        return res.resJsonX(err, data)
                    });
                } else if (data == "set") {//查询set 列表
                    RedisClient.smembers(key, function (err, data) {
                        return res.resJsonX(err, data)
                    });
                } else if (data == "zset") {
                    RedisClient.zrange("myzset", 0, 1000, function (err, data) {
                        return res.resJsonX(err, data)
                    });
                }
            });
        });
    } catch (e) {
        if (err) return res.fail(e)
    }
};