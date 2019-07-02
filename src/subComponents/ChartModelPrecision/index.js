import React from 'react';

import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;

const CIRCLE_COLOR = {
    dark: {
        circleOne: '#161d31',
        circleOneShadow: '#161d31',
        circleTwo: '#1b2136',
        circleTwoShadow: '#1a243c',
        empty: '#2a3354'
    },
    light: {
        circleOne: '#f7f8fa',
        circleOneShadow: '#f8f8fa',
        circleTwo: '#fdfdfe',
        circleTwoShadow: '#f5f6fa',
        empty: '#e5e5e5'
    }
};

const SCREEN_TYPES = {
    ipad: {
        labelFontSize: Utils.zoom(30)
    },
    miniscreen: {
        labelFontSize: Utils.zoom(30)
    },
    smallscreen: {
        labelFontSize: Utils.zoom(30)
    },
    mediumscreen: {
        labelFontSize: Utils.zoom(30)
    },
    highmediumscreen: {
        labelFontSize: Utils.zoom(30)
    },
    basescreen: {
        labelFontSize: Utils.zoom(30)
    },
    bigscreen: {
        labelFontSize: Utils.zoom(15)
    },
    highscreen: {
        labelFontSize: Utils.zoom(15)
    },
    bigscreenmicrosoft: {
        labelFontSize: Utils.zoom(10)
    }
};

class ChartModelPrecision extends React.Component {
    constructor(props) {
        super(props);

        // 数据初始化
        this.init = this.init.bind(this);
        // 获取颜色
        this.getColor = this.getColor.bind(this);
    }
    componentDidMount() {
        this.init();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.accuracy != this.props.accuracy) {
            this.init();
        }
    }
    init() {
        // 初始化echarts图表
        this.initChart();
        // 设置canvas尺寸为100%，响应页面缩放、resize(写在less中被覆盖)
        Utils.handleCanvasSize('modelPrecision');
    }
    initChart() {
        let screenType = Utils.getScreenType();
        let screenTypeObj = SCREEN_TYPES[screenType];
        let barColor = this.getColor(this.props.accuracy);
        let circleColor = CIRCLE_COLOR[theme];
        let option = {
            tooltip: {
                trigger: 'item',
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                formatter: function(params) {
                    return '<span style="display: inline-block; color: white;">' + params.seriesName + '</span><br />' + params.marker + '<span style="display: inline-block; color: white;">' + params.value + '%</span>';
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            series: [{
                z: 1,
                type: 'pie',
                silent: true,
                hoverAnimation: false,
                radius: ['48%', '65%'],
                data: [{
                    value: 1,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: circleColor.circleOne,
                            shadowBlur: Utils.zoom(0),
                            shadowColor: circleColor.circleOneShadow,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0
                        },
                        emphasis: {
                            color: circleColor.circleOne,
                            shadowBlur: Utils.zoom(0),
                            shadowColor: circleColor.circleOneShadow,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0
                        }
                    }
                }]
            }, {
                z: 2,
                type: 'pie',
                silent: true,
                hoverAnimation: false,
                radius: ['45%', '55%'],
                data: [{
                    value: 1,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: circleColor.circleTwo,
                            shadowBlur: Utils.zoom(15),
                            shadowColor: circleColor.circleTwoShadow,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0
                        },
                        emphasis: {
                            color: circleColor.circleTwo,
                            shadowBlur: Utils.zoom(15),
                            shadowColor: circleColor.circleTwoShadow,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0
                        }
                    }
                }]
            }, {
                name: '准确率',
                type: 'pie',
                z: 3,
                hoverAnimation: false,
                radius: ['35%', '45%'],
                data: [{
                    value: this.props.accuracy,
                    name: '准确率',
                    label: {
                        normal: {
                            show: true,
                            formatter: '{d}%\n' + '准确率',
                            position: 'center',
                            textStyle: {
                                color: barColor,
                                fontSize: screenTypeObj.labelFontSize
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: barColor,
                            shadowBlur: Utils.zoom(20),
                            shadowColor: barColor,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0
                        },
                        emphasis: {
                            color: barColor,
                            shadowBlur: Utils.zoom(20),
                            shadowColor: barColor,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0
                        }
                    }
                }, {
                    value: 100 - this.props.accuracy,
                    name: '不准确率',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    tooltip: {
                        show: false,
                        textStyle: {
                            color: 'transparent'
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0)'
                    },
                    itemStyle: {
                        normal: {
                            color: circleColor.empty
                        },
                        emphasis: {
                            color: circleColor.empty
                        }
                    }
                }]
            }]
        };

        if (!!this.props.center) {
            option.series[0]['center'] = this.props.center;
        }

        option = Object.assign({}, option, Utils.fixChartOption(option));
        Utils.initChart('modelPrecision', option);
    }
    getColor(val) {
        let value = new Number(val);
        if (value >= 85) {
            return '#8ccc45';
        } else if (value >= 60) {
            return '#f29934';
        } else if (value > 0) {
            return '#e56361';
        } else {
            return theme === 'dark' ? '#2a3354' : '#e5e5e5';
        }
    }
    render() {
        return (
            <div id='modelPrecision' className='full'></div>
        );
    }
}

module.exports = ChartModelPrecision;
