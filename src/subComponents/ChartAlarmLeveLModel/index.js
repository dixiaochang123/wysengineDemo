import React from 'react';

import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;

const LEVEL_MAP = {
    'level0': '总预警',
    'level1': '一级',
    'level2': '二级',
    'level3': '三级',
    'level4': '四级',
    'level5': '五级'
};

const SCREEN_TYPES = {
    ipad: {
        grid: {
            left: '1%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        }
    },
    miniscreen: {
        grid: {
            left: '1%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        }
    },
    smallscreen: {
        grid: {
            left: '1%',
            right: '10%',
            bottom: '3%',
            containLabel: true
        }
    },
    mediumscreen: {
        grid: {
            left: '1%',
            right: '10%',
            bottom: '3%',
            containLabel: true
        }
    },
    highmediumscreen: {
        grid: {
            left: '1%',
            right: '15%',
            bottom: '3%',
            containLabel: true
        }
    },
    basescreen: {
        grid: {
            left: '1%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        }
    },
    highscreen: {
        grid: {
            left: '1%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        }
    },
    bigscreen: {
        grid: {
            left: '1%',
            right: '15%',
            bottom: '10%',
            containLabel: true
        }
    },
    bigscreenmicrosoft: {
        grid: {
            left: '1%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        }
    }
};

class ChartAlarmLevelModel extends React.Component {
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
        Utils.handleCanvasSize('alarmLevelModel');
    }
    initChart() {
        let screenType = Utils.getScreenType();
        let chartConfig = SCREEN_TYPES[screenType];

        let chartData = this.props.data;
        let keys = Object.keys(chartData);
        if (Constant.PROJECT != 'mingyang') {
            keys = keys.filter((key) => key.slice(-1) < 4);
        }

        let textColor = THEME_MAP[theme].textColor;

        let total = 0;
        let title = '';
        keys.forEach((item) => {
            total += (!!chartData[item] ? chartData[item].value : 0);
            title += ('  ' + LEVEL_MAP[item] + (!!chartData[item] ? chartData[item].value : 0) + '个');
        });
        title = LEVEL_MAP['level0'] + total + '个' + title;

        let xAxisData = keys.map((item) => {
            return {
                value: LEVEL_MAP[item] + '预警',
                textStyle: {
                    color: textColor,
                    fontSize: Utils.zoom(12)
                }
            };
        });

        let seriesData = keys.map((item) => {
            return {
                name: LEVEL_MAP[item] + (!!chartData[item] ? chartData[item].value : 0) + '个',
                value: !!chartData[item] ? chartData[item].value : 0,
                itemStyle: {
                    normal: {
                        color: Constant.LEVEL_COLOR_MAP[item]
                    }
                }
            };
        });

        let option = {
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow'
                },
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                formatter: function(params) {
                    return '<span style="display: inline-block; color: white;">' + params.name + '</span><br />' + params.marker + '<span style="display: inline-block; color: white;">' + params.value + '</span>个';
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            title: {
                text: title,
                textStyle: {
                    color: textColor,
                    fontSize: Utils.zoom(12)
                },
                top: '1%',
                right: '5%'
            },
            grid: chartConfig.grid,
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
                    textStyle: {
                        color: THEME_MAP[theme].labelColor,
                        fontSize: Utils.zoom(10)
                    }
                },
                splitLine: {
                    lineStyle: {
                        width: Utils.zoom(1),
                        type: 'dashed',
                        color: THEME_MAP[theme].splitLineColor
                    }
                }
            },
            series: {
                type: 'bar',
                barWidth: Utils.zoom(18),
                data: seriesData
            }
        };

        option = Object.assign({}, option, Utils.fixChartOption(option));
        if ($(document.body).attr('bigscreenmicrosoft') == 'true') {
            option.grid = Object.assign({}, option.grid, {
                top: '20%',
                bottom: '11%',
                right: '16%'
            });
        }

        Utils.initChart('alarmLevelModel', option);
    }
    render() {
        return (
            <div id='alarmLevelModel' className='full'></div>
        );
    }
}

module.exports = ChartAlarmLevelModel;
