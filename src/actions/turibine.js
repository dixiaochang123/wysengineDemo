import Request from 'utils/request';

function setTuribine(data) {
    return {
        type: 'SET_TURIBINE',
        data
    };
}

function setTuribineList(data) {
    return {
        type: 'SET_TURIBINE_LIST',
        data
    };
}

function setProjectTuribineList(data) {
    return {
        type: 'SET_PROJECT_TRUIBINE_LIST',
        data
    };
}

let Turibine = {
    modifyTurbine: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     CODE: '10001002',
        //     TURBINE_CONFIG: '12121'
        // }
        return function() {
            let url = '/masterdata/turbine/modifyTurbine';
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
    getTurbineById: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     CODE: '10001002'
        // }
        return function(dispatch) {
            let url = '/masterdata/turbine/getTurbineById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setTuribine(body.body));
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
    getTurbineList: function({
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
            let url = '/masterdata/turbine/getTurbineList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setTuribineList(body.body || []));
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
    getTurbineListByProject: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     FARM_CODE: 10001,
        //     PREDICT_MODEL_ID: 1
        // }
        return function(dispatch) {
            let url = '/masterdata/turbine/getTurbineListByProject';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setProjectTuribineList(body.body || []));
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
    getPredictTurbines: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     PREDICT_ID: 1
        // }
        return function() {
            let url = '/predict/getPredictTurbines';
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

module.exports = Turibine;
