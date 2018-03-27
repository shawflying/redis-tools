var Sequelize = require("sequelize")
var sequelize = new Sequelize('redis-tools', 'root', 'root', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // 只适用于 SQLite
    storage: './database.sqlite'
});

var User = sequelize.define('user', {
    username: Sequelize.STRING,
    birthday: Sequelize.DATE
});

sequelize.sync().then(function () {
    return User.create({
        username: 'janedoe',
        birthday: new Date(1980, 6, 20)
    });
}).then(function (jane) {
    console.log(jane.get({
        plain: true
    }));
});