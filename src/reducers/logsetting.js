let DEFAULT_DATA = {
    logSettingObj: {},
    logSettingList: [],
    activeLogSettingList: [],
    pageLogSettingList: [],
    searchLogSettingList: []
};

let LogSetting = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_LOG_SETTING_OBJ':
            newState.logSettingObj = Object.assign({}, action.data);
            return newState;
        case 'SET_LOG_SETTING_LIST':
            newState.logSettingList = [].concat([], action.data);
            return newState;
        case 'SET_ACTIVE_LOG_SETTING_LIST':
            newState.activeLogSettingList = [].concat([], action.data);
            return newState;
        case 'SET_PAGE_LOG_SETTING_LIST':
            newState.pageLogSettingList = [].concat(action.data);
            return newState;
        case 'SET_SEARCH_LOG_SETTING_LIST':
            newState.searchLogSettingList = [].concat([], action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = LogSetting;
