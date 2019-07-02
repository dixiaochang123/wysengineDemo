let DEFAULT_DATA = {
    menu: {},
    menuList: [],
    userMenuList: [],
    pageMenuList: [],
    pageMenuListObj: {},
    searchMenuList: []
};

let Menu = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_MENU':
            newState.menu = Object.assign({}, action.data);
            return newState;
        case 'SET_MENU_LIST':
            newState.menuList = [].concat(action.data);
            return newState;
        case 'SET_USER_MENU_LIST':
            newState.userMenuList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_MENU_LIST':
            newState.pageMenuList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_MENU_LIST_OBJ':
            newState.pageMenuListObj = Object.assign({}, action.data);
            return newState;
        case 'SET_SEARCH_MENU_LIST':
            newState.searchMenuList = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Menu;
