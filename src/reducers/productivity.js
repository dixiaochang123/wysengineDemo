let DEFAULT_DATA = {
    productivity: {},
    productivityDetail: {}
};

let Productivity = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_PRODUCTIVITY':
            newState.productivity = Object.assign({}, action.data);
            return newState;
        case 'SET_PRODUCTIVITY_DETAIL':
            newState.productivityDetail = Object.assign({}, action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Productivity;
