import Request from 'utils/request';

function setLogSettingObj(data) {
    return {
        type: 'SET_LOG_SETTING_OBJ',
        data
    };
}

function setLogSettingList(data) {
    return {
        type: 'SET_LOG_SETTING_LIST',
        data
    };
}

function setActiveLogSettingList(data) {
    return {
        type: 'SET_ACTIVE_LOG_SETTING_LIST',
        data
    };
}

function setPageLogSettingList(data) {
    return {
        type: 'SET_PAGE_LOG_SETTING_LIST',
        data
    };
}

function setSearchLogSettingList(data) {
    return {
        type: 'SET_SEARCH_LOG_SETTING_LIST',
        data
    };
}

let LogSetting = {
    registLogSetting: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     REQUEST: 'test',
        //     MODULE: 1,
        //     ACTION: 1,
        //     MESSAGE: 'message',
        //     ACTIVE: 0
        // }
        return function() {
            let url = '/system/log/logsetting/registLogSetting';
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
    modifyLogSetting: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 15,
        //     REQUEST: 'test11',
        //     MODULE: 1,
        //     ACTION: 1,
        //     MESSAGE: 'message22',
        //     ACTIVE: 0
        // }
        return function() {
            let url = '/system/log/logsetting/modifyLogSetting';
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
    removeLogSetting: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: '15'
        // }
        return function() {
            let url = '/system/log/logsetting/removeLogSetting';
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
    getLogSettingById: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: '15'
        // }
        return function(dispatch) {
            let url = '/system/log/logsetting/getLogSettingById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setLogSettingObj(body.body || {}));
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
    getLogSettingList: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token
        // }
        return function(dispatch) {
            let url = '/system/log/logsetting/getLogSettingList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setLogSettingList(body.body || []));
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
    getActiveLogSettingList: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token
        // }
        return function(dispatch) {
            let url = '/system/log/logsetting/getActiveLogSettingList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setActiveLogSettingList(body.body || []));
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
    getPageLogSettingList: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     currentPage: 1,
        //     showCount: 10
        // }
        return function(dispatch) {
            let url = '/system/log/logsetting/getLogSettingListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPageLogSettingList(body.body.pageData || []));
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
    searchLogSettingListPage: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     currentPage: 1,
        //     showCount: 10,
        //     KEYWORD:keyWord
        // }
        return function(dispatch) {
            let url = '/system/log/logsetting/searchLogSettingListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setSearchLogSettingList(body.body || []));
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
    exportLogSetting: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token
        // }
        return function() {
            let url = '/system/log/logsetting/exportExcel';
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
    }
};

module.exports = LogSetting;
