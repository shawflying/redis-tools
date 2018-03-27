var Sequelize = require("sequelize")
var sequelize = new Sequelize('redis-tools', 'root', 'root', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './database.sqlite'// 只适用于 SQLite
});

var Links = sequelize.define('links', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true//自增
    },
    link_name: {
        type:Sequelize.STRING,
        
    },
    host: Sequelize.STRING,
    name: {
        type: Sequelize.STRING,
        comment: "用户名"
    },
    pwd: {
        type: Sequelize.STRING,
        comment: "密码"
    },
    port: {
        type: Sequelize.INTEGER,
        defaultValue: 6379,
        comment: "端口号"
    },
    remark: Sequelize.STRING,
});

sequelize.sync().then(function () {
    return Links.create({
        link_name: 'dev',
        host: '127.0.0.1',
        remark: '测试环境'
    });
}).then(function (jane) {
    console.log(jane.get({
        plain: true
    }));
});