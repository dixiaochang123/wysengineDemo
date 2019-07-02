import Request from 'utils/request';

function setWeeklyReportList(data) {
    return {
        type: 'SET_WEEKLY_REPORT_LIST',
        data
    };
}

function setMonthlyReportList(data) {
    return {
        type: 'SET_MONTHLY_REPORT_LIST',
        data
    };
}

function setYearlyReportList(data) {
    return {
        type: 'SET_YEARLY_REPORT_LIST',
        data
    };
}

let Reports = {
    getWeeklyReportList: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     REPORT_YEAR: '2017'
        // }
        return function(dispatch) {
            let url = '/report/getWeeklyReportList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setWeeklyReportList(body.body || []));
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
    getMonthlyReportList: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     REPORT_YEAR: '2017'
        // }
        return function(dispatch) {
            let url = '/report/getMonthlyReportList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setMonthlyReportList(body.body || []));
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
    getYearlyReportList: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     REPORT_YEAR: '2017'
        // }
        return function(dispatch) {
            let url = '/report/getYearlyReportList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setYearlyReportList(body.body || []));
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
    exportReports: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        // }
        return function() {
            let url = '/report/exportReport';
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

module.exports = Reports;
