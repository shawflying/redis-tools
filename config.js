var debug = true;//是否调试
var port = 6100;//端口
var config = {
    app: 'redis',
    debug: debug,
    name: 'redis',//项目名称
    description: 'Express 项目模板',
    host: debug ? 'http://127.0.0.1:' + port : 'http://app.yxxit.com',//本地基本授权时，127地址改成本地（192.168.。。）
    base_host: debug ? 'http://127.0.0.1:' : 'http://app.yxxit.com',//本地基本授权时，127地址改成本地（192.168.。。）
    db_name: 'express_dev',
    session_secret: 'node_wap_secret',//session cookie key
    secretkey: 'express',//node_wap_secret invoice
    auth_cookie_name: 'node_wap',//node_wap invoice_wx
    cookie_name: 'session-node-express',
    timeout: 5000,
    //程序运行端口
    port: port
};

module.exports = config;