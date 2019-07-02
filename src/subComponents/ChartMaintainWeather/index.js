// 预警明细-维护窗口天气图
import React from 'react';
import Moment from 'moment';
import Utils from 'utils/utils';
import Constant from 'constant/index';

// 晴
import IconFanQing from 'images/warninginfordetails/icon_q.png';
// 多云
import IconFanDuoyun from 'images/warninginfordetails/icon_duoyun.png';
// 阴
import IconFanYin from 'images/warninginfordetails/icon_yin.png';
// 中雨
import IconFanZhongYu from 'images/warninginfordetails/icon_zhongyu.png';
// 大雪
import IconFanDaxue from 'images/warninginfordetails/icon_daxue.png';
// 大雪
import IconFanWu from 'images/warninginfordetails/icon_wu.png';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let style = require('./' + theme + '.less');

const WEATHER_MAP = {
    PARTLY_CLOUDY_DAY: {
        weather: '多云',
        icon: IconFanDuoyun
    },
    PARTLY_CLOUDY_NIGHT: {
        weather: '多云',
        icon: IconFanDuoyun
    },
    CLEAR_DAY: {
        weather: '晴天',
        icon: IconFanQing
    },
    CLEAR_NIGHT: {
        weather: '晴夜',
        icon: IconFanQing
    },
    WIND: {
        weather: '晴天',
        icon: IconFanQing
    },
    CLOUDY: {
        weather: '阴',
        icon: IconFanYin
    },
    RAIN: {
        weather: '中雨',
        icon: IconFanZhongYu
    },
    SNOW: {
        weather: '雪',
        icon: IconFanDaxue
    },
    FOG: {
        weather: '雾',
        icon: IconFanWu
    }
};

class ChartMaintainWeather extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 初始化
        this.init = this.init.bind(this);
    }
    componentDidMount() {
        this.init();
    }
    componentDidUpdate() {
        this.init();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.currTab != 'win' && nextProps.currTab == 'win') {
            this.init();
        }
    }
    init() {
        // 初始化echarts图表
        this.initChart();
        // 设置canvas尺寸为100%，响应页面缩放、resize(写在less中被覆盖)
        Utils.handleCanvasSize(this.props.id);
    }
    initChart() {
        let hourlyForecastList = this.props.hourlyForecastList || [];

        let xAxisData = hourlyForecastList.length > 0 ? hourlyForecastList.map((item) => Moment(item.DATETIME, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')) : [];

        let seriesLineData = [];
        if (hourlyForecastList.length > 0) {
            hourlyForecastList.forEach((item, index) => {
                seriesLineData[index] = {
                    value: parseInt(item.TEMPERATURE),
                    name: WEATHER_MAP[item.SKYCON].weather,
                    symbol: 'image://' + WEATHER_MAP[item.SKYCON].icon,
                    showAllSymbol: true,
                    symbolSize: [Utils.zoom(20), Utils.zoom(20)],
                    symbolOffset: [0, Utils.zoom(-40)]
                };
            });
        }

        let seriesBarData = hourlyForecastList.length > 0 ? hourlyForecastList.map((item) => parseInt(item.TEMPERATURE)) : [];
        let sortSeriesBarData = seriesBarData.slice(0);
        sortSeriesBarData.sort((a, b) => a - b);

        let option = {
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    return '天气：' + '<span style="display:inline-block;color:white;">'+params[0].data.name+'</span>' + '<br />'
                    + '温度：' + '<span style="display:inline-block;color:white;">'+params[0].value+' °C'+'</span>' + '<br/>时间：'
                    + '<span style="display:inline-block;color:white;">'+hourlyForecastList[params[0].dataIndex].DATETIME+'</span>';
                },
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            grid: {
                top: $(document.body).attr('highscreen') != 'true' ? ($(document.body).attr('bigscreenmicrosoft') != 'true' ? 60 : 190) : 130,
                bottom: '20%',
                left: 0,
                right: '1%',
                containLabel: true
            },
            textStyle: {
                fontSize: Utils.zoom(12)
            },
            calculable: true,
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle: {
                        width: Utils.zoom(1),
                        type: 'dashed',
                        color: THEME_MAP[theme].splitLineColor
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: $(document.body).attr('bigscreenmicrosoft') != 'true' ? true : false,
                    rotate: -30,
                    interval: 0,
                    textStyle: {
                        fontSize: Utils.zoom(12),
                        color: THEME_MAP[theme].textColor
                    }
                }
            },
            yAxis: [{
                type: 'value',
                name: '天气',
                nameGap: $(document.body).attr('bigscreenmicrosoft') != 'true' ? 20 : 40,
                nameLocation: 'end',
                nameTextStyle: {
                    align: 'left',
                    color: THEME_MAP[theme].labelColor,
                    fontSize: Utils.zoom(10)
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    margin: -8,
                    formatter: '{value}°C',
                    textStyle: {
                        color: THEME_MAP[theme].labelColor,
                        fontSize: Utils.zoom(10)
                    }
                },
                axisTick: {
                    show: false
                },
                min: sortSeriesBarData[0],
                scale: false,
                splitLine: {
                    show: true,
                    lineStyle: {
                        width: Utils.zoom(1),
                        type: 'dashed',
                        color: THEME_MAP[theme].splitLineColor
                    }
                }
            }],
            series: [{
                type: 'line',
                itemStyle: {
                    normal: {
                        color: 'transparent'
                    }
                },
                hoverAnimation: false,
                data: seriesLineData
            }, {
                type: 'bar',
                barWidth: Utils.zoom(1),
                itemStyle: {
                    normal: {
                        color: THEME_MAP[theme].splitLineColor,
                        barBorderColor: THEME_MAP[theme].splitLineColor,
                        barBorderWidth: Utils.zoom(1),
                        barBorderRadius: 0,
                        borderType: 'dashed'
                    }
                },
                label: {
                    normal: {
                        show: true,
                        formatter: '{c}',
                        position: 'top',
                        textStyle: {
                            color: '#fff',
                            fontSize: Utils.zoom(14)
                        }
                    }
                },
                data: seriesBarData
            }]
        };

        Utils.initChart(this.props.id, option, {});
    }
    render() {
        return (
            <div id={this.props.id} className={style.box}></div>
        );
    }
}

module.exports = ChartMaintainWeather;
