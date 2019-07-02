let DEFAULT_DATA = {
    weeklyReportList: [],
    monthlyReportList: [],
    yearlyReportList: []
};

let Reports = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_WEEKLY_REPORT_LIST':
            newState.weeklyReportList = [].concat(action.data);
            return newState;
        case 'SET_MONTHLY_REPORT_LIST':
            newState.monthlyReportList = [].concat(action.data);
            return newState;
        case 'SET_YEARLY_REPORT_LIST':
            newState.yearlyReportList = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Reports;
