var express = require('express');
var router = express.Router();
var redis = require('./controllers/redis');

//当前 上传一个
router.get('/redis/index', redis.main);

//配置信息加载
router.get('/redis/links', redis.main_load);//加载配置信息
router.post('/redis/links', redis.links_add);//添加记录、或者更新
router.delete('/redis/links/:link_name', redis.links_del);//删除


router.get('/redis/info/:link_name', redis.redis_info);//查看redis 信息
router.get('/redis/keys', redis.keys);
router.post('/redis/values', redis.values);


module.exports = router;