let DEFAULT_DATA = {
    turibine: {},
    turibineList: [],
    projectTuribineList: []
};

let Turibine = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_TURIBINE':
            newState.turibine = Object.assign({}, action.data);
            return newState;
        case 'SET_TURIBINE_LIST':
            newState.turibineList = [].concat(action.data);
            return newState;
        case 'SET_PROJECT_TRUIBINE_LIST':
            newState.projectTuribineList = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Turibine;
