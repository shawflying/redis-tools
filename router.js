var express = require('express');
var router = express.Router();
var redis = require('./controllers/redis');

//当前 上传一个
router.get('/redis/index', redis.main);

//配置信息加载
router.get('/redis/links', redis.main_load);//加载配置信息
router.post('/redis/links', redis.links_add);//添加记录
router.delete('/redis/links', redis.links_del);//删除


router.get('/redis/keys', redis.keys);
router.post('/redis/values', redis.values);


module.exports = router;