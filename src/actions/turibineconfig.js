import Request from 'utils/request';

function setTuribineConfig(data) {
    return {
        type: 'SET_TURIBINE_CONFIG',
        data
    };
}

function setProjectTuribineConfigList(data) {
    return {
        type: 'SET_PROJECT_TURIBINE_CONFIG_LIST',
        data
    };
}

function setTuribineConfigList(data) {
    return {
        type: 'SET_TRUIBINE_CONFIG_LIST',
        data
    };
}

function setTurbineConfigListPage(data) {
    return {
        type: 'SET_TRUIBINE_CONFIG_LIST_PAGE',
        data
    };
}

let TuribineConfig = {
    createTurbineConfig: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     TAG_NAME: 1,
        //     TAG_NAME_COM: 2,
        //     DESCRIPTION: 3,
        //     TURBINE_MODEL: 4,
        //     VARIABLE_NAME: 5,
        //     DESCRIBE_: 6,
        //     MAIN_TYPE: 7,
        //     SUB_TYPE: 8,
        //     DATA_TYPE: 9,
        //     MEASURE_UNIT: 10,
        //     DATA_RANGE: 11,
        //     REMARK_: 12,
        //     ORDER_INDEX: 13
        // }
        return function() {
            let url = '/masterdata/turbineConfig/createTurbineConfig';
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
    removeTurbineConfig: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token:token,
        //     ID:1
        // }
        return function() {
            let url = '/masterdata/turbineConfig/removeTurbineConfig';
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
    modifyTurbineConfig: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data:{
        //     token:token,
        //     TAG_NAME:1,
        //     TAG_NAME_COM:2,
        //     DESCRIPTION:3,
        //     TURBINE_MODEL:4,
        //     VARIABLE_NAME:5,
        //     DESCRIBE_:6,
        //     MAIN_TYPE:7,
        //     SUB_TYPE:8,
        //     DATA_TYPE:9,
        //     MEASURE_UNIT:10,
        //     DATA_RANGE:11,
        //     REMARK_:12,
        //     ORDER_INDEX:13,
        //     ID:1
        // }
        return function() {
            let url = '/masterdata/turbineConfig/modifyTurbineConfig';
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
    getTurbineConfigByTag: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     TAG_NAME: '10004_10004094_grHydrPressureSystem'
        // }
        return function(dispatch) {
            let url = '/masterdata/turbineConfig/getTurbineConfigByTag';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setTuribineConfig(body.body));
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
    getTurbineContigListByProject: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     FARM_CODE: 10001
        // }
        return function(dispatch) {
            let url = '/masterdata/turbineConfig/getTurbineContigListByProject';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setProjectTuribineConfigList(body.body || []));
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
    getTurbineContigListByTurbine: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     FARM_CODE: 10001,
        //     PREDICT_MODEL_ID: 1,
        //     WTGS_CODE: 10001
        // }
        return function(dispatch) {
            let url = '/masterdata/turbineConfig/getTurbineContigListByTurbine';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setTuribineConfigList(body.body || []));
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
    getTurbineConfigListPage: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     FARM_CODE: 10001
        // }
        return function(dispatch) {
            let url = '/masterdata/turbineConfig/getTurbineConfigListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setTurbineConfigListPage(body.body || []));
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

module.exports = TuribineConfig;
