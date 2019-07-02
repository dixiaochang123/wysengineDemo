import Request from 'utils/request';

function setRole(data) {
    return {
        type: 'SET_ROLE',
        data
    };
}

function setRoleList(data) {
    return {
        type: 'SET_ROLE_LIST',
        data
    };
}

function setRoleAuthList(data) {
    return {
        type: 'SET_ROLE_AUTH_LIST',
        data
    };
}

function setPageRoleList(data) {
    return {
        type: 'SET_PAGE_ROLE_LIST',
        data
    };
}

function setPageRoleListObj(data) {
    return {
        type: 'SET_PAGE_ROLE_LIST_OBJ',
        data
    };
}

function setSearchRoleList(data) {
    return {
        type: 'SET_SEARCH_ROLE_LIST',
        data
    };
}

let Role = {
    createRole: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     NAME: 'test',
        //     DESCRIPTION: '测试'
        // }
        return function() {
            let url = '/user/role/createRole';
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
    removeRole: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 2
        // }
        return function() {
            let url = '/user/role/removeRole';
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
    modifyRole: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 2,
        //     NAME: 'test1',
        //     DESCRIPTION: '测试1'
        // }
        return function() {
            let url = '/user/role/modifyRole';
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
    modifyRoleAuth: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 47,
        //     HAS_RIGHT: '1'
        // }
        return function() {
            let url = '/user/role/modifyRoleAuth';
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
    getRoleById: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 2
        // }
        return function(dispatch) {
            let url = '/user/role/getRoleById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setRole(body.body));
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
    getRoleList: function({
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
            let url = '/user/role/getRoleList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setRoleList(body.body || []));
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
    getRoleAuthListByRole: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ROLE: 2
        // }
        return function(dispatch) {
            let url = '/user/role/getRoleAuthListByRole';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setRoleAuthList(body.body || []));
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
    getPageRoleList: function({
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
            let url = '/user/role/getRoleListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPageRoleList(body.body.pageData || []));
                    dispatch(setPageRoleListObj(body.body || {}));
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
    searchRoleList: function({
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
            let url = '/user/role/searchRoleListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setSearchRoleList(body.body || []));
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

module.exports = Role;
