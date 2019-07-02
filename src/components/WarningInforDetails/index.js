// 预警详情
import React from 'react';
import Moment from 'moment';
const ReactRedux = require('react-redux');

import Utils from 'utils/utils';
import actions from 'actions';
import Constant from 'constant/index';

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
import Maintance from 'components/Maintance';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

const TAB_NAME_MAP = {
    win: '维护窗口',
    predict: '关联预警',
    variable: '当前变量'
};

class WarningInforDetails extends React.Component {
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
            currPredict: {}
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
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
    }
    componentDidUpdate() {
        Utils.handleBigScreenDomHeight();
    }
    componentWillMount() {
        let predictId = this.props.location.state.alarmId;
        this.getPredictById(predictId);
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
                                // 风场预警获取风机列表
                                // if (this.state.isFarmPredict == 1) {
                                //     this.props.getPredictTurbines({
                                //         data: {
                                //             PREDICT_ID: predict.body.ID
                                //         },
                                //         success: function(innerRes) {
                                //             this.setState({
                                //                 turbines: innerRes.body || []
                                //             });
                                //         }.bind(this)
                                //     });
                                // }
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
        // xiehe project
        if (Constant.PROJECT == 'xiehe') {
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
        this.setState({
            currTab: 'variable'
        }, function() {
            this.getPredictById(alarm.ID);
            this.props.router.push({
                pathname: '/warninginfordetails',
                state: {
                    alarmId: alarm.ID,
                    alarmCode: alarm.AREA,
                    projectCode: alarm.PROJECT
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

        return (
            <div className={style.box + ' full'}>
                <Navbar
                    props={this.props} />
                <div className='boxInner'>
                    <div className={style.header + ' pure-g'}>
                        <div className='pure-u-6-24'>
                            <PredictModel
                                predict={predict}
                                onItemSelect={this.handleTabSwitch}
                                onViewModelDetial={this.viewModelDetail} />
                        </div>
                        <div className='pure-u-18-24 gapLeft'>
                            <PredictInfo
                                predict={predict}
                                onPredictChange={this.handlePredictChange} />
                        </div>
                    </div>
                    <div className={'panel ' + style.panel}>
                        <div className='panelHeader'>
                            <span className='panelTitle'>{TAB_NAME_MAP[this.state.currTab]}</span>
                            <PredictOperation
                                predict={predict}
                                onPredictChange={this.getPredictById.bind(this, predict.ID)} />
                        </div>
                        <div className={currTab === 'variable' ? style.panelBody + ' ' + style.varWrapper : style.panelBody + ' ' + style.varWrapper + ' none'}>
                            <div className={style.varWrapperInner}>
                                <WarningInforDetailsChart
                                    id='warningInforDetailsChart1Canvas'
                                    predictData={finalPredictData}
                                    predictStartTime={predictStartTime}
                                    predictEndTime={predictEndTime}
                                    turbines={turbines}
                                    allTurbines={this.state.turbines}
                                    variables={variables}
                                    isTranslog={this.state.isTranslogModel}
                                    isViewAll={this.state.isViewAll}
                                    onFilterChange={this.handleFilterChange}
                                    onChartClear={this.clearChart}
                                    showVars={this.state.showVars}
                                    onVarsToggle={this.toggleVars}
                                    postData={this.state.truePostData} />
                                {this.state.isTranslogModel == true ?
                                <div className={style.borderDiv}></div> : null}
                                {this.state.isTranslogModel == true ?
                                <WarningInforDetailsChart
                                    id='warningInforDetailsChart2Canvas'
                                    predictData={finalPredictDataFFT}
                                    predictStartTime={predictStartTime}
                                    predictEndTime={predictEndTime}
                                    turbines={turbines}
                                    allTurbines={this.state.turbines}
                                    variables={variables}
                                    isTranslog={this.state.isTranslogModel}
                                    isViewAll={this.state.isViewAll}
                                    postData={this.state.truePostData} /> : null}
                            </div>
                        </div>
                        <div className={currTab === 'win' ? style.panelBody : style.panelBody + ' none'}>
                            <Maintance
                                currTab={this.state.currTab}
                                predict={this.props.predict}
                                project={this.state.project}
                                turbine={this.state.turbine}
                                predictModel={this.state.predictModel}
                                predictId={this.props.location.state.alarmId}
                                predictAreaCode={this.props.location.state.alarmCode}
                                predictProjectCode={this.props.location.state.projectCode}
                                onItemClick={this.viewAlarmDetail} />
                        </div>
                        <div className={currTab === 'predict' ? style.panelBody : style.panelBody + ' none'}>
                            <WarningInforDetailsRelation
                                project={this.state.project}
                                turbine={this.state.turbine}
                                predictModel={this.state.predictModel}
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
        predict: state.alarms.predict
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getPredictById: function({
            data,
            before,
            after,
            success,
            fail
        }) {
            dispatch(actions.getPredictById({
                data,
                before,
                after,
                success,
                fail
            }));
        },
        getModelById: function({
            data,
            before,
            after,
            success,
            fail
        }) {
            dispatch(actions.getModelById({
                data,
                before,
                after,
                success,
                fail
            }));
        },
        getTurbineContigListByTurbine: function({
            data,
            before,
            after,
            success,
            fail
        }) {
            dispatch(actions.getTurbineContigListByTurbine({
                data,
                before,
                after,
                success,
                fail
            }));
        },
        getTagList: function({
            data,
            before,
            after,
            success,
            fail
        }) {
            dispatch(actions.getTagList({
                data,
                before,
                after,
                success,
                fail
            }));
        },
        getParameterData: function({
            data,
            before,
            after,
            success,
            fail
        }) {
            dispatch(actions.getParameterData({
                data,
                before,
                after,
                success,
                fail
            }));
        },
        getTurbineListByProject: function({
            data,
            before,
            after,
            success,
            fail
        }) {
            dispatch(actions.getTurbineListByProject({
                data,
                before,
                after,
                success,
                fail
            }));
        },
        getPredictTurbines: function({
            data,
            before,
            after,
            success,
            fail
        }) {
            dispatch(actions.getPredictTurbines({
                data,
                before,
                after,
                success,
                fail
            }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(WarningInforDetails);