/**
 * Created by mohoo on 15/3/4.
 */
// var logger = require("../util/log4jsUtil");
var logger = {
    info: function (data) {
        console.log(data)
    },
    error: function (data) {
        console.log(data)
    }
}
var request = require('request');
var apis = require('../config');

var headers = {
    'User-Agent': 'request-wap-oauth',
    'X_HPZ_APPLICATION_ID': 'wap',
    'Content-Type': 'application/json',
    RequestStartTime: 0
};


/**
 * get请求
 * @param url 请求的url地址
 * @param callback 回调函数
 */
exports.get = function (url, callback) {
    headers.RequestStartTime = new Date().getTime();
    var options = {
        url: url,
        method: 'GET',
        headers: headers,
        json: true,
        timeout: apis.timeout
    };

    request(options, function (error, response, content) {
        try {
            if (!error && response != undefined && response.statusCode == 200) {
                logger.info("request-get-url: " + url + getResTimeInfo(response));
                callback(error, response, content);
            } else {
                logger.error("request-get-url-error: " + error + " url:" + url);
                callback(error);
            }
        } catch (e) {
            logger.error("---------------get请求崩溃: 异常信息" + error + JSON.stringify(e) + " url:" + url);
            callback('请求异常');
        }
    });
};

/**
 * getParams请求
 * @param params 请求参数
 * @param url 请求的url地址
 * @param callback 回调函数
 */
exports.getParams = function (url, params, callback) {
    headers.RequestStartTime = new Date().getTime();
    var options = {
        method: 'GET',
        url: url,
        qs: params,
        headers: headers,
        timeout: apis.timeout,
        json: true
    };

    request(options, function (error, response, content) {
        try {
            if (!error && response != undefined && response.statusCode == 200) {
                logger.info("request-getParams-url: " + url + ',Params:' + JSON.stringify(params) + getResTimeInfo(response));
                callback(error, response, content);
            } else {
                logger.error("request-get-url-error: " + error + " url:" + url + ',Params:' + JSON.stringify(params));
                callback(error);
            }
        } catch (e) {
            logger.error("---------------post请求崩溃: 异常信息" + error + JSON.stringify(e) + " url:" + url + JSON.stringify(params));
            callback('请求异常');
        }
    });
};

/**
 * post 请求
 * @param url url地址
 * @param params 请求参数
 * @param callback 回调函数
 */
exports.post = function (url, params, callback) {
    headers.RequestStartTime = new Date().getTime();

    var options = {
        url: url,
        method: 'POST',
        json: true,
        body: params,
        headers: headers,
        timeout: apis.timeout
    };
    request(options, function (error, response, content) {
        if (!error && response != undefined && response.statusCode == 200) {
            logger.info("request-post-url: " + url + getResTimeInfo(response));
            logger.info("request-post-params: " + JSON.stringify(params));
            callback(error, response, content);
        } else {
            logger.error("request-post-error: " + error + " url:" + url + JSON.stringify(response));
            callback(error);
        }
    });
};

/**
 * 请求响应时间
 * @param response
 * @returns {string}
 */
var getResTimeInfo = function (response) {
    try {
        var ReqStartTime = response.request.headers.RequestStartTime;//请求时间
        var ResEndTime = new Date().getTime();//响应时间
        var resTimeInfo = ' ResTime:' + (ResEndTime - ReqStartTime) + 'ms';
        return resTimeInfo;
    } catch (e) {
        return '';
    }
};
/**
 * POST表单提交
 * @param url
 * @param params
 * @param callback
 */
exports.postForm = function (url, params, callback) {
    headers.RequestStartTime = new Date().getTime();

    var options = {
        url: url,
        method: 'POST',
        json: true,
        form: params,
        headers: headers,
        timeout: apis.timeout
    };
    request(options, function (error, response, content) {
        if (!error && response != undefined && response.statusCode == 200) {
            logger.info("request-postFrom-url: " + url + getResTimeInfo(response));
            logger.info("request-postFrom-params: " + JSON.stringify(params));
            callback(error, response, content);
        } else {
            logger.error("request-postFrom-error: " + error + " url:" + url + ' params' + JSON.stringify(params));
            callback(error);
        }
    });
};