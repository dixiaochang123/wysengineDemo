import React from 'react';
import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;

const LEGEND_MAP = {
    PPSD: {
        yAxisIndex: 0,
        name: '功率特性偏离',
        unit: ''
    },
    PCC: {
        yAxisIndex: 1,
        name: '功率曲线符合性',
        unit: '%'
    },
    TBA: {
        yAxisIndex: 1,
        name: '时间可利用率',
        unit: '%'
    },
    PBA: {
        yAxisIndex: 1,
        name: '发电量可利用率',
        unit: '%'
    },
    MTBI: {
        yAxisIndex: 0,
        name: '平均检修间隔时间',
        unit: '小时'
    },
    MTTR: {
        yAxisIndex: 0,
        name: '平均故障修复时间',
        unit: '小时'
    },
    MTBF: {
        yAxisIndex: 0,
        name: '平均无故障运行时间',
        unit: '小时'
    },
    FTAF: {
        yAxisIndex: 0,
        name: '平均故障频次',
        unit: '次'
    },
    MTOTF: {
        yAxisIndex: 0,
        name: '平均机组故障总耗时',
        unit: '小时'
    }
};

class ChartKPITendency extends React.Component {
    constructor(props) {
        super(props);

        // 初始化
        this.init = this.init.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.data != this.props.data) {
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
        Utils.handleCanvasSize('kpiTendency');
    }
    initChart() {
        let chartData = this.props.data;
        let legends = Object.keys(chartData).map((legend) => LEGEND_MAP[legend].name);
        let months = [];

        let seriesData = Object.keys(chartData).map((legend,index) => {
            let sortData = chartData[legend].reverse();
            let colorAll = ['#898276', '#8fd5fd', '#3186b2', '#8ff5ff', '#9d7b82', '#7d88dd', '#0fc9e7',  '#61a5f9', '#a1d9ff', '#549ffc','#898276', '#8fd5fd', '#3186b2', '#8ff5ff', '#9d7b82', '#7d88dd', '#0fc9e7',  '#61a5f9', '#a1d9ff', '#549ffc'];
            let color = colorAll.slice(0, sortData.length)
            let seriesItemData = sortData.map((item) => {
                return {
                    name: item.name,
                    value: item.value
                };
            });
            if (months.length == 0) {
                months = [].concat(sortData.map((item) => item.name));
            }
            return {
                type: 'line',
                name: LEGEND_MAP[legend].name,
                lineStyle: {
                    normal: {
                        width: Utils.zoom(2)
                    }
                },
                symbolSize: Utils.zoom(4),
                data: seriesItemData,
                yAxisIndex: LEGEND_MAP[legend].yAxisIndex,
                lineStyle: {
                    normal: {
                        color:color[index]
                    }
                },
                itemStyle: {
                    normal: {
                        color:color[index]
                    }
                }
            };
        });

        let option = {
            tooltip: {
                trigger: 'axis',
                // formatter: formatter,
                formatter: function(params) {
                    let time = '<span style="display:inline-block;color:white;">'+params[0].name+'</span>';
                    return time+'<br />'+params.map(function(item,index) {
                        let spans = '<span style="display:inline-block;margin-right:3px;margin-left:3px;border-radius:10px;width:9px;height:9px;background-color:' + params[index].color + ';"></span>'
                        let unit = '小时';
                        if(item.seriesName=='功率特性偏离') {
                            unit ='';
                        } else if(item.seriesName=='功率曲线符合性'){
                            unit ='%';
                        } else if(item.seriesName=='时间可利用率'){
                            unit ='%';
                        } else if(item.seriesName=='发电量可利用率'){
                            unit ='%';
                        } else if(item.seriesName=='平均故障频次'){
                            unit ='次';
                        } else {
                            unit = '小时';
                        }
                        // let paramsValue =spans + item.seriesName+item.value+unit;
                        let paramsValue =spans + item.seriesName+' <span style="display:inline-block;color:white;">'+item.value+unit+'&nbsp;&nbsp;'+'</span>';
                        if(index%(parseInt(params.length/3))==0 && index!=0) {
                            paramsValue += '<br />';
                        }
                        return paramsValue
                    }).join('   ')
                },
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                // 坐标轴指示器，坐标轴触发有效
                axisPointer: {
                    // 默认为直线，可选为：'line' | 'shadow' | 'cross'
                    type: 'line'
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            legend: {
                data: legends,
                // orient: 'vertical',
                itemWidth: Utils.zoom(10),
                itemHeight: Utils.zoom(8),
                top: '5%',
                right: Utils.zoom(80),
                itemGap: Utils.zoom(25),
                textStyle: {
                    color: THEME_MAP[theme].textColor,
                    fontSize: Utils.zoom(12)
                }
            },
            grid: {
                top: '25%',
                bottom: '15%',
                left: Utils.zoom(60),
                right: Utils.zoom(50)
            },
            xAxis: [{
                type: 'category',
                axisLine: {
                    show: false
                },
                data: months,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: THEME_MAP[theme].textColor,
                        fontSize: Utils.zoom(12)
                    }
                },
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                nameTextStyle: {
                    color: THEME_MAP[theme].chartYtextColor
                },
                position: 'left',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: THEME_MAP[theme].chartYtextColor,
                        fontSize: Utils.zoom(10)
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: THEME_MAP[theme].chartSplitLineColor,
                        width: 1,
                        type: 'dashed'
                    }
                }
            }, {
                type: 'value',
                nameTextStyle: {
                    color: THEME_MAP[theme].chartYtextColor
                },
                position: 'right',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}%',
                    textStyle: {
                        color: THEME_MAP[theme].chartYtextColor,
                        fontSize: Utils.zoom(10)
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            series: seriesData
        };

        option = Object.assign({}, option, Utils.fixChartOption(option));
        if ($(document.body).attr('bigscreenmicrosoft') == 'true') {
            option.grid = Object.assign({}, option.grid, {
                top: '10%',
                bottom: '15%',
                left: '3%',
                right: '3%'
            });
            option.legend = Object.assign({}, option.legend, {
                itemGap: Utils.zoom(2),
                textStyle: {
                    color: THEME_MAP[theme].textColor,
                    fontSize: Utils.zoom(10)
                }
            });
        }

        if ($(document.body).attr('miniscreen') == 'true') {
            option.grid = Object.assign({}, option.grid, {
                top: '25%',
                bottom: '20%',
                left: '5%',
                right: '5%'
            });
        }

        Utils.initChart('kpiTendency', option);
    }
    render() {
        return (
            <div id='kpiTendency' className='full'></div>
        );
    }
}

module.exports = ChartKPITendency;
