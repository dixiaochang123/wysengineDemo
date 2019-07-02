// 维护窗口
import React from 'react';
import Moment from 'moment';
const ReactRedux = require('react-redux');

import actions from 'actions';
import Utils from 'utils/utils';
import Table from 'subComponents/Table';

import ChartMaintainWeather from 'subComponents/ChartMaintainWeather';
import ChartMaintainWind from 'subComponents/ChartMaintainWind';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class Pending extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 查询工单分页列表
        this.handleToolPageChange = this.handleToolPageChange.bind(this);

        // 点击查询工单分页列表
        this.handleItemClick = this.handleItemClick.bind(this);
    }
    componentWillMount() {

    }

    handleItemClick(item) {
        this.props.onItemClick && this.props.onItemClick(item);
    }
    handleToolPageChange(item) {
        this.props.onHandleToolPageChange && this.props.onHandleToolPageChange(item);
    }

    render() {
        let isDark = theme === 'dark';

        // 运维数据
        let hourlyForecastList = this.props.hourlyForecastList;
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
                    <div className='pure-u-10-24'>
                        <div className={style.panels}>
                            <div className='pure-g'>
                                <div className={'pure-u-24-24 ' + style.panel}>
                                    <Table
                                        isColorInvert={false}
                                        tableId='maintanceTool'
                                        table={this.props.table}
                                        ths={['ID', '风机', '模型名称', '关联部件','工单号','推送日', '排查日', '等级']}
                                        keys={[ 'ID', 'LOCATION_CODE', 'PREDICT_MODEL_NAME', 'COMP_RELATED_NAME', '','CREATEDATE','', 'LEVEL_NAME']}
                                        hasHeader={false}
                                        hasOrder={false}
                                        totalRow={this.props.totalRow}
                                        pager={this.props.pager}
                                        onItemClick={this.handleItemClick}
                                        onPageChange={this.handleToolPageChange} />
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
    return {};
};

let mapDispatchToProps = function(dispatch) {
    return {};
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Pending);
