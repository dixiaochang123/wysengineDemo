import superagent from 'superagent';
import User from 'utils/user';
import Utils from 'utils/utils';
import Constant from 'constant/index';
const hashHistory = require('react-router/lib/hashHistory');

function Request({
    url,
    data,
    success,
    fail,
    type
}) {
    type = this.getType(type);
    url = this.getUrl(url);
    this.url = url;
    var request = new superagent.Request(type, url);
    this.request = request;
    if (url.indexOf('files') === -1) {
        request.set('Accept', 'application/json');
    }
    request.type('form');
    data.token = User.get('token') || '';
    if (type === 'GET') {
        request.query(data);
    } else {
        request.send(data);
    }
    this.execute({
        success,
        fail
    });
}

Request.prototype = {
    constructor: Request,
    getUrl: function(url) {
        let requestUrl = url[0] === '/' ? Constant.API_ROOT + url : Constant.API_ROOT + '/' + url;
        return requestUrl;
    },
    getType: function(type) {
        type = type ? type.toUpperCase() : 'POST';
        return type === 'GET' ? 'GET' : 'POST';
    },
    execute: function({
        success,
        fail
    }) {
        this.request.end(function(err, res) {
            if (err) {
                Utils.tooltip('请求数据失败，请检查您的网络');
                throw err;
            }
            let body = !!res.body ? res.body : {
                head: {
                    code: ''
                },
                body: ''
            };
            let code = body.head.code || body.head.request_code;
            if (code === 200) {
                return success && success(body);
            }
            if (code === 401 || code === 402 || code === 403) {
                Utils.tooltip(body.head.msg);
                setTimeout(function() {
                    hashHistory.push('/login');
                }, 1000);
                return false;
            }
            if (code === 406 || code === 407) {
                Utils.tooltip(body.head.msg);
                return false;
            }
            return fail && fail(body);
        }.bind(this));
    }
};

let Index = {
    get: function(options) {
        options.type = 'GET';
        new Request(options);
    },
    post: function(options) {
        options.type = 'POST';
        new Request(options);
    },
    ajax: function(options) {
        new Request(options);
    }
};

module.exports = Index;