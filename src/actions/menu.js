import Request from 'utils/request';

function setMenu(data) {
    return {
        type: 'SET_MENU',
        data
    };
}

function setMenuList(data) {
    return {
        type: 'SET_MENU_LIST',
        data
    };
}

function setUserMenuList(data) {
    return {
        type: 'SET_USER_MENU_LIST',
        data
    };
}

function setPageMenuList(data) {
    return {
        type: 'SET_PAGE_MENU_LIST',
        data
    };
}

function setPageMenuListObj(data) {
    return {
        type: 'SET_PAGE_MENU_LIST_OBJ',
        data
    };
}

function setSearchMenuList(data) {
    return {
        type: 'SET_SEARCH_MENU_LIST',
        data
    };
}

let Menu = {
    createMenu: function({
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
        //     URL: 'test.com',
        //     PARENT: 0,
        //     LEVEL: 1,
        //     SEQUENCE: 1,
        //     MODULE: 1,
        //     DESCRIPTION: 'test'
        // }
        return function() {
            let url = '/system/menu/createMenu';
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
    removeMenu: function({
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
            let url = '/system/menu/removeMenu';
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
    modifyMenu: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 6,
        //     CODE: 'microsoft111',
        //     NAME: '微软',
        //     URL: 'test.com',
        //     PARENT: 0,
        //     LEVEL: 1,
        //     SEQUENCE: 1,
        //     MODULE: 1,
        //     DESCRIPTION: '微软'
        // }
        return function() {
            let url = '/system/menu/modifyMenu';
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
    getMenuById: function({
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
            let url = '/system/menu/getMenuById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setMenu(body.body));
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
    getMenuList: function({
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
            let url = '/system/menu/getMenuList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setMenuList(body.body || []));
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
    getUserMenuList: function({
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
            let url = '/system/menu/getUserMenuList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setUserMenuList(body.body || []));
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
    getPageMenuList: function({
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
            let url = '/system/menu/getMenuListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPageMenuList(body.body.pageData || []));
                    dispatch(setPageMenuListObj(body.body || {}));
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
    searchMenuList: function({
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
            let url = '/system/menu/searchMenuListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setSearchMenuList(body.body || []));
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

module.exports = Menu;
