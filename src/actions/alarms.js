import Request from 'utils/request';
import Constant from 'constant/index';

function setPageTodayPredictList(data) {
    return {
        type: 'SET_PAGE_TODAY_PREDICT_LIST',
        data
    };
}

function setTodayPredictDetail(data) {
    return {
        type: 'SET_TODAY_PREDICT_DETAIL',
        data
    };
}

function setTodayPredictSubDetail(data) {
    return {
        type: 'SET_TODAY_PREDICT_SUB_DETAIL',
        data
    };
}

function setPredict(data) {
    return {
        type: 'SET_PREDICT',
        data
    };
}

function setPredictParameterList(data) {
    return {
        type: 'SET_PREDICT_PARAMETER_LIST',
        data
    };
}

function setParameterData(data) {
    return {
        type: 'SET_PREDICT_DATA',
        data
    };
}

function setPredictTurbineModel(data) {
    return {
        type: 'SET_PREDICT_TURBINE_MODEL',
        data
    };
}

function setPredictTurbineModelDetail(data) {
    return {
        type: 'SET_PREDICT_TURBINE_MODEL_DETAIL',
        data
    };
}

function setPredictTurbineModelSubDetail(data) {
    return {
        type: 'SET_PREDICT_TURBINE_MODEL_SUB_DETAIL',
        data
    };
}

function setPredictComplete(data) {
    return {
        type: 'SET_PREDICT_COMPLETE',
        data
    };
}

function setPredictCompleteTotal(data) {
    return {
        type: 'SET_PREDICT_COMPLETE_TOTAL',
        data
    };
}

function setPredictCompleteSubTotal(data) {
    return {
        type: 'SET_PREDICT_COMPLETE_SUB_TOTAL',
        data
    };
}

function setPredictCompleteArea(data) {
    return {
        type: 'SET_PREDICT_COMPLETE_AREA',
        data
    };
}

function setPredictCompleteSubArea(data) {
    return {
        type: 'SET_PREDICT_COMPLETE_SUB_AREA',
        data
    };
}

function setPredictAccuracy(data) {
    return {
        type: 'SET_PREDICT_ACCURACY',
        data
    };
}

function setWorkbenchOverview(data) {
    return {
        type: 'SET_WORKBENCH_OVERVIEW',
        data
    };
}

function setWorkbenchLevel(data) {
    return {
        type: 'SET_WORKBENCH_LEVEL',
        data
    };
}

function setWorkbenchSearch(data) {
    return {
        type: 'SET_WORKBENCH_SEARCH',
        data
    };
}

function setWorkbenchApprove(data) {
    return {
        type: 'SET_WORKBENCH_APPROVE',
        data
    };
}

function setStatisticsOverview(data) {
    return {
        type: 'SET_STATISTICS_OVERVIEW',
        data
    };
}

function setStatisticsDetail(data) {
    return {
        type: 'SET_STATISTICS_DETAIL',
        data
    };
}

function setModelOverview(data) {
    return {
        type: 'SET_MODEL_OVERVIEW',
        data
    };
}

function setModelDetail(data) {
    return {
        type: 'SET_MODEL_DETAIL',
        data
    };
}

function setModelDetailSearch(data) {
    return {
        type: 'SET_MODEL_DETAIL_SEARCH',
        data
    };
}

function setNotCompleteComponent(data) {
    return {
        type: 'SET_NOT_COMPLETE_COMPONENT',
        data
    };
}

function setMaintainData(data) {
    return {
        type: 'SET_MAINTAIN_DATA',
        data
    };
}

function setHourlyForecastList(data) {
    return {
        type: 'SET_HOURLY_FORECAST_LIST',
        data
    };
}

function setAssociatedPredictAll(data) {
    return {
        type: 'SET_ASSOCIATED_PREDICT_ALL',
        data
    };
}

function setAssociatedPredictTurbine(data) {
    return {
        type: 'SET_ASSOCIATED_PREDICT_TURBINE',
        data
    };
}

function setAssociatedPredictModel(data) {
    return {
        type: 'SET_ASSOCIATED_PREDICT_MODEL',
        data
    };
}

function setPredictTurbineModelDetailSubNew(data) {
    return {
        type: 'SET_PREDICT_TURBINE_MODEL_DETAIL_SUB_NEW',
        data
    };
}

function setStatisticsSearch(data) {
    return {
        type: 'SET_STATISTICS_SEARCH',
        data
    };
}

function setCheckItemList(data) {
    return {
        type: 'SET_CHECK_ITEM_LIST',
        data
    };
}

function setToHandleWorkorderCount(data) {
    return {
        type: 'SET_TO_HANDLE_WORKORDER_COUNT',
        data
    };
}

function setHandledWorkorderCount(data) {
    return {
        type: 'SET_HANDLED_WORKORDER_COUNT',
        data
    };
}

function setWorkorderListPage(data) {
    return {
        type: 'SET_WORKORDER_LIST_PAGE',
        data
    };
}

function setSaveDisposeProcess(data) {
    return {
        type: 'SET_SAVE_DISPOSE_PROCESS',
        data
    };
}

function setSaveWorkorder(data) {
    return {
        type: 'SET_SAVE_WORKORDER',
        data
    };
}
//查看处理过程
function setDisposeProcessById(data) {
    return {
        type: 'SET_DISPOSE_PROCESS_BY_ID',
        data
    };
}
//删除处理过程
function setDeleteProcessById(data) {
    return {
        type: 'SET_DELETE_PROCESS_BY_ID',
        data
    };
}

let Alarms = {
    createPredict: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     AREA_NAME: 2,
        //     PROJECT: 3,
        //     PROJECT_NAME: 4,
        //     TURBINE: 5,
        //     LOCATION_CODE: 6,
        //     TURBINE_MODEL: 7,
        //     PREDICT_MODEL: 8,
        //     PREDICT_MODEL_NAME: 9,
        //     COMP_RELATED: 10,
        //     COMP_RELATED_NAME: 11,
        //     CONTENT: 26,
        //     LEVEL: 12,
        //     LEVEL_NAME: 13,
        //     STATUS: 14,
        //     STATUS_NAME: 15,
        //     APPROVE_CODE: 16,
        //     APPROVE_CODE_NAME: 17,
        //     APPROVER: 27,
        //     APPROVER_NAME: 18,
        //     APPROVE_TIME: '2017-07-31',
        //     COMPLETE_CODE: 20,
        //     COMPLETE_CODE_NAME: 21,
        //     PREDICT_DATE: '2017-07-31',
        //     SOURCE: 28,
        //     ASSIGNEE: 23,
        //     ASSIGNEE_NAME: 24,
        //     COMPLETE_TIME: '2017-07-31'
        // }
        return function() {
            let url = '/predict/createPredict';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    removePredict: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 16
        // }
        return function() {
            let url = '/predict/removePredict';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    modifyPredict: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // 字段同创建，多一个ID
        // data: {
        //     token: token,
        //     ID: 16,
        //     CONTENT: '00000'
        // }
        return function() {
            let url = '/predict/modifyPredict';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getPageTodayPredictList: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: '',
        //     TURBINE: ''
        // }
        return function(dispatch) {
            let url = '/predict/getPredictListToday';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPageTodayPredictList(body.body.pageData || []));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getTodayPredictDetail: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: 3,
        //     TURBINE: 5
        // }
        return function(dispatch) {
            let url = '/predict/getPredictTodayDetail';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setTodayPredictDetail(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getTodayPredictSubDetail: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: 3,
        //     TURBINE: 5
        // }
        return function(dispatch) {
            let url = '/predict/getPredictTodaySubDetail';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setTodayPredictSubDetail(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getPredictById: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     ID: 1
        // }
        return function(dispatch) {
            let url = '/predict/getPredictById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPredict(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getPredictParameterList: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     PREDICT_MODEL: 1
        // }
        return function(dispatch) {
            let url = '/predict/getParameterList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPredictParameterList(body.body || []));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getParameterData: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     PREDICT_ID: 1
        //     PARAM_NAME: name
        //     TIME_TYPE: 10
        //     turbines: 2
        // }
        return function(dispatch) {
            let url = '';
            // wysengine project
            if (Constant.PROJECT == 'wysengine') {
                url = '/predictD/getParameterData';
            }
            // mingyang project
            if (Constant.PROJECT == 'mingyang') {
                url = '/predict/getParameterData';
            }
            // xiehe project
            if (Constant.PROJECT == 'xiehe') {
                url = '/predict/getParameterData';
            }
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setParameterData(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    },
    // 2017.10.12 19:25 Thu add for demo
    getTagList: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     ID: 1
        // }
        return function() {
            let url = '/predictD/getTagList ';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getPredictTurbineModel: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     TIME: 1,
        //     AREA: 1,
        //     PROJECT: 3
        // }
        return function(dispatch) {
            let url = '/predict/getPredictTurbineModel';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPredictTurbineModel(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getPredictTurbineModelDetail: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: '',
        //     PROJECT: '',
        //     TIME: 1
        // }
        return function(dispatch) {
            let url = '/predict/getPredictTurbineModelDetail';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPredictTurbineModelDetail(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    // 区域预警接口（原来）
    getPredictTurbineModelSubDetail: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: 3,
        //     TIME: 1,
        //     TURBINE_MODEL: '',
        // }
        return function(dispatch) {
            let url = '/predict/getPredictTurbineModelDetailSub';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPredictTurbineModelSubDetail(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getPredictCompleteAllNew: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token
        // }
        return function() {
            let url = '/predict/getPredictCompleteAllNew';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getPredictComplete: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: 3,
        //     TIME: 1
        // }
        return function(dispatch) {
            let url = '/predict/getPredictComplete';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPredictComplete(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getPredictCompleteTotal: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: '',
        //     CATEGORY: 'issued'
        // }
        return function(dispatch) {
            let url = '/predict/getPredictCompleteTotal';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPredictCompleteTotal(body.body || ''));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getPredictCompleteSubTotal: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: '',
        //     CATEGORY: 'issued',
        //     MONTH: '2017-07'
        // }
        return function(dispatch) {
            let url = '/predict/getPredictCompleteTotalSub';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPredictCompleteSubTotal(body.body || ''));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getPredictCompleteArea: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: '',
        //     CATEGORY: 'issued',
        //     selectedDate: '2017-07',
        //     selectedArea: 1
        // }
        return function(dispatch) {
            let url = '/predict/getPredictCompleteArea';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPredictCompleteArea(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getPredictCompleteSubArea: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: '',
        //     CATEGORY: 'issued',
        //     selectedDate: '2017-07',
        //     selectedArea: 1
        // }
        return function(dispatch) {
            let url = '/predict/getPredictCompleteAreaSub';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPredictCompleteSubArea(body.body));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getPredictAccuracyNew: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: '',
        //     CATEGORY: 'issued',
        //     selectedDate: '2017-07',
        //     selectedArea: 1
        // }
        return function(dispatch) {
            let url = '/predict/getPredictAccuracyNew';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPredictAccuracy(body.body));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getWorkbenchOverview: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: ''
        // }
        return function(dispatch) {
            let url = '/predict/getWorkbenchOverview';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setWorkbenchOverview(body.body));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getWorkbenchLevel: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: ''
        // }
        return function(dispatch) {
            let url = '/predict/getWorkbenchLevel';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setWorkbenchLevel(body.body));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getWorkbenchSearch: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: 3,
        //     TIME: '',
        //     START: '2017-07-31',
        //     END: '2017-08-01',
        //     STATUS: '',
        //     LEVEL: '',
        //     COMP_RELATED: '',
        //     ID: 1
        // }
        return function(dispatch) {
            let url = '/predict/getWorkbenchSearch';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setWorkbenchSearch(body.body));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getWorkbenchApprove: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     STATUS: 'predictStatusPass',
        //     ID: 1,
        //     APPROVE_CODE: 'predictApprovePass'
        // }
        return function(dispatch) {
            let url = '/predict/getWorkbenchApprove';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setWorkbenchApprove(body.body));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getStatisticsOverview: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: 3,
        //     TIME: 'month'
        // }
        return function(dispatch) {
            let url = '/predict/getStatisticsOverview';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setStatisticsOverview(body.body));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getStatisticsDetail: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: 3,
        //     TIME: 'month',
        //     selected: 1
        // }
        return function(dispatch) {
            let url = '/predict/getStatisticsDetail';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setStatisticsDetail(body.body));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getModelOverview: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token
        // }
        return function(dispatch) {
            let url = '/predict/getModelOverview';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setModelOverview(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getModelDetail: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     PREDICT_MODEL: 8
        // }
        return function(dispatch) {
            let url = '/predict/getModelDetail';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setModelDetail(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getModelDetailSearch: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     PREDICT_MODEL: 8,
        //     AREA: 1,
        //     PROJECT: 3,
        //     TIME: '',
        //     START: '2017-07-30',
        //     END: '',
        //     STATUS: 6,
        //     LEVEL: '',
        //     COMP_RELATED: 123
        //     TURBINE_MODEL: 1500
        // }
        return function(dispatch) {
            let url = '/predict/getModelDetailSearch';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setModelDetailSearch(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getNotCompleteComponent: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token:''
        // }
        return function(dispatch) {
            let url = '/predict/getNotCompleteComponent';
            before && before();
            Request.get({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setNotCompleteComponent(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getMaintainData: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token:''
        // }
        return function(dispatch) {
            let url = '/predict/getMaintainData';
            before && before();
            Request.get({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setMaintainData(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getHourlyForecastList: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token:'',
        //     FARM_CODE:'10005'
        // }
        return function(dispatch) {
            let url = '/weather/caiyun/getHourlyForecastList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setHourlyForecastList(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    // 全部
    getAssociatedPredictAll: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     PROJECT:10005
        // }
        return function(dispatch) {
            let url = '/predict/getAssociatedPredictAll';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setAssociatedPredictAll(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    // 同风机
    getAssociatedPredictTurbine: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     TURBINE:10005133
        // }
        return function(dispatch) {
            let url = '/predict/getAssociatedPredictTurbine';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setAssociatedPredictTurbine(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    // 同模型
    getAssociatedPredictModel: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     TURBINE:10005133
        // }
        return function(dispatch) {
            let url = '/predict/getAssociatedPredictModel';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setAssociatedPredictModel(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail();
                    after && after(body);
                }
            });
        };
    },
    getStaticByTurbineModel: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token
        // }
        return function() {
            let url = '/predict/staticByTurbineModel';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    },
    getPredictTurbineModelDetailSubNew: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token
        // }
        return function(dispatch) {
            let url = '/predict/getPredictTurbineModelDetailSubNew';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setPredictTurbineModelDetailSubNew(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    },
    getStatisticsSearch: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        //     AREA: 1,
        //     PROJECT: 3,
        //     TIME: '',
        //     START: '2017-07-31',
        //     END: '2017-08-01',
        //     STATUS: '',
        //     LEVEL: '',
        //     COMP_RELATED: '',
        //     ID: 1
        // }
        return function(dispatch) {
            let url = '/predict/getStatisticsSearch';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setStatisticsSearch(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    },
    getCheckItemList: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     token: token,
        // }
        return function(dispatch) {
            let url = '/workorder/getCheckItemList';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setCheckItemList(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    },
    getToHandleWorkorderCount: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     AREA
        //     PROJECT
        // }
        return function(dispatch) {
            let url = '/workorder/getToHandleWorkorderCount';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setToHandleWorkorderCount(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    },
    getHandledWorkorderCount: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
        //     AREA
        //     PROJECT
        // }
        return function(dispatch) {
            let url = '/workorder/getHandledWorkorderCount';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setHandledWorkorderCount(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    },
    getWorkorderListPage: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
            //TYPE
        //     AREA
        //     PROJECT
        // }
        return function(dispatch) {
            let url = '/workorder/getWorkorderListPage';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setWorkorderListPage(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    },
    saveDisposeProcess: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
            // ID: 有id为修改,否则为新增
            // WORKORDER_ID:9
            // disposeProcessFiles:[{"ID": 4},{"ID": 1}]
            // DISPOSE_TIME:2018-03-01 02:04:11
            // DISPOSE_MAN:陈
            // DESCRIPTION:大厦大厦大厦大厦在
        // }
        return function(dispatch) {
            let url = '/workorder/saveDisposeProcess';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setSaveDisposeProcess(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    },
    saveWorkorder: function({
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
            // ID: 有id为修改,否则为新增
            // WORKORDER_ID:9
            // disposeProcessFiles:[{"ID": 4},{"ID": 1}]
            // DISPOSE_TIME:2018-03-01 02:04:11
            // DISPOSE_MAN:陈
            // DESCRIPTION:大厦大厦大厦大厦在
        // }
        return function(dispatch) {
            let url = '/workorder/saveWorkorder';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setSaveWorkorder(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    },
    getDisposeProcessById: function({//查看处理过程
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
            // ID: ID
        // }
        return function(dispatch) {
            let url = '/workorder/getDisposeProcessById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setDisposeProcessById(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    },
    deleteProcessById: function({//删除处理过程
        data,
        before,
        after,
        success,
        fail
    } = {}) {
        // data: {
            // ID: ID
        // }
        return function(dispatch) {
            let url = '/workorder/deleteProcessById';
            before && before();
            Request.post({
                url: url,
                data: data || {},
                success: function(body) {
                    dispatch(setDeleteProcessById(body.body || {}));
                    success && success(body);
                    after && after(body);
                },
                fail: function(body) {
                    fail && fail(body);
                    after && after(body);
                }
            });
        };
    }
};

module.exports = Alarms;
