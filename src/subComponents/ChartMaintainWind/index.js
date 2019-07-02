// 预警明细-维护窗口风向图
import React from 'react';
import Moment from 'moment';
import Utils from 'utils/utils';
import Constant from 'constant/index';

// 风向
import IconFx from 'images/warninginfordetails/fx.png';
import IconFxHor from 'images/warninginfordetails/fx_horizontal.png';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let style = require('./' + theme + '.less');

class ChartMaintainWind extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 初始化
        this.init = this.init.bind(this);
        // 初始化echarts
        this.initChart = this.initChart.bind(this);
    }
    componentDidMount() {
        this.init();
    }
    componentDidUpdate() {
        this.init();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.currTab != 'win' && nextProps.currTab == 'win') {
            this.init();
        }
    }
    init() {
        // 初始化echarts图表
        this.initChart();
        // 设置canvas尺寸为100%，响应页面缩放、resize(写在less中被覆盖)
        Utils.handleCanvasSize(this.props.id);
    }
    initChart() {
        let hourlyForecastList = this.props.hourlyForecastList || [];
        let xAxisData = hourlyForecastList.length > 0 ? hourlyForecastList.map((item) => Moment(item.DATETIME, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')) : [];

        let seriesDataWind = [];
        if (hourlyForecastList.length > 0) {
            hourlyForecastList.map((item, index) => {
                seriesDataWind[index] = {
                    value: item.WIND_SPEED,
                    name: item.WIND_DIRECTION_DESC,
                    symbol: 'image://' + IconFx,
                    symbolSize: [Utils.zoom(16), Utils.zoom(26)],
                    symbolRotate: -item.WIND_DIRECTION + 180
                };
            });
        }
        let seriesDataPower = hourlyForecastList.length > 0 ? hourlyForecastList.map((item) => item.THEORY_POWER) : [];

        let option = {
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    return '风速：' + '<span style="display: inline-block; color: white;">' + params[0].value + ' m/s' + '</span>' +
                        ' <br />' + '风向：' + '<span style="display: inline-block; color: white;">' + params[0].data.name + '</span>' +
                        '<br />理论功率：' +
                        '<span style="display: inline-block; color: white;">' + seriesDataPower[params[0].dataIndex] + ' kW' + '</span>' +
                        ' <br/>时间：' +
                        '<span style="display: inline-block; color: white;">' + hourlyForecastList[params[0].dataIndex].DATETIME + '</span>';
                },
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            color: ['#3f8def', '#009944'],
            legend: {
                top: '0%',
                right: '1%',
                data: [{
                    name: '风向',
                    icon: 'image://' + IconFxHor,
                    textStyle: {
                        color: THEME_MAP[theme].textColor,
                        fontSize: Utils.zoom(12)
                    }
                }, {
                    name: '风速',
                    textStyle: {
                        color: THEME_MAP[theme].textColor,
                        fontSize: Utils.zoom(12)
                    }
                }, {
                    name: '理论功率',
                    textStyle: {
                        color: THEME_MAP[theme].textColor,
                        fontSize: Utils.zoom(12)
                    }
                }],
                itemWidth: $(document.body).attr('bigscreenmicrosoft') != 'true' ? Utils.zoom(13) : Utils.zoom(26),
                itemHeight: $(document.body).attr('bigscreenmicrosoft') != 'true' ? Utils.zoom(8) : Utils.zoom(16)
            },
            grid: {
                top: $(document.body).attr('bigscreenmicrosoft') != 'true' ? '20%' : 190,
                bottom: '20%',
                left: 0,
                right: '1%',
                containLabel: true
            },
            calculable: true,
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLine: {
                    lineStyle: {
                        width: Utils.zoom(1),
                        type: 'dashed',
                        color: THEME_MAP[theme].splitLineColor
                    }
                },
                axisLabel: {
                    show: $(document.body).attr('bigscreenmicrosoft') != 'true' ? true : false,
                    rotate: -30,
                    interval: 0,
                    textStyle: {
                        fontSize: Utils.zoom(12),
                        color: THEME_MAP[theme].textColor
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: [{
                type: 'value',
                name: '风速 m/s',
                position: 'left',
                nameTextStyle: {
                    color: THEME_MAP[theme].labelColor,
                    fontSize: Utils.zoom(10)
                },
                nameGap: $(document.body).attr('bigscreenmicrosoft') != 'true' ? 20 : 40,
                max: 'dataMax',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: Utils.zoom(10),
                        color: THEME_MAP[theme].labelColor
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        width: Utils.zoom(1),
                        type: 'dashed',
                        color: THEME_MAP[theme].splitLineColor
                    }
                }
            }, {
                type: 'value',
                name: '理论功率 kW',
                position: 'right',
                nameTextStyle: {
                    color: THEME_MAP[theme].labelColor,
                    fontSize: Utils.zoom(10)
                },
                nameGap: $(document.body).attr('bigscreenmicrosoft') != 'true' ? 20 : 40,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: Utils.zoom(10),
                        color: THEME_MAP[theme].labelColor
                    }
                },
                splitLine: {
                    show: false
                }
            }],
            series: [{
                name: '风向',
                type: 'line',
                yAxisIndex: 0,
                areaStyle: {
                    normal: {
                        opacity: 0
                    }
                },
                lineStyle: {
                    normal: {
                        opacity: 0
                    }
                },
                data: seriesDataWind
            }, {
                name: '风速',
                type: 'line',
                yAxisIndex: 0,
                lineStyle: {
                    normal: {
                        width: Utils.zoom(1),
                        color: '#3f8def'
                    }
                },
                data: seriesDataWind,
                smooth: true
            }, {
                name: '理论功率',
                type: 'line',
                yAxisIndex: 1,
                symbolSize: 0,
                lineStyle: {
                    normal: {
                        width: Utils.zoom(1),
                        color: '#009944'
                    }
                },
                data: seriesDataPower,
                smooth: true
            }]
        };

        Utils.initChart(this.props.id, option);
    }
    render() {
        return (
            <div id={this.props.id} className={style.box}></div>
        );
    }
}

module.exports = ChartMaintainWind;
