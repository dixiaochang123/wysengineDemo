import React from 'react';
import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let style = require('./' + theme + '.less');

class ChartMachineAlarmLevel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

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
        Utils.handleCanvasSize('machineAlarmLevel');
    }
    initChart() {
        let isLevelCount = this.props.isLevelCount;
        let chartData = this.props.data;
        let legendData = chartData.map((item) => {
            if(!isLevelCount) {
                if(item.TURBINE_MODEL==91) {
                    item.LEVEL_NAME = '1.5机型'
                }
                if(item.TURBINE_MODEL==92) {
                    item.LEVEL_NAME = '2.0机型'
                }
                if(item.TURBINE_MODEL==93) {
                    item.LEVEL_NAME = '3.0机型'
                }
                
            }
            
            return {
                icon: 'circle',
                name: item.LEVEL_NAME + '预警：' + item.value + '个',
                textStyle: {
                    color: item.value != 0 ? THEME_MAP[theme].textColor : '#ccc',
                    fontSize: Utils.zoom(11)
                }
            };
        });
        legendData.unshift({
            icon: 'circle',
            name: '预警总数：' + (this.props.dataTotal || 0) + '个',
            textStyle: {
                color: this.props.dataTotal != 0 ? THEME_MAP[theme].textColor : '#ccc',
                fontSize: Utils.zoom(11)
            }
        });

        let seriesData = chartData.map((item) => {
            return {
                value: item.value,
                name: item.LEVEL_NAME + '预警：' + item.value + '个'
            };
        });
        seriesData.unshift({
            value: 0,
            name: '预警总数：' + this.props.dataTotal + '个'
        });
        let option = {
            tooltip: {
                trigger: 'item',
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                formatter: function(params) {
                    return '<span style="display:inline-block;color:white;">'+params.seriesName+'</span>'+'<br />'+params.marker+params.name.substring(0,5) + '  <span style="display:inline-block;color:white;">'+params.value+'个  ('+ params.percent+'%)</span>';
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            legend: {
                orient: 'vertical',
                right: !!Utils.isMiniScreen ? 0 : 20,
                bottom: 48,
                align: 'left',
                itemWidth: Utils.zoom(5),
                itemHeight: Utils.zoom(5),
                data: legendData
            },
            series: [{
                name: '预警数量',
                type: 'pie',
                center: ['43%', '53%'],
                radius: ['45%', '53%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: Utils.zoom(20),
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
                            let colorList = ['#e56361','#e56361', '#f29934', '#6ba5ec', '#82b4f1', '#a1c6f3'];
                            if(!isLevelCount) {
                                colorList = ['#35b3e8','#35b3e8','#3a649d', '#59bd99'];
                            }
                            return params.value != 0 ? colorList[params.dataIndex] : '#ccc';
                        }
                    }
                },
                data: seriesData
            },{
                type: 'pie',
                center: ['43%', '53%'],
                radius: ['53%', '61%'],
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

        option = Object.assign({}, option, Utils.fixChartOption(option));
        Utils.initChart('machineAlarmLevel', option);
    }
    render() {
        return (
            <div id='machineAlarmLevel' className={style.box + ' full'}></div>
        );
    }
}

module.exports = ChartMachineAlarmLevel;
