import Request from 'utils/request';

function setParameter(data) {
    return {
        type: 'SET_PARAMETER',
        data
    };
}

function setParameterCode(data) {
    return {
        type: 'SET_PARAMETER_COCDE',
        data
    };
}

function setParameterList(data) {
    return {
        type: 'SET_PARAMETER_LIST',
        data
    };
}

function setPageParameterList(data) {
    return {
        type: 'SET_PAGE_PARAMETER_LIST',
        data
    };
}

function setSearchParameterList(data) {
    return {
        type: 'SET_SEARCH_PARAMETER_LIST',
        data
    };
}

let Parameter = {
    createParameter: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     CODE: 'test1',
        //     NAME: 'test1',
        //     DESCRIPTION: 'test',
        //     PARAM_TYPE: 1
        // }
        return function() {
            let url = '/system/parameter/createParameter';
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
    removeParameter: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 1
        // }
        return function() {
            let url = '/system/parameter/removeParameter';
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
    modifyParameter: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 1,
        //     CODE: 'microsoft',
        //     NAME: '微软',
        //     DESCRIPTION: '微软',
        //     PARAM_TYPE: 1
        // }
        return function() {
            let url = '/system/parameter/modifyParameter';
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
    getParameterById: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 1
        // }
        return function(dispatch) {
            let url = '/system/parameter/getParameterById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setParameter(body.body));
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
    getParameterByTypeCode: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     CODE: 'microsoft'
        // }
        return function(dispatch) {
            let url = '/system/parameter/getParameterByTypeCode';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setParameterCode(body.body));
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
    getParameterList: function({
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
            let url = '/system/parameter/getParameterList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setParameterList(body.body || []));
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
    getPageParameterList: function({
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
            let url = '/system/parameter/getParameterListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPageParameterList(body.body || []));
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
    searchParameterListPage: function({
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
            let url = '/system/parameter/searchParameterListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setSearchParameterList(body.body || []));
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

module.exports = Parameter;
