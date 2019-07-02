import Request from 'utils/request';

function setWindsite(data) {
    return {
        type: 'SET_WINDSITE',
        data
    };
}

function setWindsiteList(data) {
    return {
        type: 'SET_WINDSITE_LIST',
        data
    };
}

function setPageWindsiteList(data) {
    return {
        type: 'SET_PAGE_WINDSITE_LIST',
        data
    };
}

function setOnlineWindsiteList(data) {
    return {
        type: 'SET_ONLINE_WINDSITE_LIST',
        data
    };
}

function setWindsiteListOnline(data) {
    return {
        type: 'SET_WINDSITE_LIST_ONLINE',
        data
    };
}

function setAreaOnlineWindsiteList(data) {
    return {
        type: 'SET_AREA_ONLINE_WINDSITE_LIST',
        data
    };
}

function setTurbinePushedPredict(data) {//同台机组
    return {
        type: 'SET_TURBINE_PUSHED_PREDICT',
        data
    };
}

function setProjectPushedPredict(data) {//同台机组
    return {
        type: 'SET_PROJECT_PUSHED_PREDICT',
        data
    };
}

let Windsite = {
    getWindsite: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     CODE: 10001
        // }
        return function(dispatch) {
            let url = '/masterdata/project/getProjectById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setWindsite(body.body || {}));
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
    getWindsiteList: function({
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
            let url = '/masterdata/project/getProjectList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setWindsiteList(body.body));
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
    getWindsiteListOnline: function({
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
            let url = '/masterdata/project/getProjectListOnline';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setWindsiteListOnline(body.body || []));
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
    getWindsiteListPage: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     currentPage: 2,
        //     showCount: 10
        // }
        return function(dispatch) {
            let url = '/masterdata/project/getProjectListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPageWindsiteList(body.body || []));
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
    getOnlineWindsiteList: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     CODE: 10005
        // }
        return function(dispatch) {
            let url = '/masterdata/project/onlineProject';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setOnlineWindsiteList(body.body || []));
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
    getOnlineProjectListByArea: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 10
        // }
        return function(dispatch) {
            let url = '/masterdata/project/getOnlineProjectListByArea';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setAreaOnlineWindsiteList(body.body || []));
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
    getTurbinePushedPredict: function({//同台机组
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     TURBINE: TURBINE
        // }
        return function(dispatch) {
            let url = '/predict/getTurbinePushedPredict';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setTurbinePushedPredict(body.body || []));
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
    getProjectPushedPredict: function({//同风场
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     PROJECT: PROJECT
        // }
        return function(dispatch) {
            let url = 'predict/getProjectPushedPredict';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setProjectPushedPredict(body.body || []));
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

module.exports = Windsite;
