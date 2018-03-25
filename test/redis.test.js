var redis = require('redis');

var RedisClient = redis.createClient({
  host: "127.0.0.1",
  port: "6379",
  db: 0,//使用第几个数据库
  prefix: ''//数据表前辍即schema 表前缀，可以通过这个区分表 默认在所有的地方都加的 ：需要加的，命名空间
});

RedisClient.on('error', function (err) {
  p.log('Error ' + err)
});

//string
// RedisClient.get(key, function (err, data) {
//   // p.log("=======================key:", err, data)
// })

//hash  get前有h,表示hget
//hash ky 值获取
// RedisClient.hget(key, "a", function (err, response) {
//   console.log("----------------------client.hget", err, response);
// });
// // 获取所有的hash 全量数据
// RedisClient.hgetall(key, function (err, response) {
//   console.log("----------------------RedisClient.hgetall", err, response);
// });

// RedisClient.exists("hash1",function(err,data){
//   console.log("----------------------", err, data);
// });
//查看类型
// RedisClient.type("myzset", function (err, response) {
//   console.log("----------------------", err, response);
// });

//list 查询
// RedisClient.lrange("myset", 0, 100, function (err, data) {
//   console.log("----------------------", err, data);
// });

// RedisClient.zrange("myzset", 0, 100, function (err, data) {
//   console.log("----------------------", err, data);
// });

RedisClient.zrange("myset", 0, -1, function (err, data) {
  console.log("----------------------", err, data);
});


//list


//set

//zset