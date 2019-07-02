// 首页-仪表盘组件
import React from 'react';

import Utils from 'utils/utils';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

import IconUp from 'images/homepage/icon_up.png';
import IconDown from 'images/homepage/icon_down.png';
import IconRemain from 'images/homepage/icon_remain.png';
import IconRemainDark from 'images/homepage/icon_remain_dark.png';

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
        outerRadius: [60, 65],
        innerRadius: [55, 60],
        labelBig: Utils.zoom(30),
        labelSmall: Utils.zoom(16)
    },
    miniscreen: {
        outerRadius: [60, 65],
        innerRadius: [55, 60],
        labelBig: Utils.zoom(30),
        labelSmall: Utils.zoom(16)
    },
    smallscreen: {
        outerRadius: [60, 65],
        innerRadius: [55, 60],
        labelBig: Utils.zoom(30),
        labelSmall: Utils.zoom(16)
    },
    mediumscreen: {
        outerRadius: [70, 75],
        innerRadius: [65, 70],
        labelBig: Utils.zoom(30),
        labelSmall: Utils.zoom(16)
    },
    highmediumscreen: {
        outerRadius: [70, 75],
        innerRadius: [65, 70],
        labelBig: Utils.zoom(30),
        labelSmall: Utils.zoom(16)
    },
    basescreen: {
        outerRadius: [70, 75],
        innerRadius: [65, 70],
        labelBig: Utils.zoom(30),
        labelSmall: Utils.zoom(16)
    },
    highscreen: {
        outerRadius: [120, 135],
        innerRadius: [110, 120],
        labelBig: Utils.zoom(50),
        labelSmall: Utils.zoom(16)
    },
    bigscreen: {
        outerRadius: [120, 135],
        innerRadius: [110, 120],
        labelBig: Utils.zoom(22),
        labelSmall: Utils.zoom(16)
    },
    bigscreenmicrosoft: {
        outerRadius: [180, 210],
        innerRadius: [160, 180],
        labelBig: Utils.zoom(22),
        labelSmall: Utils.zoom(16)
    }
};

class ChartDashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 初始化
        this.init = this.init.bind(this);
        // 初始化echarts图表
        this.initChart = this.initChart.bind(this);
        // 获取颜色
        this.getColor = this.getColor.bind(this);
        // 跳转页面
        this.jumpToPage = this.jumpToPage.bind(this);
    }
    componentDidMount() {
        this.init();
    }
    componentDidUpdate() {
        if(this.props.ban!=true) {
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
        let dashboard = this.props.dashboard;
        let value = dashboard.value;
        let emptyValue = 100 - value;

        let circleColor = this.getColor(value);
        let shadowColor = CHART_COLORS[theme].shadowColor;
        let emptyCircle = CHART_COLORS[theme].emptyCircle;

        let screenType = Utils.getScreenType();
        let labelBig = SCREEN_TYPES[screenType].labelBig;
        let labelSmall = SCREEN_TYPES[screenType].labelSmall;
        let outerRadius = SCREEN_TYPES[screenType].outerRadius;
        let innerRadius = SCREEN_TYPES[screenType].innerRadius;

        let option = {
            tooltip: {
                show: false
            },
            toolbox: {
                show: false
            },
            cursor: 'default',
            series: [{
                name: 'shadowCircle',
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
                hoverAnimation: false,
                center: ['50%', '50%'],
                data: [{
                    value: 100,
                    name: 'invisible',
                    itemStyle: {
                        normal: {
                            color: shadowColor,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        emphasis: {
                            color: shadowColor,
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
                name: 'dataCircle',
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
                hoverAnimation: false,
                center: ['50%', '50%'],
                data: [{
                    value: emptyValue,
                    name: 'invisible',
                    itemStyle: {
                        normal: {
                            color: emptyCircle,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        emphasis: {
                            color: emptyCircle,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    }
                }, {
                    value: value,
                    label: {
                        normal: {
                            formatter: value >= 0 ? '{d}%' : '暂无数据',
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: value >= 0 ? labelBig : labelSmall,
                                fontWeight: 'normal',
                                color: value >= 0 ? circleColor : emptyCircle
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: circleColor
                        },
                        emphasis: {
                            color: circleColor
                        }
                    }
                }]
            }]

        };

        Utils.initChart(dashboard.id, option);
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
    jumpToPage() {
        if (!this.props.dashboard.pagePath) {
            return false;
        }
        !!this.props.onSelect && this.props.onSelect(this.props.dashboard.pagePath);
    }
    render() {
        let dashboard = this.props.dashboard;
        let imgSrc = dashboard.growthRate != undefined && dashboard.growthRate > 0 ? IconUp : IconDown;
        if (dashboard.growthRate != undefined && dashboard.growthRate == 0) {
            imgSrc = theme == 'dark' ? IconRemainDark : IconRemain;
        }

        return (
            <div className={style.box + ' left'}>
                <div className='panel'>
                    <div className='panelHeader'>
                        <span className='panelTitle'>{dashboard.title}</span>
                        <span className='panelLink linkBtn' onClick={this.jumpToPage}></span>
                    </div>
                    <div id={dashboard.id} className={'full ' + style.canvasWrapper}></div>
                    <div className={style.trend}>
                        <img src={imgSrc} className={this.props.index == 3 ? 'none' : ''} />
                        <span>{this.props.index != 3 ? dashboard.growthRate + '%' : '未完成' + dashboard.notCompleteCount + '个'}</span>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = ChartDashboard;
