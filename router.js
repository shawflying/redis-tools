var express = require('express');
var router = express.Router();
var redis = require('./controllers/redis');


router.get('/redis/login', redis.login);
router.get('/redis/main', redis.main);
router.get('/redis/keys', redis.keys);
router.post('/redis/values', redis.values);


module.exports = router;