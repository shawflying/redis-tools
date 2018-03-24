var crypto = require('crypto');
var logger = require('../util/log4jsUtil');

/**
 * 加密码
 * @param data 内容
 * @param key 密钥
 * @returns {*}
 */
exports.aesEncrypt = function (data, key) {
    try {
        var cipher = crypto.createCipher('aes-128-ecb', key);
        var data = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
        return data;
    } catch (e) {
        logger.error('加密时异常' + e);
        return '';
    }
};

/**
 * 解密
 * @param data 内容
 * @param key 密钥
 * @returns {*}
 */
exports.aesDecrypt = function (data, key) {
    try {
        var cipher = crypto.createDecipher('aes-128-ecb', key);
        var data = cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
        return data;
    } catch (e) {
        logger.error('解密时异常' + e);
        return '';
    }
};

/**
 * md5 加密
 * @param content
 * @returns {*}
 */
exports.md5 = function (content) {
    return crypto.createHash('md5').update(content).digest('hex');
};