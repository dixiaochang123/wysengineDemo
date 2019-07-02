import Request from 'utils/request';

function setProductivity(data) {
    return {
        type: 'SET_PRODUCTIVITY',
        data
    };
}

function setProductivityDetail(data) {
    return {
        type: 'SET_PRODUCTIVITY_DETAIL',
        data
    };
}

let Productivity = {
    getProductivityNew: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: '',
        //     TURBINE: 2
        // }
        return function(dispatch) {
            let url = '/kpi/production/getProductionNew';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setProductivity(body.body));
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
    getProductivityDetail: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: '',
        //     TURBINE: 2
        // }
        return function(dispatch) {
            let url = '/kpi/production/getProductionDetail';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setProductivityDetail(body.body));
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

module.exports = Productivity;
