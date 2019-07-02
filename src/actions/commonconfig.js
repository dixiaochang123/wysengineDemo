import Request from 'utils/request';

function setCommonConfig(data) {
    return {
        type: 'SET_COMMON_CONFIG',
        data
    };
}

function setCommonConfigList(data) {
    return {
        type: 'SET_COMMON_CONFIG_LIST',
        data
    };
}

let CommonConfig = {
    getCommonConfigByTag: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     TAG_NAME: '11'
        // }
        return function(dispatch) {
            let url = '/masterdata/commonConfig/getCommonConfigByTag';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setCommonConfig(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getCommonContigListByType: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     CONFIG_TYPE: 2
        // }
        return function(dispatch) {
            let url = '/masterdata/commonConfig/getCommonConfigByTag';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setCommonConfigList(body.body || {}));
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

module.exports = CommonConfig;
