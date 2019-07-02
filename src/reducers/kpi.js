let DEFAULT_DATA = {
    standardKpi: {},
    kpiLastAboutYear: {}
};

let Kpi = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_STANDARD_KPI':
            newState.standardKpi = Object.assign({}, action.data);
            return newState;
        case 'SET_KPI_LAST_ABOUT_YEAR':
            newState.kpiLastAboutYear = Object.assign({}, action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Kpi;
