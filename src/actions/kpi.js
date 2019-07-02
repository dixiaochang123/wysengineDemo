import Request from 'utils/request';

function setStandardKpi(data) {
    return {
        type: 'SET_STANDARD_KPI',
        data
    };
}

function setKpiLastAboutYear(data) {
    return {
        type: 'SET_KPI_LAST_ABOUT_YEAR',
        data
    };
}

let Kpi = {
    getStandardKpi: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     CALC_DATE: '2017-07',
        //     AREA: '50',
        //     PROJECT: '10005',
        //     TURBINE_MODEL: 'MY1.5'
        // }
        return function(dispatch) {
            let url = '/kpi/standard/getStandardKpi';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setStandardKpi(body.body || {}));
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
    getKpiLastAboutYear: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token
        //     AREA: ''
        //     PROJECT: ''
        // }
        return function(dispatch) {
            let url = '/kpi/standard/getKpiLastAboutYear';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setKpiLastAboutYear(body.body || {}));
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

module.exports = Kpi;
