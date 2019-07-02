import React from 'react';
import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let style = require('./' + theme + '.less');

class Heaithyfoottworight extends React.Component {
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
        Utils.handleCanvasSize('heaithyfoottworightCanvas');
    }
    initChart() {
        let chartData = this.props.healthDetail;
        let values = Object.values(chartData);
        let name = values.map((key) => key.name);
        let value = values.map((key) => parseFloat(key.value));
        let value1 = [];
        value.map((key, index) => value1[index] = 100);
        // let data = [53, 85, 60, 45, 53, 56, 49];
        let dataRatio = value.map((key) => key + '%');
        let name1 = this.props.name;
        let option = {
            grid: {
                left: '15%',
                right: '15%',
                // bottom: '3%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                axisPointer: {
                    type: 'shadow',
                    crossStyle: {
                        color: '#999'
                    }
                },
                formatter: function(params) {
                    let tooltipData = '<span style="display:inline-block;color:white;">'+params[0].axisValue+'</span>' + '<br /> ' + name1 + '：' + '<span style="display:inline-block;color:white;">'+params[1].value + '%'+'</span>' ;
                    return tooltipData;
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            xAxis: [{
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisPointer: {
                    type: 'shadow'
                }
            }],
            yAxis: [{
                type: 'category',
                data: name,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisPointer: {
                    type: 'shadow'
                },
                axisLabel: {
                    textStyle: {
                        color: THEME_MAP[theme].textColor,
                        fontSize: Utils.zoom(11)
                    }
                }
            }, {
                type: 'category',
                data: dataRatio,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: THEME_MAP[theme].textColor,
                        fontSize: Utils.zoom(11)
                    }
                }
            }],
            series: [{
                type: 'bar',
                barMaxWidth: Utils.zoom(8),
                silent: true,
                itemStyle: {
                    normal: {
                        color: THEME_MAP[theme].chartBarGapColor
                    }
                },
                barGap: '-100%',
                data: value1
            }, {
                type: 'bar',
                barMaxWidth: Utils.zoom(8),
                silent: true,
                itemStyle: {
                    normal: {
                        color: '#3f8eef'
                    }
                },
                barGap: '-100%',
                barCategoryGap: '50%',
                data: value
            }]
        };

        Utils.initChart('heaithyfoottworightCanvas', option);
    }
    render() {
        return (
            <div id='heaithyfoottworightCanvas' className={style.box}></div>
        )
    }
}

module.exports = Heaithyfoottworight;
