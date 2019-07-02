let DEFAULT_DATA = {
    log: {},
    pageLogList: [],
    searchLogList: [],
    workorderById: []
};

let Log = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_LOG':
            newState.log = Object.assign({}, action.data);
            return newState;
        case 'SET_PAGE_LOG_LIST':
            newState.pageLogList = [].concat(action.data);
            return newState;
        case 'SET_SEARCH_LOG_LIST':
            newState.searchLogList = [].concat(action.data);
            return newState;
        case 'SET_WORKORDER_BY_ID':
            newState.workorderById = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Log;
