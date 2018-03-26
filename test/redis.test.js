var redis = require('redis');
const p = console;
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
// RedisClient.set("dxl-brush:mystring", "ok", function (err, data) {
//   p.log("=======================key:", err, data)
// })

// RedisClient.get("dxl-brush:mystring", function (err, data) {
//   p.log("=======================key:", err, data)
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

// RedisClient.lpush("mylist","redis", function (err, data) {
//   console.log("----------------------", err, data);
// });
// RedisClient.lpush("mylist","mongodb", function (err, data) {
//   console.log("----------------------", err, data);
// });

// RedisClient.llen("mylist", function (err, data) {
//   console.log("----------------------获取列表长度", err, data);
// });

// RedisClient.lrange("mylist", 0, 100, function (err, data) {
//   console.log("----------------------", err, data);
// });

//查看set 列表
// RedisClient.sadd("my_set","redis", function (err, data) {
//   console.log("----------------------", err, data);
// });
// RedisClient.sadd("my_set","mongodb", function (err, data) {
//   console.log("----------------------", err, data);
// });

// RedisClient.smembers("my_set", function (err, data) {
//   console.log("----------------------", err, data);
// });



//zset
RedisClient.zadd("myzset", 1,"redis", function (err, data) {
  console.log("----------------------", err, data);
});
RedisClient.zadd("myzset", 2,"mongodb", function (err, data) {
  console.log("----------------------", err, data);
});
RedisClient.zadd("myzset", 2,"mysql", function (err, data) {
  console.log("----------------------", err, data);
});
RedisClient.zadd("myzset", 3,"mysql", function (err, data) {
  console.log("----------------------", err, data);
});
RedisClient.zcard("myzset", function (err, data) {
  console.log("----------------------获取有序集合的成员数  ", err, data);
});

RedisClient.zrange("myzset", 0, 100, function (err, data) {
  console.log("----------------------", err, data);
});
