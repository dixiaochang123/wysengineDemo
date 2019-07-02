// kpi统计
import React from 'react';
import Moment from 'moment';
const ReactRedux = require('react-redux');

import actions from 'actions';
import Utils from 'utils/utils';
import Navbar from 'subComponents/Navbar';

import Filter from 'subComponents/Filter';
import ChartKPITendency from 'subComponents/ChartKPITendency';
import ChartKPIPerformance from 'subComponents/ChartKPIPerformance';
import ChartKPIAvailability from 'subComponents/ChartKPIAvailability';
import ChartKPIReliabilityItem from 'subComponents/ChartKPIReliabilityItem';

// PPSD: 功率特性偏离
// PCC: 功率曲线符合性

// TBA: 时间可利用率
// PBA: 发电量可利用率

// MTBI: 平均检修间隔时间
// MTTR: 平均故障修复时间

// MTBF: 平均无故障运行时间
// FTAF: 平均故障频次

// MTOTF: 平均机组故障总耗时
// TFC: 总故障次数

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class KPIStatistics extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 展示筛选条件框
            showFilter: false,
            // 筛选弹框尺寸
            filterSize: [920, 402],
            arrowPos: {
                left: '16rem'
            }
        };

        // 设置筛选条件弹框尺寸
        this.setFilterSize = this.setFilterSize.bind(this);
        // 显示、隐藏预警筛选条件弹框
        this.toggleFilter = this.toggleFilter.bind(this);
        // 跳转页面
        this.goToPage = this.goToPage.bind(this);
        // 获取查询数据的请求数据
        this.getPostData = this.getPostData.bind(this);
        // 查询标准kpi数据
        this.getStandardKpi = this.getStandardKpi.bind(this);
        // 查询最近一年kpi变化趋势
        this.getKpiLastAboutYear = this.getKpiLastAboutYear.bind(this);
        // 通过筛选条件重新拉取kpi数据
        this.searchStandardKpi = this.searchStandardKpi.bind(this);
        // 通过区域、风场获取数据
        this.initDataByAreaOrWindsite = this.initDataByAreaOrWindsite.bind(this);
        // 蒙层
        this.handleMc = this.handleMc.bind(this);
    }
    componentWillMount() {
        this.initDataByAreaOrWindsite();
        Utils.handleBigScreenDomHeight();
        // 微软大屏
        let isMsBigScreen = $(document.body).attr('bigscreenmicrosoft') == 'true' ? true : false;
        if (!!isMsBigScreen) {
            this.setState({
                arrowPos: {
                    left: '26rem'
                }
            });
        }
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
        Utils.handleScreenZoom(function() {
            Utils.handleBigScreenDomHeight();
        });
    }
    initDataByAreaOrWindsite(filter) {
        let postData = this.getPostData(filter);
        this.getStandardKpi(postData);
        this.getKpiLastAboutYear(postData);
    }
    goToPage(pathname) {
        this.props.router.push({
            pathname: pathname
        });
    }
    getPostData(filter) {
        let postData = {
            AREA: !!filter && !!filter.area ? filter.area.CODE : '',
            PROJECT: !!filter && !!filter.windsite ? filter.windsite.CODE_ : '',
            CALC_DATE: !!filter && !!filter.footerYear && !!filter.footerMonth ? (filter.footerYear.key + '-' + filter.footerMonth.key) : Moment().add(-1, 'month').format('YYYY-MM'),
            TURBINE_MODEL: !!filter && !!filter.machineType ? filter.machineType.NAME : ''
        };
        return postData;
    }
    getStandardKpi(postData) {
        this.props.getStandardKpi({
            data: postData,
            success: function() {
                $(document.body).removeClass('btnLoading');
            }.bind(this)
        });
    }
    getKpiLastAboutYear(postData) {
        this.props.getKpiLastAboutYear({
            data: postData
        });
    }
    searchStandardKpi(filter) {
        this.setState({
            showFilter: false
        });
        this.initDataByAreaOrWindsite(filter);
    }
    setFilterSize() {
        let isBigScreen = Utils.isBigScreen();
        let isMiniScreen = Utils.isMiniScreen();
        let isMsBigScreen = $(document.body).attr('bigscreenmicrosoft')=='true' ? true : false;
        let tbw=20,tbh=40;
        if(!!isMsBigScreen) {
            tbw = 60;
            tbh = 80;
        }
        if(!!isBigScreen) {
            tbw = 40;
            tbh = 80;
        }
        if(!!isMiniScreen) {
            tbw = 15;
            tbh = 40;
        }
        let tableWidth = parseInt($('#chartPowerOutput').css('width').slice(0, -2)) - tbw;
        let tableHeight = parseInt($('#chartPowerOutput').css('height').slice(0, -2)) + tbh;
        this.setState({
            filterSize: [tableWidth, tableHeight]
        });
    }
    toggleFilter() {
        let showFilter = this.state.showFilter;
        this.setFilterSize();
        this.setState({
            showFilter: !showFilter
        });
    }
    handleMc() {
        this.setState({
            showFilter: false
        });
    }
    render() {
        let standardKpi = this.props.standardKpi;
        let performances = standardKpi && !!standardKpi.PPSD ? standardKpi.PPSD.map((item) => {
            let targetItem = standardKpi.PCC.filter((pcc) => pcc.name == item.name)[0];
            return {
                key: item.name,
                value: item.value,
                rate: targetItem.value.replace(/%/, '')
            };
        }) : [];
        let availabilities = standardKpi && !!standardKpi.TBA ? standardKpi.TBA.map((item) => {
            let targetItem = standardKpi.PBA.filter((pba) => pba.name == item.name)[0];
            return {
                area: item.name,
                timeRate: item.value.replace(/%/, ''),
                energyRate: targetItem.value.replace(/%/, '')
            };
        }) : [];
        let averageRepairs = standardKpi && !!standardKpi.MTBI ? standardKpi.MTBI.map((item) => {
            let targetItem = standardKpi.MTTR.filter((mttr) => mttr.name == item.name)[0];
            return {
                area: item.name,
                value1: item.value,
                value2: targetItem.value
            };
        }) : [];
        let averageFrequencies = standardKpi && !!standardKpi.MTBF ? standardKpi.MTBF.map((item) => {
            let targetItem = standardKpi.FTAF.filter((mttr) => mttr.name == item.name)[0];
            return {
                area: item.name,
                value1: item.value,
                value2: targetItem.value
            };
        }) : [];
        let averageConsumingTimes = standardKpi && !!standardKpi.MTOTF ? standardKpi.MTOTF.map((item) => {
            let targetItem = standardKpi.TFC.filter((mttr) => mttr.name == item.name)[0];
            return {
                area: item.name,
                value1: item.value,
                value2: targetItem.value
            };
        }) : [];

        let kpiLastAboutYear = this.props.kpiLastAboutYear || {};

        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                <div className='boxInner'>
                    <div className={style.tabs + ' clearfix'}>
                        <a href='javascript:;' onClick={this.goToPage.bind(this, '/warningstatistics')} className={style.tab + ' left tc'}>预警统计分析 / 今年</a>
                        <a href='javascript:;' className={style.tabActive + ' left tc'} onClick={this.toggleFilter} >KPI统计分析</a>
                    </div>
                    <div className={!!this.state.showFilter ? style.mc : 'none'} onClick={this.handleMc}></div>
                    <div className={style.firstRow} data-aspect-ratio={0.136}>
                        <div className={style.firstRowCharts + ' pure-g'}>
                            <div id='chartPowerOutput' className='pure-u-1-2 gapRight'>
                                <div className={style.firstRowChartInner + '  panel' }>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>发电性能</span>
                                    </div>
                                    {performances.length > 0 ?
                                    <ChartKPIPerformance
                                        data={performances}
                                        showFilter={this.state.showFilter} /> : <div className='dataEmpty'></div>}
                                </div>
                                <div id='filterWrapper' className={style.filterWrapper}>
                                    <Filter
                                        showFilter={this.state.showFilter}
                                        filterPos={{top: '-3.2rem', left: '19rem'}}
                                        size={this.state.filterSize}
                                        arrowPos={this.state.arrowPos}
                                        noBorder={true}
                                        hideItems={['headerTime', 'status', 'alarmLevel', 'unit', 'number']}
                                        onSearch={this.searchStandardKpi} />
                                </div>
                            </div>
                            <div className='pure-u-1-2'>
                                <div className={style.firstRowChartInner + '  panel'}>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>可利用率</span>
                                    </div>
                                    {availabilities.length > 0 ?
                                    <ChartKPIAvailability
                                        data={availabilities}
                                        showFilter={this.state.showFilter} /> : <div className='dataEmpty'></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.row} data-aspect-ratio={0.11}>
                        <div className={style.secondCharts + ' pure-g'}>
                            <div className='pure-u-1-3 gapRight'>
                                <div className={style.secondChartInner +' '+ style.secondChartInner1 + ' panel'}>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>检修故障修复时间</span>
                                    </div>
                                    {averageRepairs.length > 0 ?
                                    <ChartKPIReliabilityItem
                                        id='kpiReliabilityItemRepair'
                                        legends={['平均检修间隔时间(小时)', '平均故障修复时间(小时)']}
                                        data={averageRepairs}
                                        color={['#0fc9e7','#3186b2']}
                                        showFilter={this.state.showFilter} /> : <div className='dataEmpty'></div>}
                                </div>
                            </div>
                            <div className='pure-u-1-3 gapRight'>
                                <div className={style.secondChartInner + ' panel'}>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>故障频次</span>
                                    </div>
                                    {averageFrequencies.length > 0 ?
                                    <ChartKPIReliabilityItem
                                        id='kpiReliabilityItemFrequency'
                                        legends={['平均无故障运行时间(小时)', '平均故障频次(次)']}
                                        data={averageFrequencies}
                                        color={['#549ffc','#9d7b82']}
                                        showFilter={this.state.showFilter} /> : <div className='dataEmpty'></div>}
                                </div>
                            </div>
                            <div className='pure-u-1-3'>
                                <div className={style.secondChartInner + ' panel'}>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>故障总耗时</span>
                                    </div>
                                    {averageConsumingTimes.length > 0 ?
                                    <ChartKPIReliabilityItem
                                        id='kpiReliabilityItemConsumingTime'
                                        legends={['平均机组故障总耗时(小时)', '总故障次数(次)']}
                                        data={averageConsumingTimes}
                                        color={['#a1d9ff','#898276']}
                                        showFilter={this.state.showFilter} /> : <div className='dataEmpty'></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.row + ' ' + style.thirdRow + ' clearfix'} data-aspect-ratio={0.11}>
                        <div className={style.tendency + ' panel'}>
                            <div className='panelHeader'>
                                <span className='panelTitle'>KPI指标变化趋势</span>
                            </div>
                            {Utils.isEmpty(kpiLastAboutYear) ?
                            <div className='dataEmpty'></div> :
                            <ChartKPITendency data={kpiLastAboutYear} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        standardKpi: state.kpi.standardKpi,
        kpiLastAboutYear: state.kpi.kpiLastAboutYear
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getStandardKpi: function({ data, before, after, success, fail }) {
            dispatch(actions.getStandardKpi({ data, before, after, success, fail }));
        },
        getKpiLastAboutYear: function({ data, before, after, success, fail }) {
            dispatch(actions.getKpiLastAboutYear({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(KPIStatistics);
