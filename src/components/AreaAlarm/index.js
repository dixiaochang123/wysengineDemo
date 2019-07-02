// 区域预警
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';
import Navbar from 'subComponents/Navbar';
import Dropdown from 'subComponents/Dropdown';

import ChartWholeYearAlarm from 'subComponents/ChartWholeYearAlarm';
import ChartMachineAlarmLevel from 'subComponents/ChartMachineAlarmLevel';
import ChartAreaMachineTypeAlarm from 'subComponents/ChartAreaMachineTypeAlarm';
import ChartMachineAreaDistribution from 'subComponents/ChartMachineAreaDistribution';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class AreaAlarm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 风机类型列表
            machineTypes: [],
            // 当前选中的风机类型
            machineType: '',
            // 当前选中的统计时间段
            time: 1,
            // 可选统计时间段
            options: [{
                key: 1,
                value: '近一个月'
            }, {
                key: 3,
                value: '近三个月'
            }, {
                key: 6,
                value: '近六个月'
            }, {
                key: 12,
                value: '近一年'
            }]
        };

        // 选择时间段
        this.selectDate = this.selectDate.bind(this);
        // 通过区域、风场获取数据
        this.initDataByAreaOrWindsite = this.initDataByAreaOrWindsite.bind(this);
        // 获取公用请求参数
        this.getPostData = this.getPostData.bind(this);
        // 获取一段时间内预警风机所有机型详情
        this.getPredictTurbineModelDetail = this.getPredictTurbineModelDetail.bind(this);
        // 获取一段时间内预警风机选定机型详情
        this.getPredictTurbineModelSubDetail = this.getPredictTurbineModelSubDetail.bind(this);
        // 获取一段时间内预警风机选定机型详情(新)
        this.getPredictTurbineModelDetailSubNew = this.getPredictTurbineModelDetailSubNew.bind(this);
        // 查看机型详情
        this.viewMachineTypeDetail = this.viewMachineTypeDetail.bind(this);
    }
    componentWillMount() {
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'turbineModel'
            },
            success: function(res) {
                this.setState({
                    machineTypes: res.body || []
                });
                // this.initDataByAreaOrWindsite();
                let time = this.state.time || 1;
                this.getPredictTurbineModelDetail(time);
                this.getPredictTurbineModelDetailSubNew(time, '');
            }.bind(this)
        });
        Utils.handleBigScreenDomHeight();
        User.set('barClickColor', {});
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
        Utils.handleScreenZoom(function() {
            Utils.handleBigScreenDomHeight();
        });
    }
    selectDate(option) {
        User.set('barClickColor',{});
        this.setState({
            time: option.key
        }, function() {
            this.initDataByAreaOrWindsite();
        }.bind(this));
    }
    initDataByAreaOrWindsite() {
        User.set('barClickColor',{});
        let time = this.state.time || 1;
        this.getPredictTurbineModelDetail(time);
        this.getPredictTurbineModelDetailSubNew(time, '');
    }
    getPostData() {
        let currentArea = User.get('currentArea') || '';
        let currentWindsite = User.get('currentWindsite') || '';
        let postData = {
            AREA: !!currentArea ? currentArea.CODE : '',
            PROJECT: !!currentWindsite ? currentWindsite.CODE_ : ''
        };
        return postData;
    }
    getPredictTurbineModelDetail(time) {
        let postData = this.getPostData();
        this.props.getPredictTurbineModelDetail({
            data: Object.assign({}, {
                TIME: time || this.state.time || 1
            }, postData)
        });
    }
    getPredictTurbineModelSubDetail(time, machineType) {
        let postData = this.getPostData();
        this.props.getPredictTurbineModelSubDetail({
            data: Object.assign({}, {
                TIME: time || this.state.time || 1,
                TURBINE_MODEL: machineType || this.state.machineType || ''
            }, postData),
            success: function() {
                $(document.body).removeClass('btnLoading');
            }.bind(this)
        });
    }
    // 新接口
    getPredictTurbineModelDetailSubNew(time, machineType) {
        let postData = this.getPostData();
        this.props.getPredictTurbineModelDetailSubNew({
            data: Object.assign({}, {
                TIME: time || this.state.time || 1,
                TURBINE_MODEL: machineType
            }, postData),
            success: function() {
                $(document.body).removeClass('btnLoading');
            }.bind(this)
        });
    }
    viewMachineTypeDetail(machineTypeName) {
        let machineTypeDetail = this.state.machineTypes.find((item) => {
            return item.NAME == machineTypeName;
        });
        this.setState({
            machineType: machineTypeDetail.ID
        }, function() {
            let machineType = this.state.machineType || '';
            let time = this.state.time || 1;
            this.getPredictTurbineModelDetail(time);
            this.getPredictTurbineModelDetailSubNew(time, machineType);
        }.bind(this));
    }
    render() {
        let machineType = this.state.machineType || '';
        let machineTypeDetail = !!this.state.machineTypes && this.state.machineTypes.length > 0 ? this.state.machineTypes.find((item) => item.ID == machineType) : {};
        // 第一个图表数据
        let predictCount = !!this.props.predictTurbineModelDetail ? this.props.predictTurbineModelDetail.predictCount : [];

        // 2、3、4图标数据
        let predictTurbineModelDetail = this.props.predictTurbineModelDetailSubNew;
        let timeCount = !!predictTurbineModelDetail ? predictTurbineModelDetail.timeCount : [];
        let areaCount = !!predictTurbineModelDetail ? predictTurbineModelDetail.areaCount : [];
        let levelCount = !!predictTurbineModelDetail ? predictTurbineModelDetail.levelCount : [];
        // 新接口
        let levelCountAll = !!predictTurbineModelDetail ? predictTurbineModelDetail.predictCount : [];

        let isEmpty = levelCount || levelCountAll;
        if (!!predictCount && predictCount.length > 0) {
            predictCount.forEach((item, index) => {
                let targetItem = this.state.machineTypes.find((machine) => {
                    return machine.ID == item.TURBINE_MODEL;
                });
                predictCount[index] = Object.assign({}, item, {
                    TURBINE_MODEL_NAME: !!targetItem ? targetItem.NAME : ''
                })
            });
        }

        let targetOption = this.state.options.find((item) => item.key == this.state.time);
        let selectedOption = this.state.time ? {
            key: this.state.time,
            value: targetOption.value
        } : {};

        let machineTypeDetailName = !!levelCount && !!machineTypeDetail ? machineTypeDetail.NAME : '';

        return (
            <div className={style.box + ' full'}>
                <Navbar
                    props={this.props}
                    showAreaIcon={true}
                    onAreaOrWindsiteChange={this.initDataByAreaOrWindsite} />
                <div className={'boxInner ' + style.boxInner}>
                    <div className={' clearfix'}>
                        <div className='left'>
                            <Dropdown
                                options={this.state.options}
                                onSelect={this.selectDate}
                                selectedItem={selectedOption} />
                        </div>
                    </div>
                    <div className={style.row + ' pure-g'} data-aspect-ratio={0.175}>
                        <div className='pure-u-1-2 gapRight'>
                            <div className={style.colInner + ' full panel'}>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>全部区域机型预警</span>
                                </div>
                                {!Utils.isEmpty(predictCount) ?
                                <ChartAreaMachineTypeAlarm
                                    data={predictCount}
                                    onItemClick={this.viewMachineTypeDetail} /> : <div className='dataEmpty'></div>}
                            </div>
                        </div>
                        <div className='pure-u-1-2'>
                            <div className={style.colInner + ' full panel'}>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>{'机型' + machineTypeDetailName + '预警时间分布'}</span>
                                </div>
                                {!Utils.isEmpty(timeCount) ?
                                <ChartWholeYearAlarm
                                    data={timeCount} /> : <div className='dataEmpty'></div>}
                            </div>
                        </div>
                    </div>
                    <div className={style.row + ' pure-g'} data-aspect-ratio={0.175}>
                        <div className='pure-u-3-4 gapRight'>
                            <div className={style.colInner + ' full panel'}>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>{'机型' + machineTypeDetailName + '预警情况'}</span>
                                </div>
                                {!Utils.isEmpty(areaCount) ?
                                <ChartMachineAreaDistribution
                                    data={areaCount} /> : <div className='dataEmpty'></div>}
                            </div>
                        </div>
                        <div className='pure-u-1-4'>
                            <div className={style.colInner + ' full panel'}>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>{'机型' + machineTypeDetailName + '预警等级'}</span>
                                </div>
                                {!Utils.isEmpty(isEmpty) ?
                                <ChartMachineAlarmLevel
                                    isLevelCount={!!levelCount ? true : false}
                                    data={!!levelCount ? levelCount : levelCountAll}
                                    dataTotal={predictTurbineModelDetail.levelAll} /> : <div className='dataEmpty'></div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        predictTurbineModelDetail: state.alarms.predictTurbineModelDetail || {},
        predictTurbineModelSubDetail: state.alarms.predictTurbineModelSubDetail || {},
        predictTurbineModelDetailSubNew: state.alarms.predictTurbineModelDetailSubNew || {}
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getParameterByTypeCode: function({ data, before, after, success, fail }) {
            dispatch(actions.getParameterByTypeCode({ data, before, after, success, fail }));
        },
        getPredictTurbineModelDetail: function({ data, before, after, success, fail }) {
            dispatch(actions.getPredictTurbineModelDetail({ data, before, after, success, fail }));
        },
        getPredictTurbineModelSubDetail: function({ data, before, after, success, fail }) {
            dispatch(actions.getPredictTurbineModelSubDetail({ data, before, after, success, fail }));
        },
        getPredictTurbineModelDetailSubNew: function({ data, before, after, success, fail }) {
            dispatch(actions.getPredictTurbineModelDetailSubNew({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(AreaAlarm);
