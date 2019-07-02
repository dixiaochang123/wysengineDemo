// 今日风机预警信息明细-预警分布柱状图组件
import React from 'react';
import Utils from 'utils/utils';
import User from 'utils/user';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let style = require('./' + theme + '.less');

class ChartTodayAlarmDistribution extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 数据初始化
        this.init = this.init.bind(this);
    }
    componentDidMount() {
        this.init();
    }
    componentDidUpdate() {
        this.init();
    }
    init() {
        // 初始化echarts图表
        this.initChart();
        // 设置canvas尺寸为100%，响应页面缩放、resize(写在less中被覆盖)
        Utils.handleCanvasSize(this.props.id);
    }
    initChart() {
        let barClickColor = User.get('barClickColor2');
        let dataGroup = this.props.data;
        let xAxisData = dataGroup.map((item) => {
            return {
                value: item.name
            };
        });
        let color = this.props.color || [];
        let borderColor = 'transparent';
        let dataGroupCounts = dataGroup.map((item, index) => {
            if(!!item.id) {
                color = Array(100).fill('#6acff9');
                borderColor = Array(100).fill('transparent');
                if(!!barClickColor && item.name==barClickColor.name) {
                    // color[index] = barClickColor.color;
                    borderColor[index] = 'rgba(255, 255, 255, 0.3)';
                }
            } else {
                color = Array(100).fill('#3f8eef');
            }
            return {
                value: item.count,
                code: item.id,
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
                // 坐标轴指示器，坐标轴触发有效
                axisPointer: {
                    // 默认为直线，可选为：'line' | 'shadow'
                    type: 'shadow'
                },
                formatter: function(params) {
                    return '<span style="display:inline-block;color:white;">'+params[0].seriesName+'</span>'+'<br />'+params[0].marker+params[0].name+ ' : ' +'<span style="display:inline-block;color:white;">'+params[0].value+'</span>';
                },
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
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            grid: {
                left: Utils.zoom(28),
                right: Utils.zoom(28),
                top: '15%',
                bottom: $(document.body).attr('highscreen') != 'true' ? ($(document.body).attr('bigscreenmicrosoft') != 'true' ? 20 : 50) : 30,
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: xAxisData,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}',
                    // rotate: -30,
                    interval: 0,
                    textStyle: {
                        fontSize: Utils.zoom(12),
                         // x轴文本颜色 支持回调
                        color: function(val){
                            let color = THEME_MAP[theme].textColor;
                            if(!!barClickColor && barClickColor.name == val) {
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
            }],
            yAxis: {
                name: '预警数量(个)',
                nameTextStyle: {
                    fontSize: Utils.zoom(10),
                    color: THEME_MAP[theme].chartYtextColor,
                    // align: 'left',
                    width: 100,
                    padding: [0,50]
                },
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
            series: [{
                name: '预警数量',
                type: 'bar',
                barMaxWidth: Utils.zoom(17),
                data: dataGroupCounts
            }]
        };

        option = Object.assign({}, option, Utils.fixChartOption(option));
        if ($(document.body).attr('bigscreenmicrosoft') == 'true') {
            option.grid = Object.assign({}, option.grid, {
                bottom: '0%'
            });
        }

        Utils.initChart(this.props.id, option, {
            click: function(params) {
                if (params.event.cancelBubble == true) {
                    return false;
                }
                if (params.componentType == 'series') {
                    this.props.onItemClick && this.props.onItemClick(params.data.code);
                }
                if(!!params.data.code) {
                    params.color = THEME_MAP[theme].chartBarClickColor;
                    params.data.itemStyle.normal = THEME_MAP[theme].chartBarClickColor;
                    params.event.target.style.fill = THEME_MAP[theme].chartBarClickColor;
                    User.set('barClickColor2', {index: params.dataIndex, color: params.color, name: params.name});
                }
                params.event.cancelBubble = true;
            }.bind(this)
        });
    }
    render() {
        return (
            <div id={this.props.id} className={style.box + ' full'}></div>
        );
    }
}

module.exports = ChartTodayAlarmDistribution;
