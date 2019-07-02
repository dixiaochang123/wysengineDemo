let DEFAULT_DATA = {
    parameter: {},
    parameterList: [],
    pageParameterList: [],
    pageParameterListObj: {},
    searchParameterList: [],
    parameterCode: []
};

let Parameter = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_PARAMETER':
            newState.parameter = Object.assign({}, action.data);
            return newState;
        case 'SET_PARAMETER_COCDE':
            newState.parameterCode = [].concat(action.data);
            return newState;
        case 'SET_PARAMETER_LIST':
            newState.parameterList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_PARAMETER_LIST':
            newState.pageParameterList = [].concat(action.data.pageData);
            newState.pageParameterListObj = Object.assign({},action.data);
            return newState;
        case 'SET_SEARCH_PARAMETER_LIST':
            newState.searchParameterList = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Parameter;
