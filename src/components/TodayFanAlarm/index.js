// 今日风机预警
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

import Navbar from 'subComponents/Navbar';
import WarningStatisticsHead from 'subComponents/WarningStatisticsHead';
import ChartTodayAlarmLevel from 'subComponents/ChartTodayAlarmLevel';
import ChartTodayAlarmDistribution from 'subComponents/ChartTodayAlarmDistribution';
import Table from 'subComponents/Table';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

const LEVEL_NAME_MAP = {
    '一级': 1,
    '二级': 2,
    '三级': 3,
    '四级': 4,
    '五级': 5
};

class TodayFanAlarm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 今日区域预警区域分布选中的code
            selected: '',
            // 表格分页对象
            pager: {
                // 总页数
                total: 1,
                // 当前页
                currPage: 1,
                // 单页数据条数
                pageSize: 6
            },
            // 风机机型列表
            machineTypes: [],
            // 选中区域的风场列表
            windsites: [],
            //区域
            areaList: []
        };

        // 通过区域、风场获取数据
        this.initDataByAreaOrWindsite = this.initDataByAreaOrWindsite.bind(this);
        // 获取区域内风场
        this.getOnlineProjectListByArea = this.getOnlineProjectListByArea.bind(this);
        // 查看区域内预警详情
        this.viewAreaAlarmDetail = this.viewAreaAlarmDetail.bind(this);

        // 预警列表翻页回调
        this.handlePageChange = this.handlePageChange.bind(this);
        // 跳转到预警详情
        this.viewAlarmDetail = this.viewAlarmDetail.bind(this);
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
            }.bind(this)
        });
        this.initDataByAreaOrWindsite({});
        Utils.handleBigScreenDomHeight();
        User.set('barClickColor2', {});
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
        Utils.handleScreenZoom(function() {
            Utils.handleBigScreenDomHeight();
        });
    }
    initDataByAreaOrWindsite(paramsObj) {
        let currentArea = User.get('currentArea') || '';
        let currentWindsite = User.get('currentWindsite') || '';

        let areaCode = !!currentArea ? currentArea.CODE : '';
        let projectCode = !!currentWindsite ? currentWindsite.CODE_ : '';
        let postData = {
            currentPage: paramsObj.currPage || this.state.pager.currPage || 1,
            showCount: this.state.pager.pageSize,
            AREA: areaCode,
            PROJECT: projectCode
        };

        if (paramsObj.selected) {
            postData = Object.assign({}, postData, {
                selected: paramsObj.selected
            });
        }

        // 如果已选择区域，获取区域的风场
        if (!!areaCode) {
            this.getOnlineProjectListByArea(areaCode);
        }

        // 获取今日预警详情
        this.props.getTodayPredictDetail({
            data: Object.assign({}, postData),
            success: function(res) {
                $(document.body).removeClass('btnLoading');
                let pager = this.state.pager;
                let areaList = res.body.areaList || [];
                if (Utils.isEmpty(paramsObj)) {
                    pager.currPage = 1;
                }
                if (paramsObj.selected) {
                    pager.currPage = paramsObj.currPage || this.state.pager.currPage || 1;
                }
                pager.total = !!res.body && !!res.body.listPage ? res.body.listPage.totalResult : 1;
                this.setState({
                    pager: pager,
                    areaList: areaList
                });
            }.bind(this)
        });
    }
    getOnlineProjectListByArea(code) {
        this.props.getOnlineProjectListByArea({
            data: {
                AREA: code
            },
            success: function(res) {
                this.setState({
                    windsites: res.body || []
                });
            }.bind(this)
        });
    }
    viewAreaAlarmDetail(code) {
        let postData = {
            currPage: 1,
            selected: code
        };
        let pager = this.state.pager;
        pager.currPage = 1;
        this.setState({
            pager: pager,
            selected: code
        }, function() {
            this.initDataByAreaOrWindsite(postData);
        }.bind(this));
    }
    handlePageChange(currPage) {
        let pager = this.state.pager;
        pager.currPage = currPage;
        this.setState({
            pager: pager
        }, function() {
            this.initDataByAreaOrWindsite({
                currPage: currPage,
                selected: this.state.selected
            });
        }.bind(this));
    }
    viewAlarmDetail(alarm) {
        this.props.router.push({
            pathname: '/warninginfordetails',
            state: {
                alarmId: alarm.ID
            }
        });
    }
    render() {
        let todayPredictDetail = this.props.todayPredictDetail || {};
        let areaDistribution = this.state.areaList || [];
        let machineDistribution = !!todayPredictDetail.turbineModelList ? todayPredictDetail.turbineModelList : {};
        let finalMachineDistribution = [];

        if (!!machineDistribution)  {
            let machineTypes = this.state.machineTypes || [];
            Object.keys(machineDistribution).forEach((key) => {
                let machineType = machineTypes.find((item) => item.ID == key);
                if (!Utils.isEmpty(machineType)) {
                    finalMachineDistribution.push({
                        name: machineType.NAME,
                        count: machineDistribution[key]
                    });
                }
            });
        }

        let levelDistribution = !!todayPredictDetail.levelList ? todayPredictDetail.levelList : {};
        let finalLevelDistribution = {};
        Object.keys(levelDistribution).forEach((item) => {
            finalLevelDistribution[LEVEL_NAME_MAP[item]] = levelDistribution[item];
        });

        let pageTodayPredictList = !!todayPredictDetail && !!todayPredictDetail.listPage ? todayPredictDetail.listPage.pageData : [];
        let statisticsOverview = {};

        Object.keys(todayPredictDetail).forEach(function() {
            statisticsOverview['allCount'] = todayPredictDetail.total;
            statisticsOverview['areaCount'] = todayPredictDetail.area;
            statisticsOverview['projectCount'] = todayPredictDetail.project;
            statisticsOverview['turbineCount'] = todayPredictDetail.turbine;
        });

        return (
            <div className={style.box}>
                <Navbar
                    props={this.props}
                    showAreaIcon={true}
                    onAreaOrWindsiteChange={this.initDataByAreaOrWindsite.bind(this, {})} />
                <div className='boxInner'>
                    {!!statisticsOverview ?
                    <WarningStatisticsHead
                        key='WarningStatisticsHead1'
                        statisticsOverview={statisticsOverview} /> : <div className='dataEmpty'></div>}
                    <div className={style.distribution + ' clearfix'} data-aspect-ratio={0.15}>
                        <div className={style.distributionItem + ' left'}>
                            <div className={style.distributionItemInner + ' panel ' + style.chartWrapper}>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>今日预警区域分布</span>
                                </div>
                                {!Utils.isEmpty(areaDistribution) ?
                                <ChartTodayAlarmDistribution
                                    id={'todayFanAlarmAreaDistirbution'}
                                    data={areaDistribution}
                                    color={['#6acff9']}
                                    onItemClick={this.viewAreaAlarmDetail} /> : <div className='dataEmpty'></div>}
                            </div>
                        </div>
                        <div className={style.distributionItem + ' right'}>
                            <div className={style.distributionItemInner + ' panel ' + style.chartWrapper}>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>今日预警机型分布</span>
                                </div>
                                {!Utils.isEmpty(finalMachineDistribution) ?
                                <ChartTodayAlarmDistribution
                                    id={'todayFanAlarmMachineDistirbution'}
                                    data={finalMachineDistribution}
                                    color={['#3f8eef']} /> : <div className='dataEmpty'></div>}
                            </div>
                        </div>
                    </div>
                    <div className={style.footer + ' pure-g'} data-aspect-ratio={0.155}>
                        <div className='pure-u-17-24'>
                            <div className={style.footerTable + ' panel ' + style.chartWrapper}>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>今日风机预警</span>
                                </div>
                                {pageTodayPredictList.length > 0 ?
                                <Table
                                    tableId='todayFanAlarmTable'
                                    table={pageTodayPredictList}
                                    ths={['序号', '区域', '风场', '风机', '预警模型', '预警信息', '类型', '关联部件','状态', '等级']}
                                    keys={['AREA_NAME', 'PROJECT_NAME', 'LOCATION_CODE', 'CONTENT', 'CONTENTd', 'MODEL_TYPE', 'COMP_RELATED_NAME', 'STATUS_NAME', 'LEVEL_NAME']}
                                    hasOrder={true}
                                    hasHeader={false}
                                    pager={this.state.pager}
                                    onPageChange={this.handlePageChange}
                                    onItemClick={this.viewAlarmDetail}
                                    trAspectRatio={0.0235} /> : <div className='dataEmpty'></div>}
                            </div>
                        </div>
                        <div className='pure-u-7-24 gapLeft'>
                            <div className={style.footerChart + ' panel ' + style.chartWrapper}>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>今日预警等级分布</span>
                                </div>
                                {JSON.stringify(finalLevelDistribution) != '{}' ?
                                <ChartTodayAlarmLevel
                                    id={'todayFanAlarmLevelDistirbution'}
                                    data={finalLevelDistribution} /> : <div className='dataEmpty'></div>}
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
        areaList: state.area.areaList || [],
        todayPredictDetail: state.alarms.todayPredictDetail || {}
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getParameterByTypeCode: function({ data, before, after, success, fail}) {
            dispatch(actions.getParameterByTypeCode({ data, before, after, success, fail}));
        },
        getTodayPredictDetail: function({ data, before, after, success, fail}) {
            dispatch(actions.getTodayPredictDetail({ data, before, after, success, fail}));
        },
        getOnlineProjectListByArea: function({ data, before, after, success, fail }) {
            dispatch(actions.getOnlineProjectListByArea({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TodayFanAlarm);
