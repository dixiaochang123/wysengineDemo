import Request from 'utils/request';

function setHealth(data) {
    return {
        type: 'SET_HEALTH',
        data
    };
}

function setHealthDetail(data) {
    return {
        type: 'SET_HEALTH_DETAIL',
        data
    };
}

function setHealthTotal(data) {
    return {
        type: 'SET_HEALTH_TOTAL',
        data
    };
}

function setHealthArea(data) {
    return {
        type: 'SET_HEALTH_AREA',
        data
    };
}

let Health = {
    getHealthNew: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token:token,
        //     AREA:10,
        //     PROJECT:''
        // }
        return function(dispatch) {
            let url = '/kpi/health/getHealthNew';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setHealth(body.body || {}));
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
    getHealthDetail: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 10,
        //     PROJECT: '',
        //     TURBINE: ''
        // }
        return function(dispatch) {
            let url = '/kpi/health/getHealthDetail';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setHealthDetail(body.body || {}));
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
    getHealthTotal: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 10,
        //     PROJECT: '',
        //     TURBINE: ''
        // }
        return function(dispatch) {
            let url = '/kpi/health/getHealthTotal';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setHealthTotal(body.body || {}));
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
    getHealthArea: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data:{
        //     token:token,
        //     AREA:10,
        //     PROJECT:'',
        //     selectedArea:'',
        //     selectedDate:'2017-06'
        // },
        return function(dispatch) {
            let url = '/kpi/health/getHealthArea';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setHealthArea(body.body || {}));
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

module.exports = Health;
