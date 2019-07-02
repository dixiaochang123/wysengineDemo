import Request from 'utils/request';

let Login = {
    login: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        return function() {
            let url = '/login';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    },
    logout: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        return function() {
            let url = '/logout';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    }
};

module.exports = Login;
