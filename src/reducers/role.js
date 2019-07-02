let DEFAULT_DATA = {
    role: {},
    roleList: [],
    pageRoleList: [],
    pageRoleListObj: {},
    roleAuthList: [],
    searchRoleList: []
};

let Role = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_ROLE':
            newState.role = Object.assign({}, action.data);
            return newState;
        case 'SET_ROLE_LIST':
            newState.roleList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_ROLE_LIST':
            newState.pageRoleList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_ROLE_LIST_OBJ':
            newState.pageRoleListObj = Object.assign({}, action.data);
            return newState;
        case 'SET_ROLE_AUTH_LIST':
            newState.roleAuthList = [].concat(action.data);
            return newState;
        case 'SET_SEARCH_ROLE_LIST':
            newState.searchRoleList = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Role;
