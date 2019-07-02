let DEFAULT_DATA = {
    area: {},
    areaList: [],
    pageAreaList: [],
    searchAreaList: []
};

let Area = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_AREA':
            newState.area = Object.assign({}, action.data);
            return newState;
        case 'SET_AREA_LIST':
            newState.areaList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_AREA_LIST':
            newState.pageAreaList = [].concat(action.data);
            return newState;
        case 'SET_SEARCH_AREA_LIST':
            newState.searchAreaList = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Area;
