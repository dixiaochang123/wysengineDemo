import React from 'react';

import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;

class ChartWholeYearAlarm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 数据初始化
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
        Utils.handleCanvasSize('wholeYearAlarm');
    }
    initChart() {
        let chartData = this.props.data;
        let months = Object.keys(chartData).reverse();

        let barData = months.map((item) => {
            //新接口
            let values = !!chartData[item] ? chartData[item] : [];
            let datas = values.map(function(key,index) {
                if(key.TURBINE_MODEL_NAME == 'MY1.5') {
                    return chartData[item][index];
                }
            })
            return {
                // value: chartData[item] || 0,
                //新接口数据
                value: !!datas[0] && !!datas[0].value ? datas[0].value : 0,
                itemStyle: {
                    normal: {
                        color: '#35b3e8'
                    }
                }
            };
        });
        let barData1 = months.map((item) => {
            let values = !!chartData[item] ? chartData[item] : [];
            let datas = values.map(function(key,index) {
                if(key.TURBINE_MODEL_NAME == 'MY2.0') {
                    return chartData[item][index];
                }
            })
            return {
                value: !!datas[1] && !!datas[1].value ? datas[1].value : 0,
                itemStyle: {
                    normal: {
                        color: '#3a649d'
                    }
                }
            };
        });
        let barData2 = months.map((item) => {
            let values = !!chartData[item] ? chartData[item] : [];
            let datas = values.map(function(key,index) {
                if(key.TURBINE_MODEL_NAME == 'MySE3.0') {
                    return chartData[item][index];
                }
            })
            return {
                value: !!datas[2] && !!datas[2].value ? datas[2].value : 0,
                itemStyle: {
                    normal: {
                        color: '#59bd99'
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
                    return '<span style="display:inline-block;color:white;">'+params[0].name+'</span>'+'<br />'
                    +params[2].marker+params[2].seriesName+ ' : ' +'<span style="display:inline-block;color:white;">'+params[2].value+'</span>'+'<br />'
                    +params[1].marker+params[1].seriesName+ ' : ' +'<span style="display:inline-block;color:white;">'+params[1].value+'</span>'+'<br />'
                    +params[0].marker+params[0].seriesName+ ' : ' +'<span style="display:inline-block;color:white;">'+params[0].value+'</span>';
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
            color: ['#35b3e8','#3a649d','#59bd99'].reverse(),
            legend: {
                top: '2%',
                right: '2%',
                data: [{
                    name: 'MYSE3.0',
                    icon: 'circle',
                    textStyle: {
                        color: THEME_MAP[theme].textColor,
                        fontSize: Utils.zoom(12)
                    }
                }, {
                    name: 'MY2.0',
                    icon: 'circle',
                    textStyle: {
                        color: THEME_MAP[theme].textColor,
                        fontSize: Utils.zoom(12)
                    }
                }, {
                    name: 'MY1.5',
                    icon: 'circle',
                    textStyle: {
                        color: THEME_MAP[theme].textColor,
                        fontSize: Utils.zoom(12)
                    }
                }],
                itemWidth: Utils.zoom(8)
                // itemHeight: Utils.zoom(8),
            },
            xAxis: [{
                type: 'category',
                data: months,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color:  THEME_MAP[theme].textColor,
                        fontSize: Utils.zoom(12)
                    }
                },
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                name: '预警数量(个)',
                nameTextStyle: {
                    color:  THEME_MAP[theme].chartYtextColor,
                    fontSize: Utils.zoom(10)
                },
                axisLabel: {
                    textStyle: {
                        color:  THEME_MAP[theme].chartYtextColor,
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
            series: [{
                name: 'MYSE3.0',
                type: 'bar',
                stack: '预警数量',
                barMaxWidth: Utils.zoom(18),
                data: barData2
            }, {
                name: 'MY2.0',
                type: 'bar',
                stack: '预警数量',
                barMaxWidth: Utils.zoom(18),
                data: barData1
            }, {
                name: 'MY1.5',
                type: 'bar',
                stack: '预警数量',
                barMaxWidth: Utils.zoom(18),
                data: barData
            }]
        };

        option = Object.assign({}, option, Utils.fixChartOption(option));
        Utils.initChart('wholeYearAlarm', option);
    }
    render() {
        return (
            <div id='wholeYearAlarm' className='full'></div>
        );
    }
}

module.exports = ChartWholeYearAlarm;
