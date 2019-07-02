import React from 'react';

import User from 'utils/user';
import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let style = require('./' + theme + '.less');

class Heaithyfoottwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        // 数据初始化
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
        this.initChart();
        // 设置canvas尺寸为100%，响应页面缩放、resize(写在less中被覆盖)
        Utils.handleCanvasSize('heaithyfoottwoCanvas');
    }
    initChart() {
        let barClickColor = User.get('barClickColor6');
        let chartData = this.props.healthDetail;
        let keys = Object.keys(chartData);
        let values = Object.values(chartData);

        // 同比
        let valueCode = values.map(function(key) {
            return Utils.isEmpty(key.value) ? 0 : parseFloat(key.value)
            // if(key.value=='' || key.value== undefined) {
            //     key.value=0
            // }
            // return (
            //     parseFloat(key.value)
            // );
        });
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
                    return '<span style="display: inline-block; color: white;">' +
                        params[0].name + '</span><br />' +
                        params[0].marker + params[0].name +
                        ' : <span style="display: inline-block; color: white;">' + params[0].value + '%</span>';
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
                axisTick: {
                    show: false
                },
                data: keys.reverse()
            },
            yAxis: {
                type: 'value',
                name: tooltipName,
                nameTextStyle: {
                    color: THEME_MAP[theme].chartYtextColor,
                    fontSize: Utils.zoom(12),
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
                name: tooltipName,
                type: 'line',
                smooth: false,
                data: valueCode.reverse(),
                symbol: 'emptyCircle',
                symbolSize: Utils.zoom(5),
                hoverAnimation: true,
                itemStyle :  {
                    normal :  {
                        color: '#408ef0',
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

        Utils.initChart('heaithyfoottwoCanvas', option, {
            click: function(params) {
                if (params.event.cancelBubble == true) {
                    return false;
                }

                !!this.props.onHealthChange && this.props.onHealthChange(params);

                params.color = THEME_MAP[theme].chartBarClickColor;
                params.event.target.style.fill = THEME_MAP[theme].chartBarClickColor;
                User.set('barClickColor6', {
                    index: params.dataIndex,
                    color: params.color,
                    name: params.name
                });

                params.event.cancelBubble = true;
            }.bind(this)
        });
    }
    render() {
        return (
            <div id='heaithyfoottwoCanvas' className={style.box}></div>
        )
    }
}

module.exports = Heaithyfoottwo;
