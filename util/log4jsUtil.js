/**
 * logger log日志
 */

//加载log4js
var moment = require('moment'),
    log4js = require("log4js");
var config = require('../config');
log4js.configure('config/log4js.json', {});

var logger = log4js.getLogger('s');

exports.uuid = '';
exports.getUid = function () {
    var v = "";
    if (exports.uuid == undefined || exports.uuid == '') {
        v = '';//uid:interface
    } else {
        v = exports.uuid + ' ';
    }
    return v
};

/**
 * 正常日志记录
 * @param message 日志内容
 */
exports.info = function (message) {
    logger.info(exports.getUid() + message);
};


/**
 * 调试日志记录
 * @param message 日志内容
 */
exports.debug = function (message) {
    logger.debug(exports.getUid() + message);
};


/**
 *
 * @param message 日志内容
 */
exports.trace = function (message) {
    logger.trace(exports.getUid() + message);
};


/**
 * 告警日志记录
 * @param message 日志内容
 */
exports.warn = function (message) {
    logger.warn(exports.getUid() + message);
};


/**
 * 错误日志记录
 * @param message 日志内容
 */
exports.error = function (message) {
    logger.error(exports.getUid() + message);
};

/**
 *
 * @param message
 */
exports.fatal = function (message) {
    logger.fatal(exports.getUid() + message);
};