# redis-tools


var RedisClient = redis.createClient({
        host: '127.0.0.1',
        port: 6379,
        db: db,//使用第几个数据库
        prefix: ''//数据表前辍即schema 表前缀，可以通过这个区分表 默认在所有的地方都加的 ：需要加的，命名空间
    });
