import React from 'react';
import Utils from 'utils/utils';
import User from 'utils/user';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;

class ChartAreaMachineTypeAlarm extends React.Component {
    constructor(props) {
        super(props);

        //数据初始化
        this.init = this.init.bind(this);
    }
    componentDidMount() {
        this.init();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.data != this.props.data) {
            this.init();
        }
    }
    init() {
        // 初始化echarts图表
        this.initChart();
        // 设置canvas尺寸为100%，响应页面缩放、resize(写在less中被覆盖)
        Utils.handleCanvasSize('areaAlarmMachineTypeAlarm');
    }
    initChart() {
        let barClickColor = User.get('barClickColor');
        let chartData = this.props.data;
        let colorAll = ['#35b3e8', '#3a649d', 'rgb(89, 189, 153)', '#59bd99', '#ce93d8', '#90caf9', '#f7b249', '#ff8a80', '#0070a2', '#f7b981', '#f29444', '#eb614d', '#f4ff81', '#ccff90', '#e5e757', '#cce198', '#03915b', '#1d99c8', '#f29b83', '#007dd4', '#5572b7', '#00bcd4', '#a664b0'];
        let borderColor = Array(100).fill('transparent');
        let types = chartData.map(function(item, index) {
            if (!!barClickColor && item.TURBINE_MODEL_NAME == barClickColor.name) {
                // colorAll[index] = barClickColor.color;
                borderColor[index] = 'rgba(225, 225, 225, 0.3)';
            }
            return item.TURBINE_MODEL_NAME;
        });

        let color = colorAll.slice(0, chartData.length);
        let barData = chartData.map((item, index) => {
            return {
                value: item.value,
                itemStyle: {
                    normal: {
                        color: color[index],
                        borderColor: borderColor[index],
                        borderWidth: 20
                    }
                }
            };
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
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                formatter: function(params) {
                    return '<span style="display:inline-block;color:white;">' + params[0].name + '</span>' + '<br />' + params[0].marker + params[0].seriesName + ' : ' + '<span style="display:inline-block;color:white;">' + params[0].value + '</span>';
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            grid: {
                left: Utils.zoom(28),
                right: Utils.zoom(28),
                bottom: '5%',
                top: '15%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: types,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: function(val) {
                            let color = THEME_MAP[theme].textColor;
                            if (!!barClickColor && barClickColor.name == val) {
                                color = '#3f8eef';
                            }
                            return color;

                        },
                        fontSize: Utils.zoom(12)
                    }
                },
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                name: '预警数量(个)',
                nameTextStyle: {
                    color: THEME_MAP[theme].chartYtextColor,
                    fontSize: Utils.zoom(10)
                },
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: THEME_MAP[theme].chartYtextColor,
                        fontSize: Utils.zoom(10)
                    }
                },
                axisLine: {
                    show: false
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
            }],
            series: {
                name: '预警数量',
                type: 'bar',
                barMaxWidth: Utils.zoom(18),
                data: barData
            }
        };

        option = Object.assign({}, option, Utils.fixChartOption(option));
        Utils.initChart('areaAlarmMachineTypeAlarm', option, {
            click: function(params) {
                params.color = THEME_MAP[theme].chartBarClickColor;
                params.data.itemStyle.normal = THEME_MAP[theme].chartBarClickColor;
                params.event.target.style.fill = THEME_MAP[theme].chartBarClickColor;
                User.set('barClickColor', {
                    index: params.dataIndex,
                    color: params.color,
                    name: params.name
                });
                if (params.event.cancelBubble == true) {
                    return false;
                }
                if (params.componentType == 'series') {
                    this.props.onItemClick && this.props.onItemClick(params.name);
                }
                params.event.cancelBubble = true;

            }.bind(this)
        });
    }
    render() {
        return (
            <div id='areaAlarmMachineTypeAlarm' className='full'></div>
        );
    }
}

module.exports = ChartAreaMachineTypeAlarm;