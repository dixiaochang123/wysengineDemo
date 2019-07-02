let DEFAULT_DATA = {
    auth: {},
    authList: [],
    pageAuthList: [],
    pageAuthListObj: {},
    searchAuthList: []
};

let Auth = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_AUTH':
            newState.auth = Object.assign({}, action.data);
            return newState;
        case 'SET_AUTH_LIST':
            newState.authList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_AUTH_LIST':
            newState.pageAuthList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_AUTH_LIST_OBJ':
            newState.pageAuthListObj = Object.assign({},action.data);
            return newState;
        case 'SET_SEARCH_AUTH_LIST':
            newState.searchAuthList = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Auth;
