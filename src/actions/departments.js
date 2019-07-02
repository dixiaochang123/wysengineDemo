import Request from 'utils/request';

function setDepartment(data) {
    return {
        type: 'SET_DEPARTMENT',
        data
    };
}

function setDepartmentList(data) {
    return {
        type: 'SET_DEPARTMENT_LIST',
        data
    };
}

function setPageDepartmentList(data) {
    return {
        type: 'SET_PAGE_DEPARTMENT_LIST',
        data
    };
}

function setSearchDepartmentList(data) {
    return {
        type: 'SET_SEARCH_DEPARTMENT_LIST',
        data
    };
}

let Departments = {
    createDepartment: function({
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
        //     DESCRIPTION: 'test',
        //     PARENT: 0,
        //     LEVEL: 1,
        //     COMPANY: 1
        // }
        return function() {
            let url = '/user/department/createDepartment';
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
    removeDepartment: function({
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
            let url = '/user/department/removeDepartment';
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
    modifyDepartment: function({
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
        //     PARENT: 0,
        //     LEVEL: 1,
        //     COMPANY: 1
        // }
        return function() {
            let url = '/user/department/modifyDepartment';
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
    getDepartmentById: function({
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
            let url = '/user/department/getDepartmentById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setDepartment(body.body || {}));
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
    getDepartmentList: function({
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
            let url = '/user/department/getDepartmentList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setDepartmentList(body.body || []));
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
    getPageDepartmentList: function({
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
            let url = '/user/department/getDepartmentListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPageDepartmentList(body.body));
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
    searchDepartmentList: function({
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
            let url = '/user/department/searchDepartmentListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setSearchDepartmentList(body.body));
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

module.exports = Departments;
