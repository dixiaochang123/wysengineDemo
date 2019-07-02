// 首页
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

import Navbar from 'subComponents/Navbar';
import ChartDashboard from 'subComponents/ChartDashboard';
import ChartAreaAlarm from 'subComponents/ChartAreaAlarm';
import ChartAreaAlarmRate from 'subComponents/ChartAreaAlarmRate';
import Table from 'subComponents/Table';
import TableWeatherAlarm from 'subComponents/TableWeatherAlarm';
import StatisticsCharts from 'subComponents/StatisticsCharts';

import TyphoonIcon from 'images/homepage/icon_right.png';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

let updateInterval;

class Homepage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 仪表盘数据（近一年准确率、 近一年健康度、 近一年生产率、 近一年完结率）
            dashboardsData: [{
                id: 'accuracy',
                title: '预警准确率',
                value: 0,
                growthRate: 0,
                pagePath: '/warningstatistics'
            }, {
                id: 'health',
                title: '健康度',
                value: 0,
                growthRate: 0,
                pagePath: '/totalhealth'
            }, {
                id: 'productivity',
                title: '生产率',
                value: 0,
                growthRate: 0,
                pagePath: '/productivity'
            }, {
                id: 'completionrate',
                title: '完结率',
                value: 0,
                notCompleteCount: 0,
                pagePath: '/totalcompletionrate'
            }],
            // 今日预警分页
            todayPredictPager: {
                total: 1,
                currPage: 1,
                pageSize: 6
            },
            // 极端天气预警分页
            newestForecastPager: {
                total: 1,
                currPage: 1,
                pageSize: 5
            },
            // 是否展示台风预警
            showTyphoonAlarm: false,
            // 当前选中的台风id
            typhoonId: '',
            // 更多台风菜单
            typhoonMoreMenu: [],
            // 禁止
            ban: false
        };

        // 初始化
        this.init = this.init.bind(this);
        // 跳转页面
        this.jumpToPage = this.jumpToPage.bind(this);
        // 跳转页面，带有state参数
        this.jumpToPageWithState = this.jumpToPageWithState.bind(this);
        // 通过区域、风场获取数据
        this.initDataByAreaOrWindsite = this.initDataByAreaOrWindsite.bind(this);

        // 获取仪表盘数据
        this.getDashboardData = this.getDashboardData.bind(this);

        // 获取今日风机预警当前页数据
        this.getPageTodayPredictList = this.getPageTodayPredictList.bind(this);
        // 今日预警翻页回调
        this.handleTodayPredictPageChange = this.handleTodayPredictPageChange.bind(this);
        // 查看今日预警单条预警详情
        this.viewAlarmDetail = this.viewAlarmDetail.bind(this);

        // 查看区域预警
        this.viewAreaAlarm = this.viewAreaAlarm.bind(this);
        // 区域预警机型变化
        this.handleTypeChange = this.handleTypeChange.bind(this);

        // 获取极端天气预警
        this.getNewestForecastList = this.getNewestForecastList.bind(this);
        // 极端天气预警翻页回调
        this.handleNewestForecastPageChage = this.handleNewestForecastPageChage.bind(this);

        // 台风预警选择台风菜单回调
        this.handleMenuSelect = this.handleMenuSelect.bind(this);
        // 显示隐藏台风预警表格
        this.toggleTyphoonAlarm = this.toggleTyphoonAlarm.bind(this);

        // 区域预警及完成情况表中单条数据点击回调
        this.viewAlarmCompletion = this.viewAlarmCompletion.bind(this);

        // 处理工作平台概览区跳转事件
        this.viewDetailByItem = this.viewDetailByItem.bind(this);
    }
    componentWillMount() {
        console.log(this.props.location.query)
        this.init();
        updateInterval = '';
        updateInterval = setInterval(function() {
            this.init();
        }.bind(this), 600000);
        User.set('barClickColor3', {});
    }
    componentDidMount() {
        Utils.handleScreenZoom(function() {
            Utils.handleBigScreenDomHeight();
        }.bind(this));
    }
    componentWillUnmount() {
        if (!!updateInterval) {
            clearInterval(updateInterval);
        }
    }
    init() {
        let userInfo = User.get();
        if (!!userInfo && !!userInfo.ID) {
            this.getDashboardData();
            // 获取预警模型总数
            this.props.getModelTotal({});
            this.getPageTodayPredictList();
            this.initDataByAreaOrWindsite();
            this.getNewestForecastList();
            // 获取今日台风预警
            this.props.getTop10NearestProject({
                success: function() {
                    let typhoonListObj = this.props.typhoonListObj;
                    if (!Utils.isEmpty(typhoonListObj) && typhoonListObj.status == 'false') {
                        return false;
                    }

                    let typhoonListObjKeys = Object.keys(typhoonListObj);
                    let keys = typhoonListObjKeys.filter((key) => isNaN(key) == false);
                    let typhoonMoreMenu = keys.map(function(item) {
                        return {
                            key: item,
                            value: typhoonListObj[item][0].NAME
                        };
                    });
                    this.setState({
                        typhoonId: keys[0],
                        typhoonMoreMenu: typhoonMoreMenu
                    });
                }.bind(this)
            });
        }
    }
    jumpToPage(path) {
        this.props.router.push({
            pathname: path
        });
    }
    jumpToPageWithState(path, state) {
        this.props.router.push({
            pathname: path,
            state: state
        });
    }
    initDataByAreaOrWindsite() {
        this.setState({
            ban: false
        });
        let currentArea = User.get('currentArea') || '';
        let currentWindsite = User.get('currentWindsite') || '';
        let postData = {
            AREA: !Utils.isEmpty(currentArea) ? currentArea.CODE : '',
            PROJECT: !Utils.isEmpty(currentWindsite) ? currentWindsite.CODE_ : ''
        };
        let userArea = User.get('AREA');
        let userProject = User.get('PROJECTS');

        if (postData.AREA == '') {
            postData.AREA = userArea;
        }
        if (postData.PROJECT == '') {
            postData.PROJECT = userProject;
        }

        // 获取仪表盘数据
        this.getDashboardData();
        // 获取今日风机预警
        this.getPageTodayPredictList();
        // 获取近一个月区域预警
        this.props.getPredictTurbineModel({
            data: Object.assign({}, postData, {
                TIME: 1
            })
        });
        // 获取区域预警完结率
        this.props.getPredictComplete({
            data: Object.assign({}, postData, {
                TIME: 1
            })
        });
        // 获取工作平台概览
        this.props.getWorkbenchOverview({
            data: Object.assign({}, postData)
        });
    }
    getDashboardData() {
        let currentArea = User.get('currentArea') || '';
        let currentWindsite = User.get('currentWindsite') || '';
        let postData = {
            AREA: !Utils.isEmpty(currentArea) ? currentArea.CODE : '',
            PROJECT: !Utils.isEmpty(currentWindsite) ? currentWindsite.CODE_ : ''
        };

        // 获取预警准确率
        this.props.getPredictAccuracyNew({
            data: postData,
            success: function(res) {
                $(document.body).removeClass('btnLoading');
                let dashboardsData = this.state.dashboardsData;
                dashboardsData[0].value = !Utils.isEmpty(res.body) && !Utils.isEmpty(res.body.accuracy) ? res.body.accuracy.slice(0, -1) : 0;
                dashboardsData[0].growthRate = !Utils.isEmpty(res.body) && !Utils.isEmpty(res.body.growthRate) ? res.body.growthRate : 0;
                this.setState({
                    dashboardsData: dashboardsData
                });
            }.bind(this)
        });
        // 获取健康度
        this.props.getHealthNew({
            data: postData,
            success: function(res) {
                let dashboardsData = this.state.dashboardsData;
                dashboardsData[1].value = !Utils.isEmpty(res.body) && !Utils.isEmpty(res.body.healthRate) ? res.body.healthRate.slice(0, -1) : 0;
                dashboardsData[1].growthRate = !Utils.isEmpty(res.body) && !Utils.isEmpty(res.body.growthRate) ? res.body.growthRate : 0;
                this.setState({
                    dashboardsData: dashboardsData
                });
            }.bind(this)
        });
        // 获取生产率
        this.props.getProductivityNew({
            data: postData,
            success: function(res) {
                let dashboardsData = this.state.dashboardsData;
                dashboardsData[2].value = !Utils.isEmpty(res.body) && !Utils.isEmpty(res.body.productionRate) ? res.body.productionRate.slice(0, -1) : 0;
                dashboardsData[2].growthRate = !Utils.isEmpty(res.body) && !Utils.isEmpty(res.body.growthRate) ? res.body.growthRate : 0;
                this.setState({
                    dashboardsData: dashboardsData
                });
            }.bind(this)
        });
        // 获取预警总体完结率
        this.props.getPredictCompleteAllNew({
            data: postData,
            success: function(res) {
                let dashboardsData = this.state.dashboardsData;
                dashboardsData[3].value = !Utils.isEmpty(res.body) && !Utils.isEmpty(res.body.completeRate) ? res.body.completeRate.slice(0, -1) : 0;
                dashboardsData[3].notCompleteCount = !Utils.isEmpty(res.body) && !Utils.isEmpty(res.body.notCompleteCount) ? res.body.notCompleteCount : 0;
                this.setState({
                    dashboardsData: dashboardsData
                });
            }.bind(this)
        });
    }
    getPageTodayPredictList(currPage) {
        let pager = this.state.todayPredictPager;
        let currentArea = User.get('currentArea') || '';
        let currentWindsite = User.get('currentWindsite') || '';
        let postData = {
            AREA: !Utils.isEmpty(currentArea) ? currentArea.CODE : '',
            PROJECT: !Utils.isEmpty(currentWindsite) ? currentWindsite.CODE_ : '',
            currentPage: currPage || pager.currPage || 1,
            showCount: pager.pageSize
        };

        this.props.getPageTodayPredictList({
            data: postData,
            success: function(res) {
                pager.total = res.body.totalResult || 1;
                this.setState({
                    todayPredictPager: pager
                });
            }.bind(this)
        });
    }
    handleTodayPredictPageChange(currPage) {
        let pager = this.state.todayPredictPager;
        pager.currPage = currPage;
        this.setState({
            todayPredictPager: pager,
            ban: true
        }, function() {
            this.getPageTodayPredictList(currPage);
        }.bind(this));
    }
    viewAlarmDetail(alarm) {
        this.jumpToPageWithState('/warninginfordetailsffff', {
            alarmId: alarm.ID,
            alarmCode: alarm.AREA,
            projectCode: alarm.PROJECT
        });
    }
    viewAreaAlarm() {
        this.jumpToPageWithState('/areaalarm', {
            stateData: {
                machineType: $('#areaAlarmTime').attr('data-machine-type') || ''
            }
        });
    }
    handleTypeChange(type) {
        this.jumpToPageWithState('/areaalarm', {
            stateData: {
                machineType: type,
                time: $('#areaAlarmTime').attr('data-time') || 1,
                ban: true
            }
        });
    }
    getNewestForecastList(currPage) {
        this.props.getNewestForecastList({
            data: {
                currentPage: currPage || this.state.newestForecastPager.currPage,
                showCount: this.state.newestForecastPager.pageSize
            },
            success: function(res) {
                let pager = this.state.newestForecastPager;
                pager.total = res.body.totalResult || 1;
                this.setState({
                    newestForecastPager: pager
                });
            }.bind(this)
        });
    }
    handleNewestForecastPageChage(currPage) {
        let pager = this.state.newestForecastPager;
        pager.currPage = currPage;
        this.setState({
            newestForecastPager: pager,
            ban: true
        }, function() {
            this.getNewestForecastList(currPage);
        }.bind(this));
    }
    handleMenuSelect(menuItem) {
        this.setState({
            typhoonId: menuItem.key
        });
    }
    toggleTyphoonAlarm() {
        this.setState({
            showTyphoonAlarm: !this.state.showTyphoonAlarm
        });
    }
    viewAlarmCompletion(item) {
        let currentArea = User.get('currentArea') || '';
        let currentWindsite = User.get('currentWindsite') || '';
        if (!Utils.isEmpty(currentWindsite)) {
            this.props.getTurbineListByProject({
                data: {
                    FARM_CODE: currentWindsite.CODE_
                },
                success: function(res) {
                    let turbineList = res.body || [];
                    let targetTurbine = turbineList.find((turbine) => {
                        return turbine.LOCATION_CODE == item.name;
                    });
                    let state = {
                        completionData: Object.assign({}, targetTurbine, {
                            dataType: 'TURBINE'
                        })
                    };
                    this.jumpToPageWithState('/totalcompletionrate', state);
                }.bind(this)
            });
            return false;
        } else if (!Utils.isEmpty(currentArea)) {
            this.props.getOnlineProjectListByArea({
                data: {
                    AREA: currentArea.CODE
                },
                success: function(res) {
                    let windsiteList = res.body || [];
                    let targetWindsite = windsiteList.find((windsite) => {
                        return windsite.NAME_ == item.name;
                    });
                    let state = {
                        completionData: Object.assign({}, targetWindsite, {
                            dataType: 'PROJECT'
                        })
                    };
                    this.jumpToPageWithState('/totalcompletionrate', state);
                }.bind(this)
            });
            return false;
        } else {
            let taregtArea = this.props.areaList.find((area) => area.NAME == item.name);
            let state = {
                completionData: Object.assign({}, taregtArea, {
                    dataType: 'AREA'
                })
            };
            this.jumpToPageWithState('/totalcompletionrate', state);
        }
    }
    viewDetailByItem(id, subItem) {
        this.jumpToPageWithState('/workbench', {
            itemId: id,
            subItemName: subItem
        });
    }
    render() {
        let dashboards = !Utils.isEmpty(this.state.dashboardsData) ? this.state.dashboardsData.map((item, index) => {
            return (
                <ChartDashboard
                    index={index}
                    dashboard={item}
                    ban={this.state.ban}
                    onSelect={this.jumpToPage}
                    key={index + '_' + item.id} />
            );
        }) : <div className='dataEmpty'></div>;

        let pageTodayPredictList = this.props.pageTodayPredictList || [];
        let predictTurbineModel = this.props.predictTurbineModel || {};
        let newestForecastList = this.props.newestForecastList || [];
        let predictComplete = !Utils.isEmpty(this.props.predictComplete) ? this.props.predictComplete : {};

        let typhoonListObj = !Utils.isEmpty(this.props.typhoonListObj) && this.props.typhoonListObj.status == 'true' ? this.props.typhoonListObj : {};
        let typhoonList = [];
        if (this.state.typhoonId != '') {
            typhoonList = typhoonListObj[this.state.typhoonId].slice(0, 5);
        }

        let typhoonListStyle = style.switchIcon;
        let typhoonAlarmTableStyle = style.typhoonAlarmTable;
        if (this.state.showTyphoonAlarm) {
            $('.' + style.statistics).css({
                paddingRight: '1%'
            });
            $('.' + style.statisticsCharts)
                .removeClass('pure-u-24-24')
                .addClass('pure-u-19-24');
            $('.' + style.typhoonAlarmTable).css({
                right: 0,
                paddingRight: $('.' + style.switchWrapper).css('width')
            });
            typhoonListStyle += (' ' + style.open);
            $('#homepageWeatherTable > div, #homepageWeatherTable table').css('width', $('#homepageWeatherTable').width() + 'px');
            $('#homepageWeatherTable > div:nth-child(2)').css('width', parseInt($('#homepageWeatherTable').width()) + parseInt(2 * $('#homepageWeatherTable').css('paddingLeft').slice(0, -2)) + 'px');
            $('#homepageWeatherTable table').css('width', parseInt($('#homepageWeatherTable').width()) + parseInt(2 * $('#homepageWeatherTable').css('paddingLeft').slice(0, -2))-56 + 'px');
            if (Utils.isMsBigScreen()) {
                $('#homepageWeatherTable > div').css('width', '100%');
            }
        } else {
            $('.' + style.statistics).css({
                paddingRight: Utils.isMsBigScreen() ? '6.4rem' : '3.2rem'
            });
            $('.' + style.statisticsCharts)
                .removeClass('pure-u-19-24')
                .addClass('pure-u-24-24')
                .css({
                    paddingRight: 0
                });
            $('.' + style.typhoonAlarmTable).css({
                right: '-' + (parseInt($('.' + style.typhoonAlarmTable).css('width')) + parseInt($('.' + style.switchWrapper).css('width'))) + 'px'
            });
        }

        let workbenchOverview = this.props.workbenchOverview || {};

        let isBigscreen = $(document.body).attr('bigscreen');
        let isBigscreenmicrosoft = $(document.body).attr('bigscreenmicrosoft');
        let isMiniscreen = $(document.body).attr('miniscreen');
        let trHeight = !!isBigscreen ? 35 : (!!isBigscreenmicrosoft ? 75 : (!!isMiniscreen ? 15 : 18));

        return (
            <div className={style.box + ' full'}>
                <Navbar
                    props={this.props}
                    showAreaIcon={true}
                    onAreaOrWindsiteChange={this.initDataByAreaOrWindsite} />
                <div className='boxInner'>
                    <div className={style.dashboards + ' pure-g'}>
                        <div className='pure-u-19-24'>
                            <div className='full clearfix'>
                                {dashboards}
                            </div>
                        </div>
                        <div className='pure-u-5-24'>
                            <div className='panel'>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>预警模型总数量</span>
                                    <span className='panelLink linkBtn' onClick={this.jumpToPage.bind(this, '/models')}></span>
                                </div>
                                <div className={style.warningCount}>
                                    <span className={style.warningCountText}>{this.props.modelTotal || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.tables + ' pure-g'}>
                        <div className='pure-u-19-24 gapRight'>
                            <div className={'pure-g ' + style.tablePanels}>
                                <div className={'pure-u-1-3 panel ' + style.tablePanel}>
                                    <Table
                                        tableId='homepageTodayFanAlarm'
                                        table={pageTodayPredictList}
                                        ths={['ID', '区域', '风场', '风机', '模型名称', '类型',' 关联部件', '等级']}
                                        keys={['ID', 'AREA_NAME', 'PROJECT_NAME', 'LOCATION_CODE', 'PREDICT_MODEL_NAME', 'MODEL_TYPE', 'COMP_RELATED_NAME', 'LEVEL_NAME']}
                                        hasHeader={true}
                                        hasOrder={false}
                                        title={'今日风机预警'}
                                        pager={this.state.todayPredictPager}
                                        onPageChange={this.handleTodayPredictPageChange}
                                        onMore={this.jumpToPage.bind(this, '/todayfanalarm')}
                                        onItemClick={this.viewAlarmDetail} />
                                </div>
                                <div className={'pure-u-1-3 panel ' + style.tablePanel}>
                                    <ChartAreaAlarm
                                        data={predictTurbineModel}
                                        onMore={this.viewAreaAlarm}
                                        onTypeChange={this.handleTypeChange} />
                                </div>
                                <div className={'pure-u-1-3 panel ' + style.tablePanel}>
                                    <ChartAreaAlarmRate
                                        onMore={this.jumpToPage.bind(this, '/totalcompletionrate')}
                                        onItemClick={this.viewAlarmCompletion}
                                        data={predictComplete} />
                                </div>
                            </div>
                        </div>
                        <div className='pure-u-5-24'>
                            <div className={'panel ' + style.tableWeather}>
                                <TableWeatherAlarm
                                    table={newestForecastList}
                                    pager={this.state.newestForecastPager}
                                    onPageChange={this.handleNewestForecastPageChage} />
                            </div>
                        </div>
                    </div>
                    <div className={style.statistics + ' pure-g'}>
                        <div className={style.statisticsCharts + ' pure-u-24-24'}>
                            <StatisticsCharts
                                data={workbenchOverview}
                                onMore={this.jumpToPage.bind(this, '/workbench')}
                                onViewDetailByItem={this.viewDetailByItem} />
                        </div>
                        <div className={typhoonAlarmTableStyle +　' pure-u-5-24'}>
                            <div className='panel'>
                                <Table
                                    tableId='homepageWeatherTable'
                                    table={typhoonList}
                                    title={this.state.typhoonId + '号台风：' + !!typhoonList && !!typhoonList[0] ? typhoonList[0].NAME : ''}
                                    ths={['区域', '风场', '距离(km)']}
                                    keys={['AREA_NAME', 'PROJECT_NAME', 'DISTANCE']}
                                    hasHeader={true}
                                    hasOrder={false}
                                    trHeight={trHeight}
                                    hidePager={true}
                                    hideMore={typhoonList.length <= 0}
                                    moreMenu={this.state.typhoonMoreMenu}
                                    onSelectMenu={this.handleMenuSelect} />
                            </div>
                        </div>
                        <div className={typhoonList.length > 0 ? style.switchWrapper : style.switchWrapper + ' ' + style.empty}>
                            <div className={style.switchTitle}>{typhoonList.length <= 0 ? '今日无台风预警' : '今日台风预警'}</div>
                            <div className={typhoonListStyle} onClick={typhoonList.length >= 0 ? this.toggleTyphoonAlarm : function() {}}>
                                <img src={TyphoonIcon} />
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
        modelTotal: state.models.modelTotal || 0,
        pageTodayPredictList: state.alarms.pageTodayPredictList || [],
        predictTurbineModel: state.alarms.predictTurbineModel || {},
        predictComplete: state.alarms.predictComplete || {},
        newestForecastList: state.homepage.newestForecastList || [],
        newestForecastListObj: state.homepage.newestForecastListObj || {},
        typhoonListObj: state.typhoon.typhoonListObj || {},
        workbenchOverview: state.alarms.workbenchOverview || {}
    };
}; 

let mapDispatchToProps = function(dispatch) {
    return {
        getPredictAccuracyNew: function({ data, before, after, success, fail }) {
            dispatch(actions.getPredictAccuracyNew({ data, before, after, success, fail }));
        },
        getHealthNew: function({ data, before, after, success, fail }) {
            dispatch(actions.getHealthNew({ data, before, after, success, fail }));
        },
        getProductivityNew: function({ data, before, after, success, fail }) {
            dispatch(actions.getProductivityNew({ data, before, after, success, fail }));
        },
        getPredictCompleteAllNew: function({ data, before, after, success, fail }) {
            dispatch(actions.getPredictCompleteAllNew({ data, before, after, success, fail }));
        },
        getModelTotal: function({ data, before, after, success, fail }) {
            dispatch(actions.getModelTotal({ data, before, after, success, fail }));
        },
        getPageTodayPredictList: function({ data, before, after, success, fail }) {
            dispatch(actions.getPageTodayPredictList({ data, before, after, success, fail }));
        },
        getPredictTurbineModel: function({ data, before, after, success, fail }) {
            dispatch(actions.getPredictTurbineModel({ data, before, after, success, fail }));
        },
        getPredictComplete: function({ data, before, after, success, fail }) {
            dispatch(actions.getPredictComplete({ data, before, after, success, fail }));
        },
        getNewestForecastList: function({ data, before, after, success, fail }) {
            dispatch(actions.getNewestForecastList({ data, before, after, success, fail }));
        },
        getTop10NearestProject: function({ data, before, after, success, fail }) {
            dispatch(actions.getTop10NearestProject({ data, before, after, success, fail }));
        },
        getWorkbenchOverview: function({ data, before, after, success, fail }) {
            dispatch(actions.getWorkbenchOverview({ data, before, after, success, fail }));
        },
        getOnlineProjectListByArea: function({ data, before, after, success, fail }) {
            dispatch(actions.getOnlineProjectListByArea({ data, before, after, success, fail }));
        },
        getTurbineListByProject: function({ data, before, after, success, fail }) {
            dispatch(actions.getTurbineListByProject({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Homepage);
