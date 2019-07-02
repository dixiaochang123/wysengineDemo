import React from 'react';
import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let style = require('./' + theme + '.less');

class ChartDashpowergainbar extends React.Component {
    constructor(props) {
        super(props);

        // 初始化
        this.init = this.init.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.powerGainDetail != this.props.powerGainDetail) {
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
        Utils.handleCanvasSize('powerGainCanvas');
    }
    initChart() {
        let chartData = this.props.powerGainDetail;
        let keys = Object.keys(chartData);
        let values = Object.values(chartData);

        // 同比 thisYearMtbf
        let tbEnergy = values.map((key) => parseFloat(key.tbEnergy));
        for (let i = 0; i < tbEnergy.length; i++) {
            if (isNaN(tbEnergy[i])) {
                tbEnergy[i] = 0;
            }
        }

        // 环比 lastYearMtbf
        let energy = values.map((key) => parseFloat(key.energy));
        for (let k = 0; k < energy.length; k++) {
            if (isNaN(energy[k])) {
                energy[k] = 0;
            }
        }

        //同比时间
        let tbDate = values.map((key) => (key.tbDate));

        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'axis',
                    crossStyle: {
                        color: '#999'
                    }
                },
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                formatter: function(params) {
                    
                    let tooltipData = '<span style="display:inline-block;color:white;">'+'生产率变化'+'</span>' + '<br />'
                    + params[0].marker + tbDate[params[0].dataIndex] + ' : ' + '<span style="display:inline-block;color:white;">'+params[0].data + '%'+'</span>' + '<br />'
                    + params[1].marker + params[1].name + ' : ' + '<span style="display:inline-block;color:white;">'+params[1].data + '%'+'</span>';

                    return tooltipData;
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            legend: {
                data: [{name: '同比',icon: 'circle'},{name: '环比',icon: 'circle'}],
                itemWidth: 10,
                itemHeight: 10,
                top: '3%',
                right: 80,
                itemGap: Utils.zoom(25),
                textStyle: {
                    color: THEME_MAP[theme].textColor,
                    fontSize: Utils.zoom(12)
                }
            },
            grid: {
                left: 28,
                right: 28,
                bottom: $(document.body).attr('highscreen') != 'true' ? ($(document.body).attr('bigscreenmicrosoft') != 'true' ? 20 : 70) : 30,
                top: $(document.body).attr('bigscreenmicrosoft') != 'true' ? '10%' : '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: keys,
                // 去除网格线
                splitLine: {
                    show: false
                },
                axisPointer: {
                    type: 'shadow'
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        fontSize: Utils.zoom(12),
                        // x轴文本颜色 支持回调
                        color: THEME_MAP[theme].textColor
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: THEME_MAP[theme].chartSplitLineColor,
                        width: 1,
                        type: 'dashed'
                    }
                },
                name: '  生产率变化',
                nameTextStyle: {
                    fontSize: Utils.zoom(10),
                    color: THEME_MAP[theme].chartYtextColor
                },
                nameGap: $(document.body).attr('bigscreenmicrosoft') != 'true' ? 15 : 40,
                minInterval: 1,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: Utils.zoom(10),
                        // x轴文本颜色 支持回调
                        color: THEME_MAP[theme].chartYtextColor
                    }
                },
                // 去除刻度
                axisTick: {
                    show: false
                }
            },
            series: [{
                name: '同比',
                type: 'bar',
                // 最大宽度
                barMaxWidth: Utils.zoom(16),
                itemStyle: {
                    normal: {
                        color: '#77e8f2'
                    }
                },
                data: tbEnergy
            }, {
                name: '环比',
                type: 'bar',
                //最大宽度
                barMaxWidth: Utils.zoom(16),
                barGap: 0,
                itemStyle: {
                    normal: {
                        color: '#3f8eef'
                    }
                },
                data: energy
            }]
        };
        Utils.initChart('powerGainCanvas', option);
    }
    render() {
        return (
            <div id='powerGainCanvas' className={style.box}></div>
        );
    }
}

module.exports = ChartDashpowergainbar;
