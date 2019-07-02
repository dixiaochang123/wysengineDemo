import React from 'react';

import Constant from 'constant/index';
import Utils from 'utils/utils';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let style = require('./' + theme + '.less');

const COLOR_MAP = {
    '未审核': '#f29934',
    '已通过': '#408ef0',
    '未通过': '#e56361',
    '已推送': '#366fbb',
    '已完成': '#8ccc45',
    '已确认': '#bfbfbf',
    '预警总数': '#00dbe7'
};

class Turbine extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 初始化
        this.init = this.init.bind(this);
        // 初始化echarts图表
        this.initChart = this.initChart.bind(this);
    }
    componentDidMount() {
        this.init();
    }
    componentDidUpdate() {
        this.init();
    }
    init() {
        // 初始化echarts图表
        this.initChart();
        // 设置canvas尺寸为100%，响应页面缩放、resize(写在less中被覆盖)
        Utils.handleCanvasSize(this.props.id);
    }
    initChart() {
        let isDark = theme === 'dark';
        let turbineOverview = this.props.turbineOverview;
        let turbineDetail = [{
            name: '预警总数',
            value: !!turbineOverview.predictTotal ? turbineOverview.predictTotal : 0
        }, {
            name: '已确认',
            value: !!turbineOverview.confirmCount ? turbineOverview.confirmCount : 0
        }, {
            name: '已完成',
            value: !!turbineOverview.completeCount ? turbineOverview.completeCount : 0
        }, {
            name: '已推送',
            value: !!turbineOverview.pushCount ? turbineOverview.pushCount : 0
        }, {
            name: '未通过',
            value: !!turbineOverview.notPassCount ? turbineOverview.notPassCount : 0
        }, {
            name: '已通过',
            value: !!turbineOverview.passCount ? turbineOverview.passCount : 0
        }, {
            name: '未审核',
            value: !!turbineOverview.notCheckCount ? turbineOverview.notCheckCount : 0
        }];

        let yAxisData = turbineDetail.map((item) => item.name);
        let subYAxisData = turbineDetail.map((item) => item.value);

        let seriesData = turbineDetail.map((item) => {
            return {
                value: item.value,
                itemStyle: {
                    normal: {
                        color: COLOR_MAP[item.name]
                    }
                }
            };
        });

        let silentSeriesData = turbineDetail.map((item) => {
            return {
                value: turbineDetail[0].value > 0 ? turbineDetail[0].value - item.value : 1
            };
        });

        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                formatter: function(params) {
                    return '<span style="display: inline-block;color: white;">' + params[0].name + '</span>' + '<br />' + params[0].marker + '<span style="display: inline-block;color: white;">' + params[0].value + '</span>' + '个';
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            grid: {
                containLabel: true,
                top: 0,
                bottom: 0,
                left: '10%',
                right: '10%'
            },
            xAxis: {
                show: false
            },
            yAxis: [{
                type: 'category',
                data: yAxisData,
                axisLabel: {
                    margin: 20,
                    align: 'right',
                    color: THEME_MAP[theme].textColor,
                    fontSize: Utils.zoom(16)
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }, {
                type: 'category',
                data: subYAxisData,
                axisLabel: {
                    margin: 20,
                    align: 'left',
                    color: THEME_MAP[theme].textColor,
                    fontSize: Utils.zoom(16)
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            series: [{
                yAxisIndex: 0,
                type: 'bar',
                stack: 'chart',
                z: 3,
                data: seriesData,
                barMaxWidth: Utils.zoom(9)
            }, {
                yAxisIndex: 0,
                type: 'bar',
                stack: 'chart',
                slient: true,
                data: silentSeriesData,
                barMaxWidth: Utils.zoom(9),
                itemStyle: {
                    normal: {
                        color: isDark ? '#2a3354' : '#eef5fd'
                    }
                }
            }]
        };

        Utils.initChart(this.props.id, option);
    }
    render() {
        let turbineOverview = this.props.turbineOverview;
        let turbineType = this.props.type;
        let turbineCount = !!turbineOverview.turbineCount ? turbineOverview.turbineCount : 0;
        let completeRate = !!turbineOverview.completeRate ? turbineOverview.completeRate : '0.0%';
        let transferRate = !!turbineOverview.transferRate ? turbineOverview.transferRate : '0.0%';
        let predictPerTurbine = !!turbineOverview.predictPerTurbine ? turbineOverview.predictPerTurbine : 0;
        return (
            <div className={style.box}>
                <div className={style.boxInner}>
                    <div className={style.header}>
                        <span className={style.title}>{turbineType}</span>
                        <span className={style.subTitle}>{turbineCount + '台'}</span>
                    </div>
                    <div className={style.info}>
                        <div className={style.infoItem}>
                            <span className={style.infoItemVal}>{completeRate}</span>
                            <span>完成率</span>
                        </div>
                        <div className={style.infoItem}>
                            <span className={style.infoItemVal}>{transferRate}</span>
                            <span>转换率</span>
                        </div>
                        <div className={style.infoItem}>
                            <span className={style.infoItemVal}>{predictPerTurbine}</span>
                            <span>台均次数</span>
                        </div>
                    </div>
                </div>
                <div id={this.props.id} className={style.canvas}></div>
            </div>
        );
    }
}

module.exports = Turbine;
