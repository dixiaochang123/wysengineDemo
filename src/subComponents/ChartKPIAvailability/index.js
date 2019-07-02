import React from 'react';

import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let KPI_NAME_MAP = Constant.KPI_NAME_MAP;

class ChartKPIAvailability extends React.Component {
    constructor(props) {
        super(props);

        // 初始化
        this.init = this.init.bind(this);
        // 初始化echarts图表
        this.initChart = this.initChart.bind(this);
    }
    componentDidMount() {
        this.init();
    }
    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.data) == JSON.stringify(this.props.data) && prevProps.showFilter != this.props.showFilter) {
            return false;
        }
        if (prevProps.data != this.props.data) {
            this.init();
        }
    }
    init() {
        this.initChart();
        // 设置canvas尺寸为100%，响应页面缩放、resize(写在less中被覆盖)
        Utils.handleCanvasSize('kpiAvailability');
    }
    initChart() {
        let chartData = this.props.data;

        let areas = chartData.map((item) => item.area);
        let firstSeriesData = chartData.map((item) => {
            return {
                name: '时间可利用率',
                value: item.timeRate
            };
        });

        let secondSeriesData = chartData.map((item) => {
            return {
                name: '发电量可利用率',
                value: item.energyRate
            };
        });

        let option = {
            tooltip: {
                trigger: 'axis',
                // formatter: '{a0}：{c0}% <br /> {a1}: {c1}%',
                formatter: function(params) {
                    return params[0].marker+params[0].data.name+ ' : ' +'<span style="display:inline-block;color:white;">'+params[0].data.value+'%'+'</span>'+'<br />'+params[1].marker+params[1].data.name+ ' : ' +'<span style="display:inline-block;color:white;">'+params[1].data.value+'%'+'</span>';
                },
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                // 坐标轴指示器，坐标轴触发有效
                axisPointer: {
                    // 默认为直线，可选为：'line' | 'shadow' | 'cross'
                    type: 'shadow'
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            legend: {
                right: Utils.zoom(80),
                itemWidth: 10,
                itemHeight: 10,
                data: [{
                    name: '时间可利用率(%)',
                    icon: 'circle'
                },{
                    name: '发电量可利用率(%)',
                    icon: 'circle'
                }],
                textStyle: {
                    color: THEME_MAP[theme].textColor,
                    fontSize: Utils.zoom(12)
                }
            },
            grid: {
                bottom: '15%',
                left: Utils.zoom(35),
                right: Utils.zoom(40)
            },
            xAxis: [{
                type: 'category',
                axisLine: {
                    show: false
                },
                data: areas,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: THEME_MAP[theme].textColor,
                        fontSize: Utils.zoom(12)
                    }
                },
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                name: KPI_NAME_MAP['时间可利用率'],
                nameTextStyle: {
                    color: THEME_MAP[theme].chartYtextColor,
                    fontSize: Utils.zoom(10),
                    align: 'left'
                },
                position: 'left',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}%',
                    textStyle: {
                        color: THEME_MAP[theme].chartYtextColor,
                        fontSize: Utils.zoom(10),
                        align: 'left'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: THEME_MAP[theme].chartSplitLineColor,
                        width: 1,
                        type: 'dashed'
                    }
                }
            }, {
                type: 'value',
                name: KPI_NAME_MAP['发电量可利用率'],
                nameTextStyle: {
                    color: THEME_MAP[theme].chartYtextColor,
                    fontSize: Utils.zoom(10),
                    align: 'right'
                },
                position: 'right',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}%',
                    textStyle: {
                        color: THEME_MAP[theme].chartYtextColor,
                        fontSize: Utils.zoom(10)
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: THEME_MAP[theme].chartSplitLineColor,
                        width: 1,
                        type: 'dashed'
                    }
                }
            }],
            series: [{
                name: '时间可利用率(%)',
                type: 'bar',
                data: firstSeriesData,
                barMaxWidth: Utils.zoom(17),
                yAxisIndex: 0,
                itemStyle: {
                    normal: {
                        color: '#8ff5ff'
                    }
                }
            }, {
                name: '发电量可利用率(%)',
                type: 'bar',
                data: secondSeriesData,
                barMaxWidth: Utils.zoom(17),
                barGap: 0,
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: '#61a5f9'
                    }
                }
            }]
        };

        option = Object.assign({}, option, Utils.fixChartOption(option));
        if ($(document.body).attr('bigscreenmicrosoft') == 'true') {
            option.grid = Object.assign({}, option.grid, {
                top: '25%',
                bottom: '15%'
            });
        }
        if ($(document.body).attr('miniscreen') == 'true') {
            option.grid = Object.assign({}, option.grid, {
                top: '30%',
                bottom: '20%'
            });
        }

        Utils.initChart('kpiAvailability', option);
    }
    render() {
        return (
            <div id='kpiAvailability' className='full'></div>
        );
    }
}

module.exports = ChartKPIAvailability;
