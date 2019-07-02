// 维护窗口
import React from 'react';
import Moment from 'moment';
const ReactRedux = require('react-redux');

import actions from 'actions';
import Utils from 'utils/utils';
import Table from 'subComponents/Table';

import ChartMaintainWeather from 'subComponents/ChartMaintainWeather';
import ChartMaintainWind from 'subComponents/ChartMaintainWind';

import IconMaintancePri from 'images/warninginfordetails/maintancePri.png';
import IconMaintancePriDark from 'images/warninginfordetails/maintancePriDark.png';
import IconMaintanceSec from 'images/warninginfordetails/maintanceSec.png';
import IconMaintanceSecDark from 'images/warninginfordetails/maintanceSecDark.png';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class Maintance extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 同风场
            pager: {
                total: 1,
                pageSize: 5,
                currPage: 1
            },
            // 同风机
            toolPager: {
                total: 1,
                pageSize: 5,
                currPage: 1
            },
            // 天气情况列表
            hourlyForecastList: {},
            project: '',
            turbine: '',
            projectList: [],
            turbineList: []
        };

        // 获取预警详情
        this.getPredictById = this.getPredictById.bind(this);
        //同机组
        this.getTurbinePushedPredict = this.getTurbinePushedPredict.bind(this);
        //同风场
        this.getProjectPushedPredict = this.getProjectPushedPredict.bind(this);

        // 同机组翻页
        this.handleToolPageChange = this.handleToolPageChange.bind(this);
        // 同风场翻页
        this.handlePredictPageChange = this.handlePredictPageChange.bind(this);

        // 点击同风场风机事件
        this.handleItemClick = this.handleItemClick.bind(this);
    }
    componentWillMount() {
        let predictId = this.props.predictId;
        this.getPredictById(predictId);
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
    }
    getTurbinePushedPredict(currPage, turbine) {
        this.props.getTurbinePushedPredict({
            data: {
                currentPage: currPage || this.state.toolPager.currPage,
                showCount: this.state.toolPager.pageSize,
                TURBINE: turbine || ''
            },
            success: function(res) {
                let pager = this.state.toolPager;
                pager.total = res.body.totalResult || 1;
                pager.currPage = res.body.currentPage;
                this.setState({
                    toolPager: pager,
                    turbineList: res.body.pageData || []
                })
            }.bind(this)
        });
    }
    getProjectPushedPredict(currPage, project) {
        this.props.getProjectPushedPredict({
            data: {
                currentPage: currPage || this.state.pager.currPage,
                showCount: this.state.pager.pageSize,
                PROJECT: project || ''
            },
            success: function(res) {
                let pager = this.state.pager;
                pager.total = res.body.totalResult || 1;
                pager.currPage = res.body.currentPage;
                this.setState({
                    pager: pager,
                    projectList: res.body.pageData || []
                })
            }.bind(this)
        });
    }
    getPredictById(predictId) {
        let postData = {
            ID: predictId
        };

        // 获取预警详情
        this.props.getPredictById({
            data: postData,
            success: function(predict) {
                this.setState({
                    project: predict.body.PROJECT,
                    turbine: predict.body.TURBINE
                });
                this.getProjectPushedPredict(1, predict.body.PROJECT);
                this.getTurbinePushedPredict(1, predict.body.TURBINE);
                this.props.getCheckItemList({
                    data:{
                        MODEL_ID : predict.body.PREDICT_MODEL || ''
                    }
                })
                
            }.bind(this)
        })
    }
    handleItemClick(item) {
        !!this.props.onItemClick && this.props.onItemClick(item);
    }
    handleToolPageChange(currPage) {
        let turbine = this.state.turbine || [];
        let pager = this.state.toolPager;
        pager.currPage = currPage;
        this.setState({
            toolPager: pager
        });
        this.getTurbinePushedPredict(currPage, turbine);
    }
    handlePredictPageChange(currPage) {
        let project = this.state.project || '';
        let pager = this.state.pager;
        pager.currPage = currPage;
        this.setState({
            pager: pager
        });
        this.getProjectPushedPredict(currPage, project);
    }
    render() {
        let isDark = theme === 'dark';

        // 运维数据
        let hourlyForecastList = this.state.hourlyForecastList;
        let dateList = !!hourlyForecastList && !!hourlyForecastList.hourly ? hourlyForecastList.hourly : [];
        let reverseDateList = dateList.slice(0).reverse();
        let operateWindow = !!hourlyForecastList && !!hourlyForecastList.operateWindow ? hourlyForecastList.operateWindow : {};

        let primaryTimes = !!operateWindow && !!operateWindow.primary ? operateWindow.primary :[];
        let primaryDate = !!primaryTimes[0] ? Moment(primaryTimes[0], 'YYYY-MM-DD HH:mm:ss').format('MM月DD日') : 'xx月xx日';
        let primaryTime = !!primaryTimes[0] ? Moment(primaryTimes[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm') + '-' + Moment(primaryTimes[primaryTimes.length - 1], 'YYYY-MM-DD HH:mm:ss').format('HH:mm') : '00:00-00:00';

        let secondaryTimes = !!operateWindow && !!operateWindow.secondary ? operateWindow.secondary : [];
        let secondaryDate = !!secondaryTimes[0] ? Moment(secondaryTimes[0], 'YYYY-MM-DD HH:mm:ss').format('MM月DD日') : 'xx月xx日';
        let secondaryTime = !!secondaryTimes[0] ? Moment(secondaryTimes[0], 'YYYY-MM-DD HH:mm:ss').format('HH:mm') + '-' + Moment(secondaryTimes[secondaryTimes.length - 1], 'YYYY-MM-DD HH:mm:ss').format('HH:mm') : '00:00-00:00';

        let hourList = !!hourlyForecastList && !!hourlyForecastList.hourly ? hourlyForecastList.hourly.map((item) => item.DATETIME) : [];
        hourList.reverse();
        let hoursPri = !!hourlyForecastList && !!hourlyForecastList.operateWindow && !!hourlyForecastList.operateWindow.primary ? hourlyForecastList.operateWindow.primary : [];
        let hoursSec = !!hourlyForecastList && !!hourlyForecastList.operateWindow && !!hourlyForecastList.operateWindow.secondary ? hourlyForecastList.operateWindow.secondary : [];
        let hourGroups = {};
        hourList.forEach((item) => {
            let date = Moment(item, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
            hourGroups[date] = !!hourGroups[date] ? hourGroups[date] : [];
            hourGroups[date].push(item);
        });
        let hourGroupKeys = Object.keys(hourGroups);
        let hourGroupNodes = hourGroupKeys.map(function(key) {
            let hours = hourGroups[key];
            let timeGroupWidth = new Number(hours.length / hourList.length);
            let hourWidth = new Number(1 / hours.length);
            let timeGroupStyle = {
                width: timeGroupWidth.toFixed(2) * 100 + '%'
            };
            let hourStyle = {
                width: hourWidth.toFixed(2) * 100 + '%'
            };
            let hourNodes = hours.map(function(hour) {
                let hourCls;
                if (hoursPri.indexOf(hour) != -1) {
                    hourCls += (' ' + style.hourPri);
                }
                if (hoursSec.indexOf(hour) != -1) {
                    hourCls += (' ' + style.hourSec);
                }
                return (
                    <span key={'hourNodes' + hour} className={hourCls} style={hourStyle}>{Moment(hour, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}</span>
                );
            });
            return (
                <div key={'hourGroupNodes' + key} className={style.timeGroup} style={timeGroupStyle}>
                    {hourNodes}
                    <div className={style.timeGroupDate}>{Moment(hours[0], 'YYYY-MM-DD HH:mm:ss').format('MM-DD')}</div>
                </div>
            );
        }.bind(this));

        let paddingLeft = {
            paddingLeft: '2em'
        }
        let checkItemList = this.props.checkItemList || [];
        let CONTENT = !!checkItemList && checkItemList.__proto__.constructor==Array ? checkItemList.map(function(item,index){
            return (
                <div key={index}>
                    <p className={style.p1}>{(index+1) +'、'+ item.NAME}</p>
                    <p className={style.p2} style={paddingLeft}>{item.CHECK_CONTENT}</p>
                </div>
                )
        }) : [];

        return (
            <div className={style.box}>
                <div className='pure-g'>
                    <div className={'pure-u-14-24 gapRight ' + style.charts}>
                        <div className={style.times}>
                            <div className={style.timesLegend}>
                                <span className={style.timePri}>最佳维护时间</span>
                                <span className={style.timeSec}>备选维护时间</span>
                            </div>
                            <div className={style.timeGroups}>
                                {hourGroupNodes}
                            </div>
                        </div>
                        <ChartMaintainWeather
                            id='chartMaintainWeather'
                            currTab={this.props.currTab}
                            hourlyForecastList={reverseDateList} />
                        <ChartMaintainWind
                            id='chartMaintainWind'
                            currTab={this.props.currTab}
                            hourlyForecastList={reverseDateList} />
                    </div>
                    <div className={'pure-u-5-24 ' + style.pureu1}>
                        <div className={style.panels}>
                            <div className='pure-g'>
                                <div className={'pure-u-24-24 ' + style.panel}>
                                    <div className={style.panelInner}>
                                        <div className={style.panelInnerFooter}></div>
                                        <div className={'clearfix ' + style.maintanceTime}>
                                            <div className={'left ' + style.maintanceTimePri}>
                                                <img src={isDark ? IconMaintancePriDark : IconMaintancePri} />
                                                <p>{primaryDate}</p>
                                                <p>{primaryTime}</p>
                                                <p>最佳维护时间</p>
                                            </div>
                                            <div className={'right ' + style.maintanceTimeSec}>
                                                <img src={isDark ? IconMaintanceSecDark : IconMaintanceSec} />
                                                <p>{secondaryDate}</p>
                                                <p>{secondaryTime}</p>
                                                <p>备选维护时间</p>
                                            </div>
                                        </div>
                                        <div className={style.maintanceInfo}>
                                            <div className={'none ' + style.maintanceInfoItem}>
                                                {'风场人员： 吴鹏、迪晓昌、尹南'}
                                            </div>
                                            <div className={style.maintanceInfoItem}>
                                                排查内容：
                                            </div>
                                            <div>{CONTENT}</div>
                                            <div className={'none ' + style.solutions}>
                                                <ul className={style.solutionSlider}>
                                                    <li className={style.active}></li>
                                                    <li className={style.active}></li>
                                                    <li className={style.active}></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='pure-u-5-24'>
                        <div className={style.panels}>
                            <div className='pure-g'>
                                <div className={'pure-u-24-24 ' + style.panel}>
                                    <div className={style.panelInner}>
                                        <div className={style.panelInnerFooter}></div>
                                        <p className={style.panelTitle}>同台机组近三个月内下发情况</p>
                                        <Table
                                            isColorInvert={true}
                                            tableId='maintanceTool'
                                            table={this.state.turbineList}
                                            ths={['序号', '模型名称', 'EAM工单号', '推送日', '准确性']}
                                            keys={[ 'PREDICT_MODEL_NAME', 'TICKET_ID', 'CREATEDATE','VERACITY']}
                                            hasHeader={false}
                                            hasOrder={true}
                                            totalRow={5}
                                            pager={this.state.toolPager}
                                            onPageChange={this.handleToolPageChange} />

                                    </div>
                                </div>
                            </div>
                            <div className='pure-g'>
                                <div className={'pure-u-24-24 ' + style.panel}>
                                    <div className={style.panelInner}>
                                        <div className={style.panelInnerFooter}></div>
                                        <p className={style.panelTitle}>同风场机组近三个月内下发情况</p>
                                        <Table
                                            isColorInvert={true}
                                            tableId='maintancePredictTab'
                                            table={this.state.projectList}
                                            ths={['序号', '模型名称', 'EAM工单号', '推送日', '准确性']}
                                            keys={[ 'PREDICT_MODEL_NAME', 'TICKET_ID', 'CREATEDATE','VERACITY']}
                                            hasHeader={false}
                                            hasOrder={true}
                                            totalRow={5}
                                            pager={this.state.pager}
                                            onItemClick={this.handleItemClick}
                                            onPageChange={this.handlePredictPageChange} />
                                    </div>
                                </div>
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
        // 运维窗口
        maintainData: state.alarms.maintainData,
        hourlyForecastList: state.alarms.hourlyForecastList || {},
        checkItemList: state.alarms.checkItemList || {},
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getPredictById: function({ data, before, after, success, fail }) {
            dispatch(actions.getPredictById({ data, before, after, success, fail }));
        },
        getHourlyForecastList: function({ data, before, after, success, fail }) {
            dispatch(actions.getHourlyForecastList({ data, before, after, success, fail }));
        },
        getMaintainData: function({ data, before, after, success, fail }) {
            dispatch(actions.getMaintainData({ data, before, after, success, fail }));
        },
        getTurbinePushedPredict: function({ data, before, after, success, fail }) {//同机组
            dispatch(actions.getTurbinePushedPredict({ data, before, after, success, fail }));
        },
        getProjectPushedPredict: function({ data, before, after, success, fail }) {//同风场
            dispatch(actions.getProjectPushedPredict({ data, before, after, success, fail }));
        },
        getCheckItemList: function({ data, before, after, success, fail }) {//同风场
            dispatch(actions.getCheckItemList({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Maintance);
