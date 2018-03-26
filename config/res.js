var config = require("../config");
var p = console;
exports.resFormat = function (req, res, next) {
    res.success = (result) => {
        let data = { code: 1, msg: 'success', data: result }
        if (config.debug) p.log(data)
        return res.json(data);
    }

    res.fail = (msg = "fail") => {
        let data = { code: -1, msg: msg, data: {} }
        if (config.debug) p.log(data)
        return res.json(data);
    }

    res.resJson = (code = 0, msg = "", result = {}) => {
        let data = { code: code, msg: msg, data: result }
        if (config.debug) p.log(data)
        return res.json(data);
    }

    res.resJsonX = (err = null, result = {}) => {
        let data = { code: 0, msg: "", data: result }
        if (err != null) {
            data.code = -1;
            data.msg = err
        } else {
            data.code = 1;
            data.msg = "success"
        }

        if (config.debug) p.log(data)
        return res.json(data);
    }
    next();
}