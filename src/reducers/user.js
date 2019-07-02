let DEFAULT_DATA = {
    user: {},
    loginFailTimes: 0,
    pageUserList: [],
    pageUserListObj: {},
    searchUserList: []
};

let User = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_USER':
            newState.user = Object.assign({}, action.data);
            return newState;
        case 'SET_LOGIN_FAIL_TIMES':
            newState.loginFailTimes = action.data;
            return newState;
        case 'SET_PAGE_USER_LIST':
            newState.pageUserList = [].concat(action.data.pageData);
            return newState;
        case 'SET_SEARCH_USER_LIST':
            newState.searchUserList = [].concat(action.data.pageData);
            newState.pageUserListObj = Object.assign({}, action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = User;
