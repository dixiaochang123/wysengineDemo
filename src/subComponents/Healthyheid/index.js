import React from 'react';
import Utils from 'utils/utils';
import User from 'utils/user';
import Constant from 'constant/index';
let THEME_MAP = Constant.THEME_MAP;

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class Healthyheid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        // 初始化
        this.init = this.init.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.healthDetail != this.props.healthDetail) {
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
        Utils.handleCanvasSize('healthyheidCanvas');
    }
    initChart() {
        let barClickColor = User.get('barClickColor4');
        let chartData = this.props.healthDetail;
        let keys = Object.keys(chartData);
        let values = Object.values(chartData);
        let tbRate = values.map((key) => parseFloat(key.tbRate));
        let tooltipName = this.props.tooltipName;
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                formatter: function(params) {
                    let tooltipText = '';
                    if(tooltipName == '完结率') {
                        tooltipText = '<span style="display:inline-block;color:white;">'+params[0].name+'</span>' + '<br />' + params[0].marker + params[0].name + ' : ' + '<span style="display:inline-block;color:white;">'+params[0].value+'</span>'
                    } else {
                        tooltipText = '<span style="display:inline-block;color:white;">'+params[0].name+'</span>' + '<br />' + params[0].marker + params[0].name + ' : ' + '<span style="display:inline-block;color:white;">'+params[0].value+'%'+'</span>'
                    }
                    return tooltipText;
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: Utils.zoom(28),
                right: Utils.zoom(28),
                bottom: $(document.body).attr('highscreen') != 'true' ? ($(document.body).attr('bigscreenmicrosoft') != 'true' ? 20 : 70) : 30,
                top: $(document.body).attr('bigscreenmicrosoft') != 'true' ? '10%' : '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                splitLine: {
                    // 去除网格线
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: function(val){
                            let color = THEME_MAP[theme].textColor;
                            if(!!barClickColor && barClickColor.name == val) {
                                color = '#3f8eef';
                            }
                            return color;

                        },
                        fontSize: Utils.zoom(12)
                    }
                },
                axisTick: {
                    show: false
                },
                data: keys
            },
            yAxis: {
                type: 'value',
                name: tooltipName,
                nameTextStyle: {
                    color: THEME_MAP[theme].chartYtextColor,
                    fontSize: Utils.zoom(10),
                    align: 'left'
                },
                nameGap: $(document.body).attr('bigscreenmicrosoft') != 'true' ? 15 : 40,
                minInterval: 1,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: THEME_MAP[theme].chartSplitLineColor,
                        width: 1,
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    formatter: function() {
                        return '';
                    }
                },
                axisPointer: {
                    snap: true
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: THEME_MAP[theme].chartYtextColor
                    },
                    fontSize: Utils.zoom(10)
                },
                axisTick: {
                    show: false
                }
            },
            series: [{
                //'总体健康度' z总完结率
                name: tooltipName,
                type: 'line',
                smooth: false,
                data: tbRate,
                symbol: 'emptyCircle',
                symbolSize: Utils.zoom(5),
                hoverAnimation: true,
                itemStyle: {
                    normal: {
                        color: '#8dcd43',
                        width: Utils.zoom(1)
                    }
                }
            }]
        };

        option = Object.assign({}, option, Utils.fixChartOption(option));
        if ($(document.body).attr('miniscreen') == 'true') {
            option.grid = Object.assign({}, option.grid, {
                top: '15%',
                bottom: '8%'
            });
        }

        Utils.initChart('healthyheidCanvas', option, {
            click: function(params) {
                if (params.event.cancelBubble == true) {
                    return false;
                }
                !!this.props.onHealthChange && this.props.onHealthChange(params);

                params.color = THEME_MAP[theme].chartBarClickColor;
                params.event.target.style.fill = THEME_MAP[theme].chartBarClickColor;
                User.set('barClickColor4', {index: params.dataIndex, color: params.color, name: params.name});

                params.event.cancelBubble = true;
            }.bind(this)
        });
    }
    render() {
        return (
            <div className={style.boxMax}>
                <div id='healthyheidCanvas' className={style.box}></div>
            </div>
        );
    }
}

module.exports = Healthyheid;
