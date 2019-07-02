// 今日风机预警信息明细-预警分布柱状图组件
import React from 'react';
import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let style = require('./' + theme + '.less');

class ChartWarningStatisticsLevel extends React.Component {
    constructor(props) {
        super(props);

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
        let data = [].concat(this.props.data);

        let data2 = [].concat(data).map((item) => {
            if (item.name == 1) {
                item.name = '一级'
            }
            if (item.name == 2) {
                item.name = '二级'
            }
            if (item.name == 3) {
                item.name = '三级'
            }
            if (item.name == 4) {
                item.name = '四级'
            }
            if (item.name == 5) {
                item.name = '五级'
            }
            return {
                name: item.name + '预警 ：'+item.value+'个',
                value: item.value
            };
        });
        let dataValue = [].concat(data2).map((item) => {
            return {
                name: item.name,
                value: item.value
            };
        });
        let dataGroupNames = [].concat(data2).map((item) => {
            return {
                icon: 'circle',
                name: item.name
            };
        });
        let option = {
            tooltip: {
                trigger: 'item',
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                // formatter: '{a} <br/>{b}: {d}%',
                formatter: function(params) {
                    return '<span style="display:inline-block;color:white;">'+params.seriesName+'</span>'+'<br />'+params.marker+params.name.slice(0,4)+ ' : <span style="display:inline-block;color:white;">'+params.value+'个   ('+params.percent+'%)'+'</span>' ;
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            legend: {
                orient: 'vertical',
                right: Utils.zoom(10),
                bottom: Utils.zoom(38),
                align: 'left',
                itemWidth: Utils.zoom(5),
                itemHeight: Utils.zoom(5),
                data: dataGroupNames,
                textStyle: {
                    lineHeight: Utils.zoom(24),
                    fontSize: Utils.zoom(11),
                    color: THEME_MAP[theme].textColor
                }
            },
            series: [{
                name: '预警等级',
                type: 'pie',
                center: !!Utils.isMiniScreen ? ['45%', '50%'] : ['50%', '50%'],
                radius: ['43%', '56%'],
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: Utils.zoom(18),
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: function(params) {
                            let colorList = ['#e56361', '#f29934', '#3f8eef', '#6ba5ec', '#b0d4ff'];
                            return !!params.value ? colorList[params.dataIndex] : '#ccc';
                        }
                    }
                },
                data: dataValue
            },{
                type: 'pie',
                center: !!Utils.isMiniScreen ? ['45%', '50%'] : ['50%', '50%'],
                radius: ['55%', '63%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: Utils.zoom(18),
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: THEME_MAP[theme].chartLevelColor
                    }
                },
                tooltip: {
                    show:false
                },
                silent: true,
                data: [100]
            }]

        };

        Utils.initChart(this.props.id, option);
    }
    render() {
        return (
            <div id={this.props.id} className={style.box}></div>
        );
    }
}

module.exports = ChartWarningStatisticsLevel;
