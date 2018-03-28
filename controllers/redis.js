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

//登录session
exports.loginSession = function (req, res) {
    sequelize.sync().then(function () {
        return Links.findOne({
            where: {
                link_name: req.body.name
            }
        });
    }).then(function (data) {
        p.log(data)
        if (!data == null && data.link_name == req.body.name) {
            //已有,跟新
            return res.success("login success");
        } else {
            sequelize.sync().then(function () {
                return Links.create({
                    link_name: req.body.name,
                    host: req.body.host,
                    port: req.body.port
                });
            }).then(function (data) {
                return res.success("login success");
            });
        }
    });
};

exports.main = function (req, res) {
    res.render('redis_main', { title: '查看页面' });
};

//加载
exports.main_load = function (req, res) {
    sequelize.sync().then(function () {
        return Links.findAll();
    }).then(function (data) {
        let list = [];
        data.forEach((m, i) => {
            list.push({ link_name: m.link_name })
        });
        res.success(data);
    }).catch(e => {
        res.success([]);
    });
};

//查询所有key
exports.keys = function (req, res) {
    let db = req.query.db;
    let link_id = req.query.link_id;

    //通过link_id 获取配置信息
    sequelize.sync().then(function () {
        return Links.findOne({
            where: {
                id: link_id
            }
        });
    }).then(function (data) {
        var RedisClient = redis.createClient({
            host: data.dataValues.host,
            port: data.dataValues.port,
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
    });
};

//查询所有key
exports.values = function (req, res) {
    let link_id = req.query.link_id;
    var ep = new EventProxy();
    let key = req.body.key;
    let db = req.body.db;
    p.log("key:", key)

    //通过link_id 获取配置信息
    sequelize.sync().then(function () {
        return Links.findOne({
            where: {
                id: link_id
            }
        });
    }).then(function (data) {
        var RedisClient = redis.createClient({
            host: data.dataValues.host,
            port: data.dataValues.port,
            db: db,//使用第几个数据库
        });

        RedisClient.on('error', function (err) {
            p.log('Error ' + err)
        });
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
            return res.fail(e)
        }
    });


};