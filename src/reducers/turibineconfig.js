let DEFAULT_DATA = {
    createTurbineConfig: {},
    turibineConfig: {},
    turibineConfigList: [],
    projectTuribineConfigList: [],
    turibineConfigListPage: [],
    turibineConfigListPageDate: []
};

let TuribineConfig = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'CREATE_TURBINE_CONFIG':
            newState.createTurbineConfig = Object.assign({}, action.data);
            return newState;
        case 'SET_TURIBINE_CONFIG':
            newState.turibineConfig = Object.assign({}, action.data);
            return newState;
        case 'SET_TRUIBINE_CONFIG_LIST':
            newState.turibineConfigList = [].concat(action.data);
            return newState;
        case 'SET_PROJECT_TURIBINE_CONFIG_LIST':
            newState.projectTuribineConfigList = [].concat(action.data);
            return newState;
        case 'SET_PROJECT_TURIBINE_CONFIG_LIST':
            newState.projectTuribineConfigList = [].concat(action.data);
            return newState;
        case 'SET_TRUIBINE_CONFIG_LIST_PAGE':
            newState.turibineConfigListPage = [].concat(action.data);
            newState.turibineConfigListPageDate = [].concat(action.data.pageData);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = TuribineConfig;
