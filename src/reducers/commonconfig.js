let DEFAULT_DATA = {
    commonConfig: {},
    commonConfigList: {}
};

let CommonConfig = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_COMMON_CONFIG':
            newState.commonConfig = Object.assign({}, action.data);
            return newState;
        case 'SET_COMMON_CONFIG_LIST':
            newState.commonConfigList = Object.assign({}, action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = CommonConfig;
