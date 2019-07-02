let DEFAULT_DATA = {
    windsite: {},
    windsiteList: [],
    pageWindsiteList: [],
    onlineWindsiteList: [],
    pageOnlineWindsiteList: [],
    areaOnlineWindsiteList: [],
    turbinePushedPredict: [],
    projectPushedPredict: []
};

let Windsite = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_WINDSITE':
            newState.windsite = Object.assign({}, action.data);
            return newState;
        case 'SET_WINDSITE_LIST':
            newState.windsiteList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_WINDSITE_LIST':
            newState.pageWindsiteList = [].concat(action.data);
            return newState;
        case 'SET_ONLINE_WINDSITE_LIST':
            newState.onlineWindsiteList = [].concat(action.data);
            return newState;
        case 'SET_WINDSITE_LIST_ONLINE':
            newState.windsiteListOnline = [].concat(action.data);
            return newState;
        case 'SET_AREA_ONLINE_WINDSITE_LIST':
            newState.areaOnlineWindsiteList = [].concat(action.data);
            return newState;
        case 'SET_TURBINE_PUSHED_PREDICT':
            newState.turbinePushedPredict = [].concat(action.data);
            return newState;
        case 'SET_PROJECT_PUSHED_PREDICT':
            newState.projectPushedPredict = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Windsite;
