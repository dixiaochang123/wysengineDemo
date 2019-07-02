// 首页-区域预警图及完结情况组件
import React from 'react';
import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let style = require('./' + theme + '.less');

const SCREEN_TYPES = {
    ipad: {
        txtSize: Utils.zoom(12),
        labelSize: Utils.zoom(10),
        barWidth: Utils.zoom(20),
        splitLine: Utils.zoom(1),
        line: Utils.zoom(2),
        symbolSize: Utils.zoom(8),
        itemSize: Utils.zoom(8),
        grid: {
            top: '27%',
            bottom: '15%',
            left: '13%',
            right: '13%'
        }
    },
    miniscreen: {
        txtSize: Utils.zoom(12),
        labelSize: Utils.zoom(10),
        barWidth: Utils.zoom(20),
        splitLine: Utils.zoom(1),
        line: Utils.zoom(2),
        symbolSize: Utils.zoom(8),
        itemSize: Utils.zoom(8),
        grid: {
            top: '27%',
            bottom: '15%',
            left: '13%',
            right: '13%'
        }
    },
    smallscreen: {
        txtSize: Utils.zoom(12),
        labelSize: Utils.zoom(10),
        barWidth: Utils.zoom(20),
        splitLine: Utils.zoom(1),
        line: Utils.zoom(2),
        symbolSize: Utils.zoom(8),
        itemSize: Utils.zoom(8),
        grid: {
            top: '17%',
            bottom: '11%',
            left: '13%',
            right: '10%'
        }
    },
    mediumscreen: {
        txtSize: Utils.zoom(12),
        labelSize: Utils.zoom(10),
        barWidth: Utils.zoom(20),
        splitLine: Utils.zoom(1),
        line: Utils.zoom(2),
        symbolSize: Utils.zoom(8),
        itemSize: Utils.zoom(8),
        grid: {
            top: '17%',
            bottom: '11%',
            left: '13%',
            right: '10%'
        }
    },
    highmediumscreen: {
        txtSize: Utils.zoom(12),
        labelSize: Utils.zoom(10),
        barWidth: Utils.zoom(20),
        splitLine: Utils.zoom(1),
        line: Utils.zoom(2),
        symbolSize: Utils.zoom(8),
        itemSize: Utils.zoom(8),
        grid: {
            top: '17%',
            bottom: '11%',
            left: '13%',
            right: '10%'
        }
    },
    basescreen: {
        txtSize: Utils.zoom(12),
        labelSize: Utils.zoom(10),
        barWidth: Utils.zoom(20),
        splitLine: Utils.zoom(1),
        line: Utils.zoom(2),
        symbolSize: Utils.zoom(8),
        itemSize: Utils.zoom(8),
        grid: {
            top: '17%',
            bottom: '11%',
            left: '13%',
            right: '10%'
        }
    },
    highscreen: {
        txtSize: Utils.zoom(24),
        labelSize: Utils.zoom(20),
        barWidth: Utils.zoom(20),
        splitLine: Utils.zoom(2),
        line: Utils.zoom(2),
        symbolSize: Utils.zoom(16),
        itemSize: Utils.zoom(16),
        grid: {
            top: '17%',
            bottom: '11%',
            left: '13%',
            right: '10%'
        }
    },
    bigscreen: {
        txtSize: Utils.zoom(12),
        labelSize: Utils.zoom(10),
        barWidth: Utils.zoom(20),
        splitLine: Utils.zoom(2),
        line: Utils.zoom(2),
        symbolSize: Utils.zoom(8),
        itemSize: Utils.zoom(8),
        grid: {
            top: '17%',
            bottom: '11%',
            left: '13%',
            right: '10%'
        }
    },
    bigscreenmicrosoft: {
        txtSize: Utils.zoom(12),
        labelSize: Utils.zoom(10),
        barWidth: Utils.zoom(20),
        splitLine: Utils.zoom(1),
        line: Utils.zoom(2),
        symbolSize: Utils.zoom(8),
        itemSize: Utils.zoom(8),
        grid: {
            top: '18%',
            bottom: '11%',
            left: '13%',
            right: '10%'
        }
    }
};

class ChartAreaAlarmRate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 数据初始化
        this.init = this.init.bind(this);
        // 点击更多按钮的回调事件
        this.onMore = this.onMore.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (Utils.isEmpty(this.props.data)) {
            $('.' + style.box + ' .dataEmpty').empty();
            return false;
        }
        if (JSON.stringify(prevProps.data) != JSON.stringify(this.props.data)) {
            this.init();
        }
    }
    componentDidMount() {
        this.init();
    }
    init() {
        // 初始化echarts图表
        this.initChart();
        // 设置canvas尺寸为100%，响应页面缩放、resize(写在less中被覆盖)
        Utils.handleCanvasSize('areaAlarmRateCanvas');
    }
    initChart() {
        let chartData = this.props.data;
        let screenType = Utils.getScreenType();
        let chartConfig = SCREEN_TYPES[screenType];
        let chartDataKeys = Object.keys(chartData);
        let chartDataAry = chartDataKeys.map((key) => chartData[key]);

        let areas = [].concat(chartDataAry).map((item) => item.name);
        let areaValues = [].concat(chartDataAry).map((item) => {
            return {
                value: item.value,
                itemStyle: {
                    normal: {
                        color: '#3f8eef'
                    }
                }
            }
        });

        let countPerTurbine = [].concat(chartDataAry).map((item) => {
            return {
                value: item.countPerTurbine || 0,
                itemStyle: {
                    normal: {
                        color: '#e56361'
                    }
                }
            }
        });

        let areaRates = [].concat(chartDataAry).map(function(item) {
            return item.ticketCount > 0 ? (100 * item.finishedValue / item.ticketCount).toFixed(2) : 0;
        });

        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'transparent'
                    }
                },
                formatter: function(params) {
                    return '<span style="display: inline-block;color: white;">' + params[0].name + '</span>' + '<br />' +
                    params[0].marker + '预警数量 : '+ '<span style="display: inline-block;color: white;">' + params[0].value + '个' +'</span>' + '<br />' +
                    params[1].marker + '台均次数 : '+ '<span style="display: inline-block;color: white;">' + params[1].value + '次' +'</span>' + '<br />' +
                    params[2].marker + '预警完结率 : '+ '<span style="display: inline-block;color: white;">' + params[2].value +'%'+ '</span>';
                },
                textStyle: {
                    fontSize: chartConfig.txtSize,
                    color: '#b2b4bd'
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            grid: chartConfig.grid,
            color: ['#3f8eef', '#e56361' ,'#f29934'],
            legend: {
                top: '2%',
                right: '2%',
                data: [{
                    name: '预警完结率',
                    textStyle: {
                        color: THEME_MAP[theme].textColor,
                        fontSize: chartConfig.txtSize
                    }
                }, {
                    name: '台均次数',
                    icon: 'circle',
                    textStyle: {
                        color: THEME_MAP[theme].textColor,
                        fontSize: chartConfig.txtSize
                    }
                }, {
                    name: '预警数量',
                    icon: 'circle',
                    textStyle: {
                        color: THEME_MAP[theme].textColor,
                        fontSize: chartConfig.txtSize
                    }
                }],
                itemWidth: chartConfig.itemSize,
                itemHeight: chartConfig.itemSize
            },
            xAxis: [{
                type: 'category',
                nameTextStyle: {
                    fontSize: chartConfig.txtSize
                },
                data: areas,
                axisPointer: {
                    type: 'line',
                    label: {
                        textStyle: {
                            fontSize: chartConfig.txtSize
                        }
                    }
                },
                axisLabel: {
                    color: THEME_MAP[theme].textColor,
                    fontSize: chartConfig.txtSize
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
            yAxis: [{
                type: 'value',
                axisPointer: {
                    type: 'line',
                    label: {
                        textStyle: {
                            fontSize: chartConfig.txtSize
                        }
                    }
                },
                axisLabel: {
                    color: THEME_MAP[theme].labelColor,
                    formatter: '{value}',
                    fontSize: chartConfig.labelSize
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        width: chartConfig.splitLine,
                        type: 'dashed',
                        color: THEME_MAP[theme].splitLineColor
                    }
                },
                minInterval: 1
            }, {
                type: 'value',
                axisPointer: {
                    type: 'line',
                    label: {
                        textStyle: {
                            fontSize: chartConfig.txtSize
                        }
                    }
                },
                axisLabel: {
                    color: THEME_MAP[theme].labelColor,
                    formatter: '{value}%',
                    fontSize: chartConfig.labelSize
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                min: 0,
                max: 100,
                minInterval: 1
            }],
            series: [{
                name: '预警数量',
                type: 'bar',
                barWidth: chartConfig.barWidth,
                // barGap: '-100%',
                data: areaValues
            }, {
                name: '台均次数',
                type: 'bar',
                barGap: '-100%',
                barWidth: chartConfig.barWidth,
                data: countPerTurbine
            }, {
                name: '预警完结率',
                type: 'line',
                yAxisIndex: 1,
                data: areaRates,
                symbol: 'emptyCircle',
                symbolSize: chartConfig.symbolSize,
                hoverAnimation: true,
                itemStyle: {
                    normal: {
                        color: '#f29934',
                        width: chartConfig.line
                    }
                }
            }]
        };

        Utils.initChart('areaAlarmRateCanvas', option, {
            click: function(params) {
                if (params.event.cancelBubble == true) {
                    return false;
                }
                if (params.componentType == 'series') {
                    !!this.props.onItemClick && this.props.onItemClick(params);
                }
                params.event.cancelBubble = true;
            }.bind(this)
        });
    }
    onMore() {
        !!this.props.onMore && this.props.onMore();
    }
    render() {
        return (
            <div className={'full ' + style.box}>
                <div className={'panelHeader ' + style.header}>
                    <span className='panelTitle'>区域预警及完结情况（近一月）</span>
                    <span className='panelSubTitle'>TOP10</span>
                    <span className='panelLink linkBtn' onClick={this.onMore}></span>
                </div>
                {!Utils.isEmpty(this.props.data) ?
                <div id='areaAlarmRateCanvas' className='full'></div> :
                <div className='dataEmpty'></div>}
            </div>
        );
    }
}

module.exports = ChartAreaAlarmRate;
