let DEFAULT_DATA = {
    newestForecastList: [],
    newestForecastListObj: {}
};

let Homepage = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_NEWEST_FORECAST_LIST':
            newState.newestForecastList = [].concat(action.data);
            return newState;
        case 'SET_NEWEST_FORECAST_LIST_OBJ':
            newState.newestForecastListObj = Object.assign({}, action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Homepage;
