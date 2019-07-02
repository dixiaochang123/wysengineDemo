import Request from 'utils/request';

function setArea(data) {
    return {
        type: 'SET_AREA',
        data
    };
}

function setAreaList(data) {
    return {
        type: 'SET_AREA_LIST',
        data
    };
}

function setPageAreaList(data) {
    return {
        type: 'SET_PAGE_AREA_LIST',
        data
    };
}

function setSearchAreaList(data) {
    return {
        type: 'SET_SEARCH_AREA_LIST',
        data
    };
}

let Area = {
    createArea: function({
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
            let url = '/masterdata/area/createArea';
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
    removeArea: function({
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
            let url = '/masterdata/area/removeArea';
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
    modifyArea: function({
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
        //     DESCRIPTION: '微软'
        // }
        return function() {
            let url = '/masterdata/area/modifyArea';
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
    getAreaById: function({
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
            let url = '/masterdata/area/getAreaById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setArea(body.body));
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
    getAreaList: function({
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
            let url = '/masterdata/area/getAreaList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setAreaList(body.body || []));
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
    getAreaListPage: function({
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
            let url = '/masterdata/area/getAreaListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPageAreaList(body.body || []));
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
    searchAreaListPage: function({
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
            let url = '/masterdata/area/searchAreaListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setSearchAreaList(body.body || []));
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
    exportAreaExcel: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        return function() {
            let url = '/masterdata/area/exportExcel';
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

module.exports = Area;
