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

exports.main = function (req, res) {
    res.render('redis_main', { title: '查看页面' });
};

//查询所有key
exports.keys = function (req, res) {
    let db = req.query.db;
    var RedisClient = redis.createClient({
        host: '127.0.0.1',
        port: 6379,
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
    let db = req.body.db;
    let key = req.body.key;
    var RedisClient = redis.createClient({
        host: '127.0.0.1',
        port: 6379,
        db: db,//使用第几个数据库
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