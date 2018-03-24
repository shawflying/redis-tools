var express = require('express');
var router = express.Router();
var redis = require('./controllers/redis');

//当前 上传一个
router.get('/redis/login', redis.login);
router.post('/redis/login', redis.loginSession);

router.get('/redis/main', redis.check_login, redis.main);
router.get('/redis/main/load', redis.check_login, redis.main_load);
router.get('/redis/keys', redis.check_login, redis.keys);
router.post('/redis/values', redis.check_login, redis.values);


module.exports = router;