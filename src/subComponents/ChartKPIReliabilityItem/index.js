import React from 'react';

import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let KPI_NAME_MAP = Constant.KPI_NAME_MAP;

class ChartKPIReliabilityItem extends React.Component {
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
        Utils.handleCanvasSize(this.props.id);
    }
    initChart() {
        let isMsBigScreen = $(document.body).attr('bigscreenmicrosoft')=='true' ? true : false;
        let chartData = this.props.data;
        let legends = this.props.legends;
        let legends2 = legends.slice(0);
        let legends3 = legends2.map(function(item) {
            return {
                name: item,
                icon: 'circle'
            }
        })
        let color = this.props.color || [];
        let areas = chartData.map((item) => item.area);

        let name1 = KPI_NAME_MAP[legends[0].split('(')[0]];
        let gridLeft = Utils.zoom(40);
        let firstSeriesData = chartData.map((item) => {
            let leg = (item.value1+'').length;
            if(leg==5 || leg>5) {
                name1 += '   ';
                gridLeft = !!isMsBigScreen ? Utils.zoom(50) : Utils.zoom(60);
            } else {
                name1 +='';
            }
            return {
                name: legends[0],
                value: item.value1
            };
        });
        let secondYaxisData = chartData.map((item) => {
            return {
                name: legends[1],
                value: item.value2
            };
        });

        let option = {
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    return params[0].marker+params[0].data.name+ ' : ' +'<span style="display:inline-block;color:white;">'+params[0].data.value+'</span>'+'<br />'+params[1].marker+params[1].data.name+ ' : ' +'<span style="display:inline-block;color:white;">'+params[1].data.value+'</span>';
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
                data: legends3,
                itemWidth: 10,
                itemHeight: 10,
                textStyle: {
                    color:  THEME_MAP[theme].textColor,
                    fontSize: Utils.zoom(12)
                }
            },
            grid: {
                bottom: '15%',
                left: gridLeft,
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
                        color:  THEME_MAP[theme].textColor,
                        fontSize: Utils.zoom(12)
                    }
                },
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                name: name1,
                nameTextStyle: {
                    color:  THEME_MAP[theme].chartYtextColor,
                    fontSize: Utils.zoom(10)
                    // align: 'left'
                },
                position: 'left',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color:  THEME_MAP[theme].chartYtextColor,
                        fontSize: Utils.zoom(10)
                    }
                },
                axisTick: {
                    show: true
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
                name: KPI_NAME_MAP[legends[1].split('(')[0]],
                nameTextStyle: {
                    color:  THEME_MAP[theme].chartYtextColor,
                    fontSize: Utils.zoom(10),
                    align: 'right'
                },
                position: 'right',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color:  THEME_MAP[theme].chartYtextColor,
                        fontSize: Utils.zoom(10)
                    }
                },
                axisTick: {
                    show: true
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: THEME_MAP[theme].chartSplitLineColor,
                        width: 1,
                        type: 'dashed'
                    }
                }
            }],
            series: [{
                name: legends[0],
                type: 'bar',
                data: firstSeriesData,
                barMaxWidth: Utils.zoom(17),
                yAxisIndex: 0,
                itemStyle: {
                    normal: {
                        color: color[0]
                    }
                }
            }, {
                name: legends[1],
                type: 'bar',
                data: secondYaxisData,
                barMaxWidth: Utils.zoom(17),
                barGap: 0,
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: color[1]
                    }
                }
            }]
        };

        option = Object.assign({}, option, Utils.fixChartOption(option));
        if ($(document.body).attr('bigscreenmicrosoft') == 'true') {
            option.grid = Object.assign({}, option.grid, {
                top: '25%',
                bottom: '20%'
            });
        }
        if ($(document.body).attr('miniscreen') == 'true') {
            option.grid = Object.assign({}, option.grid, {
                top: '30%',
                bottom: '20%'
            });
        }

        Utils.initChart(this.props.id, option);
    }
    render() {
        return (
            <div id={this.props.id} className='full'></div>
        );
    }
}

module.exports = ChartKPIReliabilityItem;
