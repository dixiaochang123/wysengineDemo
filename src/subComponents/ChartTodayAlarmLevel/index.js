// 今日风机预警信息明细-预警分布柱状图组件
import React from 'react';
import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let style = require('./' + theme + '.less');

const LEVEL_MAP = {
    '1': '一级预警',
    '2': '二级预警',
    '3': '三级预警',
    '4': '四级预警',
    '5': '五级预警'
};

class ChartTodayAlarmDistribution extends React.Component {
    constructor(props) {
        super(props);

        // 初始化
        this.init = this.init.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.data) != JSON.stringify(this.props.data)) {
            this.init();
        }
    }
    componentDidMount() {
        this.init();
        Utils.handleScreenZoom(function() {
            this.init();
            Utils.handleBigScreenDomHeight();
        });
    }
    init() {
        // 初始化echarts图表
        this.initChart();
        // 设置canvas尺寸为100%，响应页面缩放、resize(写在less中被覆盖)
        Utils.handleCanvasSize(this.props.id);
    }
    initChart() {
        let isBigScreen = Utils.isBigScreen();
        let dataGroup = this.props.data;
        let dataGroupKeys = Object.keys(dataGroup);

        if (Constant.PROJECT != 'mingyang') {
            dataGroupKeys = dataGroupKeys.filter((key) => key < 4);
        }

        let dataGroupNames = dataGroupKeys.map((item) => {
            return {
                icon: 'circle',
                name: LEVEL_MAP[item] + '：' + dataGroup[item] + '个'
            };
        });
        let dataGroupCounts = dataGroupKeys.map((item) => {
            return {
                value: dataGroup[item],
                name: LEVEL_MAP[item] + '：' + dataGroup[item] + '个'
            };
        });
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return '<span style="display:inline-block;color:white;">'+params.seriesName+'</span>'+'<br />'+params.marker+params.name.substring(0,5)+ '<span style="display:inline-block;color:white;">'+params.value+'个  ('+ params.percent+'%)</span>';
                },
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            legend: {
                orient: 'vertical',
                right: !isBigScreen ? '0%' : '2%',
                top: 'middle',
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
                name: '预警数量',
                type: 'pie',
                center: ['40%', '50%'],
                radius: ['60%', '80%'],
                avoidLabelOverlap: false,
                selectedOffset: 5,
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
                            let colorList = ['#e56361', '#f29934', '#3f8eef', '#6ba5ec', '#d4e7fe'];
                            return !!params.value ? colorList[params.dataIndex] : '#ccc';
                        }
                    }
                },
                data: dataGroupCounts
            },{
                name: '预警数量',
                type: 'pie',
                center: ['40%', '50%'],
                radius: ['70%', '82%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
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

        if (!!this.props.legend) {
            option.legend = Object.assign({}, option.legend, this.props.legend);
        }

        option = Object.assign({}, option, Utils.fixChartOption(option));

        Utils.initChart(this.props.id, option);
    }
    render() {
        return (
            <div id={this.props.id} className={style.box + ' full'}></div>
        );
    }
}

module.exports = ChartTodayAlarmDistribution;
