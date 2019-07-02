let DEFAULT_DATA = {
    health: {},
    healthDetail: {},
    healthArea: {},
    healthTotal: {}
};

let Health = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_HEALTH':
            newState.health = Object.assign({}, action.data);
            return newState;
        case 'SET_HEALTH_DETAIL':
            newState.healthDetail = Object.assign({}, action.data);
            return newState;
        case 'SET_HEALTH_TOTAL':
            newState.healthTotal = Object.assign({}, action.data);
            return newState;
        case 'SET_HEALTH_AREA':
            newState.healthArea = Object.assign({}, action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Health;
