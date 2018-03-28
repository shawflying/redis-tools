var p = console;

const Sequelize = require('sequelize');
var path = require("path");

var sequelize = new Sequelize('redis-tools', 'root', 'root', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../redis_tools.sqlite')// 只适用于 SQLite
});

//测试数据库链接
sequelize.authenticate().then(function () {
    console.log("数据库连接成功");
}).catch(function (err) {
    //数据库连接失败时打印输出
    console.error(err);
    throw err;
});

var Links = sequelize.define('links', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true//自增
    },
    link_name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "链接名称"
    },
    host: {
        type: Sequelize.STRING,
        defaultValue: "127.0.0.1",
        comment: "host"
    },
    port: {
        type: Sequelize.INTEGER,
        defaultValue: 6379,
        comment: "端口号",
        validate: {
            isNumeric: {
                args: true,
                msg: '阀值必须为数字'
            }
        }
    },
    auth: {
        type: Sequelize.STRING,
        comment: "授权"
    },
    remark: Sequelize.STRING,
});

exports.Links = Links;
exports.sequelize = sequelize