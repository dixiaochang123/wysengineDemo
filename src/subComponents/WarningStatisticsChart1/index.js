import React from 'react';
import Utils from 'utils/utils';
import User from 'utils/user';
import Constant from 'constant/index';
let THEME_MAP = Constant.THEME_MAP;

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class WarningStatisticsChart1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        // 初始化
        this.init = this.init.bind(this);
    }
    componentDidUpdate() {
        if (!this.props.ban || this.props.ban == undefined) {
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
        Utils.handleCanvasSize(this.props.id);
    }
    initChart() {
        let barClickColor1 = User.get('barClickColor1');
        let data = this.props.data;
        let interval = this.props.interval;
        let areaName = data.map(function(key) {
            return {
                value: key.name
            };
        });
        if (!!this.props.parameterCode) {
            areaName = data.map(function(key) {
                let target = this.props.parameterCode.find((item) => item.ID == key.name)
                return {
                    value: !!target ? target.NAME : ''
                };
            }.bind(this));
        }
        let color = this.props.color || [];
        let borderColor = 'transparent';
        let areaValue = data.map(function(key, index) {
            if ((!!key.AREA || !!key.PROJECT || !!key.TURBINE) && !!barClickColor1) {
                color = Array(100).fill('#6acff9');
                borderColor = Array(100).fill('transparent');
                if (key.name == barClickColor1.name) {
                    // color[index] = barClickColor1.color;
                    borderColor[index] = 'rgba(255, 255, 255, 0.3)';
                }
            }
            if (!!key.COMP_RELATED) {
                color = Array(100).fill('#3f8eef');
            }
            return {
                value: key.value,
                origin: key,
                itemStyle: {
                    normal: {
                        color: color[index],
                        borderColor: borderColor[index],
                        borderWidth: 20
                    }
                }
            };
        })
        let option = {
            color: ['#3398DB'],
            legend: {
                show: false
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                formatter: function(params) {
                    return '<span style="display:inline-block;color:white;">' + params[0].seriesName + '</span>' + '<br />' + params[0].marker + params[0].name + ' : ' + '<span style="display:inline-block;color:white;">' + params[0].value + '</span>';
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'transparent'
                    }
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            grid: {
                left: $(document.body).attr('bigscreenmicrosoft') == 'true' ? 65 : 28,
                right: $(document.body).attr('bigscreenmicrosoft') == 'true' ? 60 : 28,
                top: '15%',
                bottom: $(document.body).attr('highscreen') != 'true' ? ($(document.body).attr('bigscreenmicrosoft') != 'true' ? 20 : 50) : 30,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                // 支持触发事件
                triggerEvent: true,
                data: areaName,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}',
                    interval: interval,
                    // rotate: -30,
                    interval: 0,
                    textStyle: {
                        fontSize: Utils.zoom(12),
                        // x轴文本颜色 支持回调
                        color: function(val) {
                            let color = THEME_MAP[theme].textColor;
                            if (!!barClickColor1 && barClickColor1.name == val) {
                                color = '#3f8eef';
                            }
                            return color;

                        }
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'transparent',
                        width: Utils.zoom(2)
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: '  预警数（个）',
                nameTextStyle: {
                    fontSize: Utils.zoom(10),
                    color: THEME_MAP[theme].chartYtextColor,
                    // align: 'left',
                    width: 100,
                    padding: [0, 50]
                },
                // nameGap: 25,
                nameGap: $(document.body).attr('bigscreenmicrosoft') == 'true' ? 30 : 15,
                minInterval: 1,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: THEME_MAP[theme].chartSplitLineColor,
                        width: 1,
                        type: 'dashed'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'transparent',
                        width: Utils.zoom(2)
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: Utils.zoom(12),
                        // y轴文本颜色 支持回调
                        // color: THEME_MAP[theme].textColor
                        color: THEME_MAP[theme].chartYtextColor
                    }
                },
                axisTick: {
                    show: false
                }

            },
            series: {
                name: '预警明细',
                type: 'bar',
                barMaxWidth: Utils.zoom(17),
                data: areaValue
            }
        };

        Utils.initChart(this.props.id, option, {
            click: function(params) {
                if (!!params.data.origin.AREA || !!params.data.origin.PROJECT || !!params.data.origin.TURBINE) {
                    params.color = THEME_MAP[theme].chartBarClickColor;
                    params.data.itemStyle.normal = THEME_MAP[theme].chartBarClickColor;
                    params.event.target.style.fill = THEME_MAP[theme].chartBarClickColor;
                    User.set('barClickColor1', {
                        index: params.dataIndex,
                        color: params.color,
                        name: params.name
                    });
                }!!this.props.onAreaChange && this.props.onAreaChange(params);
                !!this.props.onComponentChange && this.props.onComponentChange(params);
            }.bind(this)
        });
    }
    render() {
        return (
            <div id={this.props.id} className={style.boxInnerFoot}></div>
        );
    }
}

module.exports = WarningStatisticsChart1;