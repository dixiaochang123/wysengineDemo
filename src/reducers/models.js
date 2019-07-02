let DEFAULT_DATA = {
    model: {},
    modelTotal: 0,
    modelList: [],
    levelModelList: [],
    modelLevelList: [],
    typeModelList: [],
    modelListPage: {},
    modelListPageData: []
};

let Models = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_MODEL':
            newState.model = Object.assign({}, action.data);
            return newState;
        case 'SET_MODEL_TOTAL':
            newState.modelTotal = action.data;
            return newState;
        case 'SET_MODEL_LIST':
            newState.modelList = [].concat(action.data);
            return newState;
        case 'SET_LEVEL_MODEL_LIST':
            newState.levelModelList = [].concat(action.data);
            return newState;
        case 'SET_MODEL_LEVEL_LIST':
            newState.modelLevelList = [].concat(action.data);
            return newState;
        case 'SET_TYPE_MODEL_LIST':
            newState.typeModelList = [].concat(action.data);
            return newState;
        case 'SET_MODEL_LIST_PAGE':
            newState.modelListPage = Object.assign({}, action.data);
            newState.modelListPageData = [].concat(action.data.pageData);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Models;
