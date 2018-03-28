var express = require('express');
var router = express.Router();
var redis = require('./controllers/redis');

//当前 上传一个
router.get('/redis/index', redis.main);
router.get('/redis/main/load', redis.main_load);//加载配置信息
router.get('/redis/keys', redis.keys);
router.post('/redis/values', redis.values);


module.exports = router;