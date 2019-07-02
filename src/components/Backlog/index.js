// 预警详情
import React from 'react';
import Moment from 'moment';
const ReactRedux = require('react-redux');

import Utils from 'utils/utils';
import actions from 'actions';
import Constant from 'constant/index';
import User from 'utils/user';

import Navbar from 'subComponents/Navbar';
// 预警模型
import PredictModel from 'subComponents/PredictModel';
// 预警信息
import PredictInfo from 'subComponents/PredictInfo';
// 预警操作(编辑、审核)
import PredictOperation from 'subComponents/PredictOperation';
// 预警详情变量变化趋势
import WarningInforDetailsChart from 'subComponents/WarningInforDetailsChart';
// 关联预警
import WarningInforDetailsRelation from 'subComponents/WarningInforDetailsRelation';
// 维护窗口
import Pending from 'components/Pending';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

const TAB_NAME_MAP = {
    win: '维护窗口',
    predict: '关联预警',
    variable: '当前变量'
};

class Backlog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 当前tab
            currTab: 'variable',
            // 真实的请求数据
            truePostData: {},
            // 风机列表
            turbines: [],
            // 变量列表
            variables: [],
            // 预警详情
            predictData: [],
            // 预警类型共三种：模型预警、规则预警、translog预警
            // 预警类型是否为TranslogModel
            // TranslogModel类型预警会特殊处理，不能选择风场
            isTranslogModel: false,
            // 模型预警和规则预警带有查看全场标志的才可选风机
            // 是否查看全场：
            isViewAll: 0,
            // 是否风场预警
            isFarmPredict: 0,
            // 风场ID
            project: '',
            // 风机
            turbine: '',
            // 模型
            predictModel: '',
            // 显示、隐藏变量
            showVars: false,
            // 当前展示的预警
            currPredict: {},
            //是否是待处理
            backlog: true,
            AREA: '',
            PROJECT: '',
            TYPE: 0,
            // 同风机
            pager: {
                total: 1,
                pageSize: 15,
                currPage: 1
            },
            pageData: [],
            predictId: '',
            hourlyForecastList: {}

        };

        // 处理tab切换
        this.handleTabSwitch = this.handleTabSwitch.bind(this);
        // 处理筛选条件变化
        this.handleFilterChange = this.handleFilterChange.bind(this);
        // 查看模型详情
        this.viewModelDetail = this.viewModelDetail.bind(this);
        // 获取变化趋势
        this.getTendency = this.getTendency.bind(this);
        // 展示、隐藏变量选择框
        this.toggleVars = this.toggleVars.bind(this);
        // 清除图表数据
        this.clearChart = this.clearChart.bind(this);
        // 关联预警查看预警详情
        this.viewAlarmDetail = this.viewAlarmDetail.bind(this);
        // 获取预警详情
        this.getPredictById = this.getPredictById.bind(this);
        // 处理预警变化
        this.handlePredictChange = this.handlePredictChange.bind(this);
        //待处理
        this.handleBacklog = this.handleBacklog.bind(this);
        //未完成
        this.handleComplete = this.handleComplete.bind(this);
        //头部区域点击事件
        this.initDataByAreaOrWindsite = this.initDataByAreaOrWindsite.bind(this);
        //查询工单列表
        this.getWorkorderListPage = this.getWorkorderListPage.bind(this);
        // 查询工单分页列表翻页
        this.handleToolPageChange = this.handleToolPageChange.bind(this);
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
    }
    componentDidUpdate() {
        Utils.handleBigScreenDomHeight();
    }
    componentWillMount() {
        let area = User.get('currentArea').CODE || '';
        let project = User.get('currentWindsite').CODE_ || '';

        // let predictId = 71;
        // this.getPredictById(predictId);
        $(document.body).removeClass('btnLoading');
        //待办数目
        this.props.getToHandleWorkorderCount({
            data: {
                AREA: area,
                PROJECT: project
            }
        });
        //已完成
        this.props.getHandledWorkorderCount({
            data: {
                AREA: area,
                PROJECT: project
            }
        });
        this.setState({
            AREA: area,
            PROJECT: project
        },function() {
            this.getWorkorderListPage(1,0);
        }.bind(this))
    }
    initDataByAreaOrWindsite() {
         let area = User.get('currentArea').CODE;
         let project = User.get('currentWindsite').CODE_ || '';

         this.props.getToHandleWorkorderCount({
            data: {
                AREA: area,
                PROJECT: project
            }
        });
        this.props.getHandledWorkorderCount({
            data: {
                AREA: area,
                PROJECT: project
            }
        })
        this.setState({
            AREA: area,
            PROJECT: project
        },function() {
            this.getWorkorderListPage(1,0);
        }.bind(this))
    }
    getWorkorderListPage(currPage,type) {
        let area = this.state.AREA;
        let project = this.state.PROJECT;
        this.props.getWorkorderListPage({
            data: {
                currentPage: currPage || this.state.pager.currPage,
                showCount: this.state.pager.pageSize,
                TYPE: type,
                AREA: area,
                PROJECT: project
            },
            success: function(res) {
                let predictId = !!res.body.pageData && !!res.body.pageData[0] ? res.body.pageData[0].ID : '';

                let pager = this.state.pager;
                pager.total = this.props.workorderListPage[0].totalResult;
                // pager.currPage = currPage || 1;
                this.setState({
                    pager: pager,
                    predictId: predictId
                },function() {
                    this.getPredictById(this.state.predictId);
                    this.props.getHourlyForecastList({
                        data: {
                            predictId: predictId
                        },
                        success: function(res) {
                            this.setState({
                                hourlyForecastList: res.body || {}
                            });
                        }.bind(this)
                    });
                    this.setState({
                        pageData: res.body.pageData
                    })
                }.bind(this))
            }.bind(this)
        })
    }
    handleToolPageChange(item) {
        let TYPE = this.state.TYPE || 0;
        let pager = this.state.pager;
        pager.currPage = item;
        this.setState({
            pager: pager
        });
        this.getWorkorderListPage(item, TYPE);
    }

    handleBacklog() {
        let pager = this.state.pager;
        pager.currPage = 1;
        this.setState({
            backlog:true,
            TYPE: 0,
            pager: pager
        })
        this.getWorkorderListPage(pager.currPage, 0) 
    }

    handleComplete() {
        let pager = this.state.pager;
        pager.currPage = 1;
        this.setState({
            backlog: false,
            TYPE: 1,
            pager: pager
        })
        this.getWorkorderListPage(pager.currPage, 1) 
    }

    getPredictById(predictId) {
        let postData = {
            ID: predictId
        };

        // 获取预警详情
        this.props.getPredictById({
            data: postData,
            success: function(predict) {
                // 获取变量列表
                this.setState({
                    project: predict.body.PROJECT,
                    turbine: predict.body.TURBINE,
                    predictModel: predict.body.PREDICT_MODEL
                });

                // 获取预警模型详情，判断是否是查看全场
                this.props.getModelById({
                    data: {
                        ID: predict.body.PREDICT_MODEL
                    },
                    success: function(res) {
                        $(document.body).removeClass('btnLoading');
                        this.setState({
                            isTranslogModel: !!res.body && !!res.body.TYPE_CODE ? res.body.TYPE_CODE == 'modelType_Tracelog' : false,
                            isViewAll: !!res.body && res.body.VIEW_ALL != null ? res.body.VIEW_ALL : 0,
                            isFarmPredict: !!res.body && res.body.FARM_PREDICT != null ? res.body.FARM_PREDICT : 0
                        }, function() {
                            // mingyang project
                            if (Constant.PROJECT == 'mingyang') {
                                // 查看全场(包含风场预警)获取风机列表
                                if (this.state.isViewAll == 1) {
                                    this.props.getTurbineListByProject({
                                        data: {
                                            FARM_CODE: predict.body.PROJECT,
                                            PREDICT_MODEL_ID: predict.body.PREDICT_MODEL
                                        },
                                        success: function(innerRes) {
                                            this.setState({
                                                turbines: innerRes.body || []
                                            });
                                        }.bind(this)
                                    });
                                    return false;
                                }

                            }
                        }.bind(this));
                    }.bind(this)
                });

                // 获取变量名
                // wysengine project
                if (Constant.PROJECT == 'wysengine') {
                    this.props.getTagList({
                        data: postData,
                        success: function(res) {
                            let variables = !!res.body && res.body.length > 0 ? res.body.map((variable) => {
                                return {
                                    key: variable.demo_tag_name,
                                    value: variable.tag_description
                                };
                            }) : [];
                            this.setState({
                                variables: variables
                            });
                        }.bind(this)
                    });
                }
                // mingyang project
                if (Constant.PROJECT == 'mingyang') {
                    // 非查看全场且非全场预警（可选风机时），通过预警模型和风机获取变量
                    if (this.state.isViewAll == 0) {
                        this.props.getTurbineContigListByTurbine({
                            data: {
                                PREDICT_MODEL_ID: predict.body.PREDICT_MODEL,
                                WTGS_CODE: predict.body.TURBINE
                            },
                            success: function(res) {
                                this.setState({
                                    variables: res.body || []
                                }, function() {
                                    this.getTendency({
                                        variables: [],
                                        time: 1
                                    });
                                }.bind(this));
                            }.bind(this)
                        });
                    }
                }
                // xiehe project
                if (Constant.PROJECT == 'xiehe') {
                    this.props.getTurbineContigListByTurbine({
                        data: {
                            PREDICT_MODEL_ID: predict.body.PREDICT_MODEL,
                            WTGS_CODE: predict.body.TURBINE
                        },
                        success: function(res) {
                            this.setState({
                                variables: res.body || []
                            }, function() {
                                this.getTendency({
                                    variables: [],
                                    time: 1
                                });
                            }.bind(this));
                        }.bind(this)
                    });
                }
            }.bind(this)
        });
    }
    handleTabSwitch(tab) {
        if (tab == 'variable') {
            this.toggleVars();
        }
        this.setState({
            currTab: tab
        });
    }
    toggleVars() {
        let showVars = this.state.showVars;
        this.setState({
            showVars: !showVars
        });
    }
    clearChart() {
        this.setState({
            predictData: {}
        });
    }
    handleFilterChange(filter) {
        // 查看全场且选择了风机，通过选择的风机获取变量
        if (this.state.isViewAll == 1) {
            let turbineCode = filter.turbines.length == 1 ? (filter.turbines[0].split('__')[0] || '') : (filter.turbines[1].split('__')[0] || '');
            this.props.getTurbineContigListByTurbine({
                data: {
                    PREDICT_MODEL_ID: this.state.predictModel,
                    WTGS_CODE: turbineCode
                },
                success: function(res) {
                    this.setState({
                        variables: res.body || []
                    }, function() {
                        this.getTendency({
                            variables: !!filter.variables ? filter.variables : [],
                            turbines: filter.turbines,
                            time: 1
                        });
                    }.bind(this));
                }.bind(this)
            });
            return false;
        }
        // 非查看全场，获取变量变化趋势
        this.getTendency({
            variables: filter.variables,
            turbines: filter.turbines,
            time: filter.time || 1
        });
    }
    viewModelDetail() {
        let predict = this.props.predict || {};
        this.props.router.push({
            pathname: '/modeldetail',
            state: {
                modelId: predict.PREDICT_MODEL
            }
        });
    }
    getTendency(filter) {
        if (filter.variables.length == 0) {
            return false;
        }
        filter.turbines = !!filter.turbines ? filter.turbines : [];
        if (this.state.isViewAll == 1 && filter.turbines.length > 0) {
            filter.turbines = filter.turbines.map((item) => item.split('__')[0]);
        }

        // 获取变量趋势请求的postdata
        let truePostData = {};
        // wysengine project
        if (Constant.PROJECT == 'wysengine') {
            truePostData = {
                ID: this.props.location.state.alarmId,
                demoTagColumns: filter.variables.length > 0 ? filter.variables.map((item) => {
                    let itemKey = '' + item;
                    return itemKey.split('__')[0];
                }).join(',') + ',' : '',
                TIME_TYPE: filter.time
            };
        }
        // mingyang project
        if (Constant.PROJECT == 'mingyang') {
            let variables = this.state.variables;
            truePostData = {
                PREDICT_ID: this.props.location.state.alarmId,
                PARAM_NAME: filter.variables.length > 0 ? filter.variables.map((item) => {
                    let itemKey = '' + item;
                    let targetVar = variables.find((variable) => variable.TAG_NAME_COM == itemKey.split('__')[0]);
                    return targetVar.TAG_NAME_COM;
                }).join(',') : null,
                TIME_TYPE: filter.time
            };

            if (this.state.isViewAll == 1 && !Utils.isEmpty(filter.turbines)) {
                let turbines = filter.turbines.length > 0 ? filter.turbines.map((item) => item.split('__')[0]) : [];
                truePostData = Object.assign({}, truePostData, {
                    turbines: turbines.join(',')
                });
            }
        }

        this.setState({
            truePostData: truePostData
        }, function() {
            this.props.getParameterData({
                data: truePostData,
                success: function(res) {
                    $('#warningInforDetailsChart1Canvas').removeClass('btnLoading');
                    $('#warningInforDetailsChart2Canvas').removeClass('btnLoading');
                    let predictDataKeys = Object.keys(res.body);
                    predictDataKeys = predictDataKeys.filter((item) => item != '' && ['isTranslogModel', 'viewAll', 'farmPredict'].indexOf(item) == -1);
                    let predictData = {};
                    predictDataKeys.forEach((key) => {
                        predictData[key] = [].concat(res.body[key]);
                    });
                    this.setState({
                        predictData: predictData
                    });
                }.bind(this),
                fail: function(res) {
                    $('#warningInforDetailsChart1Canvas').removeClass('btnLoading');
                    $('#warningInforDetailsChart2Canvas').removeClass('btnLoading');
                    Utils.tooltip(res.head.msg);
                    return false;
                }
            });
        }.bind(this));
    }
    viewAlarmDetail(alarm) {
        console.log(alarm)
        this.setState({
            currTab: 'variable'
        }, function() {
            this.getPredictById(alarm.ID);
            this.props.router.push({
                pathname: '/executeLog',
                state: {
                    alarmId: alarm.ID,
                    alarmCode: alarm.AREA,
                    projectCode: alarm.PROJECT,
                    workorderId: alarm.workorderId
                }
            });
        }.bind(this));
    }
    handlePredictChange(predictIndex) {
        let predict = this.props.predict || {};
        let predictList = !!predict ? predict.predictDetailList : [];
        let finalPredictList = predictList.slice(0).reverse();
        let targetPredict = finalPredictList[predictIndex];
        this.setState({
            currPredict: targetPredict
        });
    }
    
    render() {
        let predict = this.props.predict || {};
        let predictData = !!this.state.predictData ? this.state.predictData : {};
        let predictDataKeys = Object.keys(predictData) || [];
        let predictDataNormalKeys = [];
        let predictDataFFTKeys = [];
        if (this.state.isTranslogModel) {
            predictDataNormalKeys = predictDataKeys.filter((item) => item.slice(-3) != 'FFT');
            predictDataFFTKeys = predictDataKeys.filter((item) => item.slice(-3) == 'FFT');
        } else {
            predictDataNormalKeys = [].concat(predictDataKeys);
            predictDataFFTKeys = [];
        }
        let finalPredictData = {};
        let finalPredictDataFFT = {};
        predictDataNormalKeys.forEach((item) => {
            if (item != '') {
                finalPredictData[item] = [].concat(predictData[item]);
            }
        });
        predictDataFFTKeys.forEach((item) => {
            if (item != '') {
                let newItem = item.slice(0, -3);
                finalPredictDataFFT[newItem] = [].concat(predictData[item]);
            }
        });

        let isViewAll = this.state.isViewAll == 1;
        let turbines = this.state.turbines.map((item) => {
            return {
                key: isViewAll ? item.CODE_ : item.ID,
                value: item.LOCATION_CODE
            };
        }) || [];

        // 变量数组
        let variables = [];
        // wysengine project
        if (Constant.PROJECT == 'wysengine') {
            variables = this.state.variables || [];
        }
        // mingyang project
        if (Constant.PROJECT == 'mingyang') {
            variables = this.state.variables.map((item) => {
                return {
                    key: '' + item.TAG_NAME_COM,
                    value: this.state.isTranslogModel ? item.TAG_NAME_COM : item.DESCRIPTION,
                    isActive: item.PREDICT_USED == 1
                };
            }) || [];
        }
        // xiehe project
        if (Constant.PROJECT == 'xiehe') {
            variables = this.state.variables.map((item) => {
                return {
                    key: '' + item.TAG_NAME_COM,
                    value: this.state.isTranslogModel ? item.TAG_NAME_COM : item.DESCRIPTION,
                    isActive: item.PREDICT_USED == 1
                };
            }) || [];
        }

        let currTab = this.state.currTab;
        let predictList = !!predict ? predict.predictDetailList : [];
        let currPredict = this.state.currPredict || predictList[0];
        let predictStartTime = !Utils.isEmpty(currPredict) ? Moment(currPredict.START_TIME).format('YYYY-MM-DD HH:mm:ss') : Moment(predict.START_TIME).format('YYYY-MM-DD HH:mm:ss');
        let predictEndTime = !Utils.isEmpty(currPredict) ? Moment(currPredict.END_TIME).format('YYYY-MM-DD HH:mm:ss') : Moment(predict.END_TIME).format('YYYY-MM-DD HH:mm:ss');

        let toHandleWorkorderCount = this.props.toHandleWorkorderCount || [];//待办数目
        let handledWorkorderCount = this.props.handledWorkorderCount || [];//已完成数目

        let workorderListPage = this.props.workorderListPage || [];
        let pageData = !!this.state.pageData ? this.state.pageData : [];

        return (
            <div className={style.box + ' full'}>
                <Navbar
                    showAreaIcon={true}
                    props={this.props}
                    onAreaOrWindsiteChange={this.initDataByAreaOrWindsite}/>
                <div className='boxInner'>
                    <div className={!!this.state.backlog ? style.header + ' pure-g' : style.header1 + ' pure-g'}>
                        <div className='pure-u-12-24' onClick={this.handleBacklog}>
                            <span className={style.backlog}>待处理</span>
                            <span className={style.unfinished}>{!!toHandleWorkorderCount && !!toHandleWorkorderCount[0] ? toHandleWorkorderCount[0].count : 0}</span>
                        </div>
                        <div className='pure-u-12-24' onClick={this.handleComplete}>
                            <span className={style.complete}>已完成</span>
                            <span>{!!handledWorkorderCount && !!handledWorkorderCount[0] ? handledWorkorderCount[0].count : 0}</span>
                        </div>
                    </div>
                    <div className={style.panelBody}>
                        <div className='panel'>
                            <div className='panelHeader'>
                                <span className='panelTitle'>待处理</span>
                            </div>
                            <Pending
                                AREA={this.state.AREA}
                                PROJECT={this.state.PROJECT}
                                TYPE={this.state.TYPE}
                                currTab={this.state.currTab}
                                predict={this.props.predict}
                                project={this.state.project}
                                turbine={this.state.turbine}
                                predictId={this.state.predictId}
                                onHandleToolPageChange={this.handleToolPageChange}
                                table={pageData}
                                hourlyForecastList={this.state.hourlyForecastList}
                                pager={this.state.pager}
                                totalRow={15}
                                onItemClick={this.viewAlarmDetail} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        predictData: state.alarms.predictData,
        predict: state.alarms.predict,
        toHandleWorkorderCount: state.alarms.toHandleWorkorderCount,
        handledWorkorderCount: state.alarms.handledWorkorderCount,
        workorderListPage: state.alarms.workorderListPage//查询工单列表
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getPredictById: function({ data, before, after, success, fail }) {
            dispatch(actions.getPredictById({ data, before, after, success, fail }));
        },
        getModelById: function({ data, before, after, success, fail }) {
            dispatch(actions.getModelById({ data, before, after, success, fail }));
        },
        getTurbineContigListByTurbine: function({ data, before, after, success, fail }) {
            dispatch(actions.getTurbineContigListByTurbine({ data, before, after, success, fail }));
        },
        getTagList: function({ data, before, after, success, fail }) {
            dispatch(actions.getTagList({ data, before, after, success, fail }));
        },
        getParameterData: function({ data, before, after, success, fail }) {
            dispatch(actions.getParameterData({ data, before, after, success, fail }));
        },
        getTurbineListByProject: function({ data, before, after, success, fail }) {
            dispatch(actions.getTurbineListByProject({ data, before, after, success, fail }));
        },
        getToHandleWorkorderCount: function({ data, before, after, success, fail }) {//代办数目
            dispatch(actions.getToHandleWorkorderCount({ data, before, after, success, fail }));
        },
        getHandledWorkorderCount: function({ data, before, after, success, fail }) {//已处理数目
            dispatch(actions.getHandledWorkorderCount({ data, before, after, success, fail }));
        },
        getWorkorderListPage: function({ data, before, after, success, fail }) {//查询工单列表
            dispatch(actions.getWorkorderListPage({ data, before, after, success, fail }));
        },
        getHourlyForecastList: function({ data, before, after, success, fail }) {//天气数据
            dispatch(actions.getHourlyForecastList({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Backlog);
