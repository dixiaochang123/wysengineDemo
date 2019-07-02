let DEFAULT_DATA = {
    department: {},
    departmentList: [],
    pageDepartmentList: [],
    pageDepartmentListObj: {},
    searchDepartmentList: []
};

let Departments = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_DEPARTMENT':
            newState.department = Object.assign({}, action.data);
            return newState;
        case 'SET_DEPARTMENT_LIST':
            newState.departmentList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_DEPARTMENT_LIST':
            newState.pageDepartmentList = [].concat(action.data.pageData);
            newState.pageDepartmentListObj = Object.assign({},action.data);
            return newState;
        case 'SET_SEARCH_DEPARTMENT_LIST':
            newState.searchDepartmentList = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Departments;
