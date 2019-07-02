let DEFAULT_DATA = {
    company: {},
    companyList: 0,
    pageCompanyList: [],
    pageCompanyListObj: {},
    searchCompanyList: []
};

let Company = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_COMPANY':
            newState.company = Object.assign({}, action.data);
            return newState;
        case 'SET_COMPANY_LIST':
            newState.companyList = [].concat(action.data);
            return newState;
        case 'SET_PAGE_COMPANY_LIST':
            newState.pageCompanyList = [].concat(action.data.pageData);
            newState.pageCompanyListObj = Object.assign({}, action.data);
            return newState;
        case 'SET_SEARCH_COMPANY_LIST':
            newState.searchCompanyList = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Company;
