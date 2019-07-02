import Request from 'utils/request';

function setModel(data) {
    return {
        type: 'SET_MODEL',
        data
    };
}

function setModelList(data) {
    return {
        type: 'SET_MODEL_LIST',
        data
    };
}

function setLevelModelList(data) {
    return {
        type: 'SET_LEVEL_MODEL_LIST',
        data
    };
}

function setTypeModelList(data) {
    return {
        type: 'SET_TYPE_MODEL_LIST',
        data
    };
}

function setModelTotal(data) {
    return {
        type: 'SET_MODEL_TOTAL',
        data
    };
}

function setModelLevelList(data) {
    return {
        type: 'SET_MODEL_LEVEL_LIST',
        data
    };
}

function setModelListPage(data) {
    return {
        type: 'SET_MODEL_LIST_PAGE',
        data
    };
}

let Models = {
    createModel: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     CODE: 22,
        //     NAME: 2,
        //     TYPE: 3,
        //     LEVEL: 1,
        //     ACCURACY: 5,
        //     MESSAGE: 6,
        //     COMP_RELATED: 7,
        //     ACTIVE: 8,
        //     DESCRIPTION: 9
        // }
        return function() {
            let url = '/predict/model/createModel';
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
    removeModel: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 3
        // }
        return function() {
            let url = '/predict/model/removeModel';
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
    modifyModel: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     CODE: 0,
        //     NAME: 0,
        //     TYPE: 0,
        //     LEVEL: 0,
        //     ACCURACY: 0,
        //     MESSAGE: 0,
        //     COMP_RELATED: 0,
        //     ACTIVE: 0,
        //     DESCRIPTION: 0,
        //     ID: 3
        // }
        return function() {
            let url = '/predict/model/modifyModel';
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
    getModelById: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 9
        // }
        return function(dispatch) {
            let url = '/predict/model/getModelById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setModel(body.body));
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
    getModelList: function({
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
            let url = '/predict/model/getModelList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setModelList(body.body || []));
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
    getModelListByLevel: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     LEVEL: 4
        // }
        return function(dispatch) {
            let url = '/predict/model/getModelListByLevel';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setLevelModelList(body.body));
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
    getModelListByType: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     TYPE: 3
        // }
        return function(dispatch) {
            let url = '/predict/model/getModelListByType';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setTypeModelList(body.body));
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
    getModelTotal: function({
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
            let url = '/predict/model/getModelTotal';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setModelTotal(body.body));
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
    getModelLevelList: function({
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
            let url = '/predict/model/getModelLevelList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setModelLevelList(body.body));
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
    getModelListPage: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     CODE: NAME
        // }
        return function(dispatch) {
            let url = '/predict/model/getModelListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setModelListPage(body.body));
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

module.exports = Models;
