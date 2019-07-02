import React from 'react';

import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;

let SHADOW_COLOR = {
    dark: '#1b2036',
    light: '#f8f8f8'
};

class ChartStateDistributionModel extends React.Component {
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
        Utils.handleCanvasSize('stateDistributionModel');
    }
    initChart() {
        let chartData = this.props.data;

        let legendData = !!chartData ? chartData.map((item) => {
            return {
                name: item.STATUS_NAME + '：' + item.value,
                icon: 'circle',
                textStyle: {
                    color: item.value != 0 ? THEME_MAP[theme].textColor : THEME_MAP[theme].emptyColor,
                    fontSize: Utils.zoom(12)
                }
            };
        }) : [];

        let seriesData = !!chartData ? chartData.map((item) => {
            return {
                name: item.STATUS_NAME + '：' + item.value,
                value: item.value,
                itemStyle: {
                    normal: {
                        color: item.value != 0 ? Constant.STATUS_COLOR_MAP[item.STATUS_NAME] : THEME_MAP[theme].emptyColor
                    }
                }
            };
        }) : [];

        let option = {
            tooltip: {
                trigger: 'item',
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                formatter: function(params) {
                    return '<span style="display: inline-block; color: white;">' + params.name.substring(0, 3) + '</span><br />' + params.marker + params.name.substring(0, 4) + '<span style="display: inline-block; color: white;">' + params.name.substring(4) + '  (' + params.percent + '%)</span>';
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            legend: {
                name: '预警状态',
                orient: 'vertical',
                top: 'middle',
                right: '5%',
                data: legendData,
                itemWidth: Utils.zoom(5),
                itemHeight: Utils.zoom(5)
            },
            series: [{
                type: 'pie',
                hoverAnimation: false,
                z: 1,
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
                    show: false
                },
                radius: ['55%', '80%'],
                center: ['50%', '50%'],
                data: [{
                    value: 1,
                    itemStyle: {
                        normal: {
                            color: SHADOW_COLOR[theme]
                        },
                        emphasis: {
                            color: SHADOW_COLOR[theme]
                        }
                    }
                }]
            }, {
                name: '预警状态',
                type: 'pie',
                z: 2,
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
                radius: ['55%', '70%'],
                center: ['50%', '50%'],
                data: seriesData
            }]
        };

        if (!!this.props.legend) {
            option.legend = Object.assign(option.legend, this.props.legend);
        }
        if (!!this.props.legendRight) {
            option.legend.right = this.props.legendRight;
        }
        if (!!this.props.center) {
            option.series[0].center = this.props.center;
            option.series[1].center = this.props.center;
        }

        option = Object.assign({}, option, Utils.fixChartOption(option));
        Utils.initChart('stateDistributionModel', option);
    }
    render() {
        return (
            <div id='stateDistributionModel' className='full'></div>
        );
    }
}

module.exports = ChartStateDistributionModel;
