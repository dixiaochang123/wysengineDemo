let DEFAULT_DATA = {
    paramType: {},
    paramTypeList: [],
    pageParamTypeList: [],
    pageParamTypeListObj: {},
    searchParmaTypeList: []
};

let ParamType = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_PARAM_TYPE':
            newState.paramType = Object.assign({}, action.data);
            return newState;
        case 'SET_PARAM_TYPE_LIST':
            newState.paramTypeList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_PARAM_TYPE_LIST':
            newState.pageParamTypeList = [].concat(action.data.pageData);
            newState.pageParamTypeListObj = Object.assign({},action.data);
            return newState;
        case 'SET_SEARCH_PARAM_TYPE_LIST':
            newState.searchParmaTypeList = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = ParamType;
