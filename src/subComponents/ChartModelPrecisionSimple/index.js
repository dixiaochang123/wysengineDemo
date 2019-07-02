import React from 'react';

import Utils from 'utils/utils';

let theme = Utils.getTheme();

const CHART_COLORS = {
    light: {
        shadowColor: '#f8f8f8',
        emptyCircle: '#e5e5e5'
    },
    dark: {
        shadowColor: '#1b2138',
        emptyCircle: '#2a3354'
    }
};

const SCREEN_TYPES = {
    ipad: {
        outerRadius: [55, 60],
        innerRadius: [50, 55]
    },
    miniscreen: {
        outerRadius: [55, 60],
        innerRadius: [50, 55]
    },
    smallscreen: {
        outerRadius: [65, 70],
        innerRadius: [60, 65]
    },
    mediumscreen: {
        outerRadius: [65, 70],
        innerRadius: [60, 65]
    },
    highmediumscreen: {
        outerRadius: [65, 70],
        innerRadius: [60, 65]
    },
    basescreen: {
        outerRadius: [65, 70],
        innerRadius: [60, 65]
    },
    bigscreen: {
        outerRadius: [120, 125],
        innerRadius: [110, 120]
    },
    highscreen: {
        outerRadius: [120, 125],
        innerRadius: [110, 120]
    },
    bigscreenmicrosoft: {
        outerRadius: [210, 215],
        innerRadius: [200, 210]
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
        let outerRadius = SCREEN_TYPES[screenType].outerRadius;
        let innerRadius = SCREEN_TYPES[screenType].innerRadius;
        let accuracy = this.props.accuracy;
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} ({d}%)',
                textStyle: {
                    fontSize: Utils.zoom(14)
                }
            },
            series: [{
                type: 'pie',
                clockWise: false,
                radius: outerRadius,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                silent: true,
                hoverAnimation: false,
                center: ['50%', '50%'],
                data: [{
                    value: 100,
                    name: 'invisible',
                    itemStyle: {
                        normal: {
                            color: CHART_COLORS[theme].shadowColor,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        emphasis: {
                            color: CHART_COLORS[theme].shadowColor,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    }
                }]
            }, {
                type: 'pie',
                clockWise: false,
                radius: innerRadius,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                silent: true,
                hoverAnimation: false,
                center: ['50%', '50%'],
                data: [{
                    value: 100 - accuracy,
                    name: 'invisible',
                    itemStyle: {
                        normal: {
                            color: CHART_COLORS[theme].emptyCircle,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        emphasis: {
                            color: CHART_COLORS[theme].emptyCircle,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    }
                }, {
                    value: accuracy,
                    label: {
                        normal: {
                            formatter: '{d}%',
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: accuracy > 0 ? Utils.zoom(30) : Utils.zoom(16),
                                fontWeight: 'normal',
                                color: accuracy > 0 ? this.getColor(accuracy) : CHART_COLORS[theme].emptyCircle
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: this.getColor(accuracy)
                        },
                        emphasis: {
                            color: this.getColor(accuracy)
                        }
                    }
                }]
            }]
        };

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
