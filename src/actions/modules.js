import Request from 'utils/request';

function setModule(data) {
    return {
        type: 'SET_MODULE',
        data
    };
}

function setModuleList(data) {
    return {
        type: 'SET_MODULE_LIST',
        data
    };
}

function setPageModuleList(data) {
    return {
        type: 'SET_PAGE_MODULE_LIST',
        data
    };
}

function setPageModuleListObj(data) {
    return {
        type: 'SET_PAGE_MODULE_LIST_OBJ',
        data
    };
}

function setSearchModuleList(data) {
    return {
        type: 'SET_SEARCH_MODULE_LIST',
        data
    };
}

let Modules = {
    createModule: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     CODE: 'test',
        //     NAME: 'test',
        //     DESCRIPTION: 'test'
        // }
        return function() {
            let url = '/system/module/createModule';
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
    },
    removeModule: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 6
        // }
        return function() {
            let url = '/system/module/removeModule';
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
    },
    modifyModule: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 6,
        //     CODE: 'microsoft',
        //     NAME: '微软',
        //     DESCRIPTION: '微软'
        // }
        return function() {
            let url = '/system/module/modifyModule';
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
    },
    getModuleById: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 6
        // }
        return function(dispatch) {
            let url = '/system/module/getModuleById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setModule(body.body || {}));
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
    getModuleList: function({
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
            let url = '/system/module/getModuleList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setModuleList(body.body || []));
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
    getPageModuleList: function({
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
            let url = '/system/module/getModuleListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPageModuleList(body.body.pageData || []));
                    dispatch(setPageModuleListObj(body.body || {}));
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
    searchModuleList: function({
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
        //     KEYWORD: keyWord
        // }
        return function(dispatch) {
            let url = '/system/module/searchModuleListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setSearchModuleList(body.body || []));
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

module.exports = Modules;
