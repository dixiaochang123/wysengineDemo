import Request from 'utils/request';

function setUser(data) {
    return {
        type: 'SET_USER',
        data
    };
}

function setLoginFailTimes(data) {
    return {
        type: 'SET_LOGIN_FAIL_TIMES',
        data
    };
}

function setPageUserList(data) {
    return {
        type: 'SET_PAGE_USER_LIST',
        data
    };
}

function setSearchUserList(data) {
    return {
        type: 'SET_SEARCH_USER_LIST',
        data
    };
}

let User = {
    createUser: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     NAME: '测试',
        //     USER_NAME: 'test',
        //     PASSWORD: 'test',
        //     STATUS: 1,
        //     GENDER: 1,
        //     EMAIL: 'test@test.com',
        //     PHONE: '13888888888',
        //     ADDRESS: '中国北京市东城区长安大街1号',
        //     LEVEL: 1,
        //     AREA: 10,
        //     DEPARTMENT: 1,
        //     COMPANY: 1,
        //     ROLE: 1,
        //     THEME: 1
        // }
        return function() {
            let url = '/user/user/createUser';
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
    removeUser: function({
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
            let url = '/user/user/removeUser';
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
    modifyUser: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 2,
        //     NAME: '测试1',
        //     USER_NAME: 'test1',
        //     PASSWORD: 'test1',
        //     STATUS: 2,
        //     GENDER: 2,
        //     EMAIL: 'test1@test.com',
        //     PHONE: '13988888888',
        //     ADDRESS: '中国北京市东城区长安大街2号',
        //     LEVEL: 2,
        //     AREA: 20,
        //     DEPARTMENT: 2,
        //     COMPANY: 2,
        //     ROLE: 1,
        //     THEME: 1
        // }
        return function() {
            let url = '/user/user/modifyUser';
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
    getUserByToken: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        // }
        return function(dispatch) {
            let url = '/user/user/getUserByToken';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setUser(body.body));
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
    getUserById: function({
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
            let url = '/user/user/getUserById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setUser(body.body));
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
    getUserByUserName: function({
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
            let url = '/user/user/getUserByUserName';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setUser(body.body));
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
    resetLoginFailTimes: function({
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
            let url = '/user/user/resetLoginFailTimes';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setLoginFailTimes(body.body || []));
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
    lockAccount: function({
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
            let url = '/user/user/lockAccount';
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
    unlockAccount: function({
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
            let url = '/user/user/unlockAccount';
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
    resetPassword: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 2,
        //     PASSWORD: 'abc'
        // }
        return function() {
            let url = '/user/user/resetPassword';
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
    modifyTheme: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 2,
        //     THEME: 2
        // }
        return function() {
            let url = '/user/user/modifyTheme';
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
    getPageUserList: function({
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
            let url = '/user/user/getUserListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPageUserList(body.body || []));
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
    getSearchUserList: function({
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
            let url = '/user/user/searchUserListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setSearchUserList(body.body || []));
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
    modifyPassword: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID:3
        //     PASSWORD:11
        // }
        return function() {
            let url = '/user/user/modifyPassword';
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

module.exports = User;
