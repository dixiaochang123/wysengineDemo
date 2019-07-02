let DEFAULT_DATA = {
    module: {},
    moduleList: [],
    pageModuleList: [],
    pageModuleListObj: {},
    searchModuleList: []
};

let Modules = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_MODULE':
            newState.module = Object.assign({}, action.data);
            return newState;
        case 'SET_MODULE_LIST':
            newState.moduleList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_MODULE_LIST':
            newState.pageModuleList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_MODULE_LIST_OBJ':
            newState.pageModuleListObj = Object.assign({}, action.data);
            return newState;
        case 'SET_SEARCH_MODULE_LIST':
            newState.searchModuleList = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Modules;
