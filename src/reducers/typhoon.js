let DEFAULT_DATA = {
    typhoon: {},
    typhoonListObj: {}
};

let Typhoon = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_TYPHOON_LIST_OBJ':
            newState.typhoonListObj = Object.assign({}, action.data);
            return newState;
        case 'SET_TYPHOON':
            newState.typhoon = Object.assign({}, action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Typhoon;
