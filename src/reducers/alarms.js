let DEFAULT_DATA = {
    pageTodayPredictList: [],
    todayPredictDetail: {},
    todayPredictSubDetail: {},
    predict: {},
    predictParameterList: [],
    predictData: [],
    predictTurbineModel: {},
    predictTurbineModelDetail: {},
    predictTurbineModelSubDetail: {},
    predictComplete: {},
    predictCompleteTotal: {},
    predictCompleteSubTotal: {},
    predictCompleteArea: {},
    predictCompleteSubArea: {},
    predictAccuracy: {},
    workbenchOverview: {},
    workbenchLevel: {},
    workbenchSearch: {},
    statisticsSearch: {},
    workbenchApprove: {},
    statisticsOverview: {},
    soAreaList: [],
    compCountList: [],
    areaListPage: {},
    pageData: [],
    levelCountList: [],
    statisticsDetail: {},
    modelOverview: {},
    modelDetail: {},
    modelDetailSearch: {},
    notCompleteComponent: {},
    maintainData: {},//运维窗口
    hourlyForecastList: {},
    associatedPredictAll: [],//全部
    associatedPredictAllPagedata: [],//全部数据列表
    associatedPredictTurbine: [],//同风机
    associatedPredictTurbinePagedata: [],//同风机数据列表
    associatedPredictModel: [],//同模型
    associatedPredictModelPagedata: [],//同模型数据列表
    predictTurbineModelDetailSubNew: {},//区域预警新接口
    checkItemList: [],
    toHandleWorkorderCount: [],
    handledWorkorderCount: [],
    workorderListPage: [],
    disposeProcessById: [],//查看处理过程
    deleteProcessById: [],//删除处理过程
    saveDisposeProcess: [],//保存处理过程
    saveWorkorder: []//保存或提交工单
};

let Alarms = function(state, action) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_PAGE_TODAY_PREDICT_LIST':
            newState.pageTodayPredictList = [].concat(action.data);
            return newState;
        case 'SET_TODAY_PREDICT_DETAIL':
            newState.todayPredictDetail = Object.assign({}, action.data);
            return newState;
        case 'SET_TODAY_PREDICT_SUB_DETAIL':
            newState.todayPredictSubDetail = Object.assign({}, action.data);
            return newState;
        case 'SET_PREDICT':
            newState.predict = Object.assign({}, action.data);
            return newState;
        case 'SET_PREDICT_PARAMETER_LIST':
            newState.predictParameterList = [].concat(action.data);
            return newState;
        case 'SET_PREDICT_DATA':
            newState.predictData = [].concat(action.data);
            return newState;
        case 'SET_PREDICT_TURBINE_MODEL':
            newState.predictTurbineModel = Object.assign({}, action.data);
            return newState;
        case 'SET_PREDICT_TURBINE_MODEL_DETAIL':
            newState.predictTurbineModelDetail = Object.assign({}, action.data);
            return newState;
        case 'SET_PREDICT_TURBINE_MODEL_SUB_DETAIL':
            newState.predictTurbineModelSubDetail = Object.assign({}, action.data);
            return newState;
        case 'SET_PREDICT_COMPLETE':
            newState.predictComplete = Object.assign({}, action.data);
            return newState;
        case 'SET_PREDICT_COMPLETE_TOTAL':
            newState.predictCompleteTotal = Object.assign({}, action.data.monthRate);
            return newState;
        case 'SET_PREDICT_COMPLETE_SUB_TOTAL':
            newState.predictCompleteSubTotal = Object.assign({}, action.data);
            return newState;
        case 'SET_PREDICT_COMPLETE_AREA':
            newState.predictCompleteArea = Object.assign({}, action.data);
            return newState;
        case 'SET_PREDICT_COMPLETE_SUB_AREA':
            newState.predictCompleteSubArea = Object.assign({}, action.data);
            return newState;
        case 'SET_PREDICT_ACCURACY':
            newState.predictAccuracy = Object.assign({}, action.data);
            return newState;
        case 'SET_WORKBENCH_OVERVIEW':
            newState.workbenchOverview = Object.assign({}, action.data);
            return newState;
        case 'SET_WORKBENCH_LEVEL':
            newState.workbenchLevel = Object.assign({}, action.data);
            return newState;
        case 'SET_WORKBENCH_SEARCH':
            newState.workbenchSearch = Object.assign({}, action.data);
            return newState;
        case 'SET_STATISTICS_SEARCH':
            newState.statisticsSearch = Object.assign({}, action.data);
            return newState;
        case 'SET_WORKBENCH_APPROVE':
            newState.workbenchApprove = Object.assign({}, action.data);
            return newState;
        case 'SET_STATISTICS_OVERVIEW':
            newState.statisticsOverview = Object.assign({}, action.data);
            return newState;
        case 'SET_STATISTICS_DETAIL':
            newState.statisticsDetail = Object.assign({}, action.data);
            return newState;
        case 'SET_MODEL_OVERVIEW':
            newState.modelOverview = Object.assign({}, action.data);
            return newState;
        case 'SET_MODEL_DETAIL':
            newState.modelDetail = Object.assign({}, action.data);
            return newState;
        case 'SET_MODEL_DETAIL_SEARCH':
            newState.modelDetailSearch = Object.assign({}, action.data);
            return newState;
        case 'SET_NOT_COMPLETE_COMPONENT':
            newState.notCompleteComponent = Object.assign({}, action.data);
            return newState;
        case 'SET_MAINTAIN_DATA':
            newState.maintainData = Object.assign({}, action.data);
            return newState;
        case 'SET_HOURLY_FORECAST_LIST':
            newState.hourlyForecastList = [].concat(action.data);
            return newState;
        case 'SET_ASSOCIATED_PREDICT_ALL':
            newState.associatedPredictAll = [].concat(action.data);
            newState.associatedPredictAllPagedata = [].concat(action.data.pageData);
            return newState;
        case 'SET_ASSOCIATED_PREDICT_TURBINE':
            newState.associatedPredictTurbine = [].concat(action.data);
            newState.associatedPredictTurbinePagedata = [].concat(action.data.pageData);
            return newState;
        case 'SET_ASSOCIATED_PREDICT_MODEL':
            newState.associatedPredictModel = [].concat(action.data);
            newState.associatedPredictModelPagedata = [].concat(action.data.pageData);
            return newState;
        case 'SET_PREDICT_TURBINE_MODEL_DETAIL_SUB_NEW':
            newState.predictTurbineModelDetailSubNew = Object.assign({}, action.data);
            return newState;
        case 'SET_CHECK_ITEM_LIST':
            newState.checkItemList = [].concat(action.data);
            return newState;
        case 'SET_TO_HANDLE_WORKORDER_COUNT':
            newState.toHandleWorkorderCount = [].concat(action.data);
            return newState;
        case 'SET_HANDLED_WORKORDER_COUNT':
            newState.handledWorkorderCount = [].concat(action.data);
            return newState;
        case 'SET_WORKORDER_LIST_PAGE':
            newState.workorderListPage = [].concat(action.data);
            return newState;
        case 'SET_SAVE_DISPOSE_PROCESS':
            newState.saveDisposeProcess = [].concat(action.data);
            return newState;
        case 'SET_SAVE_WORKORDER':
            newState.saveWorkorder = [].concat(action.data);
            return newState;
        case 'SET_DISPOSE_PROCESS_BY_ID':
            newState.disposeProcessById = [].concat(action.data);
            return newState;
        case 'SET_DELETE_PROCESS_BY_ID':
            newState.deleteProcessById = [].concat(action.data);
            return newState;
        default:
            return newState || DEFAULT_DATA;
    }
};

module.exports = Alarms;
