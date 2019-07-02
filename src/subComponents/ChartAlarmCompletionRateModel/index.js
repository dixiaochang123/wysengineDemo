import React from 'react';
import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;

const LEVEL_MAP = {
    level1: '一级预警',
    level2: '二级预警',
    level3: '三级预警',
    level4: '四级预警',
    level5: '五级预警'
};

class ChartAlarmCompletionRateModel extends React.Component {
    constructor(props) {
        super(props);

        // 数据初始化
        this.init = this.init.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.data != this.props.data) {
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
        Utils.handleCanvasSize('alarmCompletionRateModel');
    }
    initChart() {
        let isBigScreen = Utils.isBigScreen();

        let chartData = this.props.data.levelRateMap || {};
        let groupKeys = Object.keys(chartData).sort();
        if (Constant.PROJECT != 'mingyang') {
            groupKeys = groupKeys.filter((key) => key.slice(-1) < 4);
        }

        let textColor = THEME_MAP[theme].textColor;
        let xAxisData = groupKeys.map((item) => {
            return {
                value: LEVEL_MAP[item],
                textStyle: {
                    color: textColor,
                    fontSize: Utils.zoom(12)
                }
            };
        });

        let seriesData = groupKeys.map((item) => {
            return {
                value: !!chartData[item] ? chartData[item].slice(0, -1) : 0.0,
                itemStyle: {
                    normal: {
                        color: '#6ba5ec'
                    }
                }
            };
        });

        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line'
                },
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                formatter: function(params) {
                    return '<span style="display:inline-block;color:white;">'+params[0].name+'</span>'+'<br />'+params[0].marker +'<span style="display:inline-block;color:white;">'+params[0].value+'%'+'</span>';
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            grid: {
                top: '8%',
                bottom: !isBigScreen ? '5%' : '10%',
                left: '1%',
                right: !isBigScreen ? '5%' : '19%',
                containLabel: true
            },
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
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: THEME_MAP[theme].labelColor,
                    fontSize: Utils.zoom(10)
                },
                splitLine: {
                    lineStyle: {
                        width: Utils.zoom(1),
                        type: 'dashed',
                        color: THEME_MAP[theme].splitLineColor
                    }
                },
                min: 0,
                max: 120
            },
            series: {
                type: 'line',
                symbolSize: 0,
                lineStyle: {
                    normal: {
                        width: Utils.zoom(1),
                        color: '#6ba5ec'
                    }
                },
                data: seriesData
            }
        };

        option = Object.assign({}, option, Utils.fixChartOption(option));
        if ($(document.body).attr('bigscreenmicrosoft') == 'true') {
            option.grid = Object.assign({}, option.grid, {
                top: '20%',
                bottom: '11%',
                right: '21%'
            });
        }

        Utils.initChart('alarmCompletionRateModel', option);
    }
    render() {
        return (
            <div id='alarmCompletionRateModel' className='full'></div>
        );
    }
}

module.exports = ChartAlarmCompletionRateModel;
