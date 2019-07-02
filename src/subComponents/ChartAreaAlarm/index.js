// 首页-区域预警图组件
import React from 'react';

import User from 'utils/user';
import Utils from 'utils/utils';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let style = require('./' + theme + '.less');

const TURBINE_TYPE_COLOR_MAP = {
    '1.5MW': '#35b3e8',
    '2.0MW': '#3a649d',
    '3.0MW': '#59bd99',
    'MY1.5': '#35b3e8',
    'MY2.0': '#3a649d',
    'MySE3.0': '#59bd99'
};

const SCREEN_TYPES = {
    ipad: {
        line: Utils.zoom(1),
        barMaxWidth: Utils.zoom(18),
        labelFontSize: Utils.zoom(10),
        textFontSize: Utils.zoom(12)
    },
    miniscreen: {
        line: Utils.zoom(1),
        barMaxWidth: Utils.zoom(18),
        labelFontSize: Utils.zoom(10),
        textFontSize: Utils.zoom(12)
    },
    smallscreen: {
        line: Utils.zoom(1),
        barMaxWidth: Utils.zoom(18),
        labelFontSize: Utils.zoom(10),
        textFontSize: Utils.zoom(12)
    },
    mediumscreen: {
        line: Utils.zoom(1),
        barMaxWidth: Utils.zoom(18),
        labelFontSize: Utils.zoom(10),
        textFontSize: Utils.zoom(12)
    },
    highmediumscreen: {
        line: Utils.zoom(1),
        barMaxWidth: Utils.zoom(18),
        labelFontSize: Utils.zoom(10),
        textFontSize: Utils.zoom(12)
    },
    basescreen: {
        line: Utils.zoom(1),
        barMaxWidth: Utils.zoom(18),
        labelFontSize: Utils.zoom(10),
        textFontSize: Utils.zoom(12)
    },
    highscreen: {
        line: Utils.zoom(2),
        barMaxWidth: Utils.zoom(18),
        labelFontSize: Utils.zoom(20),
        textFontSize: Utils.zoom(24)
    },
    bigscreen: {
        line: Utils.zoom(2),
        barMaxWidth: Utils.zoom(18),
        labelFontSize: Utils.zoom(10),
        textFontSize: Utils.zoom(12)
    },
    bigscreenmicrosoft: {
        line: Utils.zoom(1),
        barMaxWidth: Utils.zoom(18),
        labelFontSize: Utils.zoom(10),
        textFontSize: Utils.zoom(12)
    }
};

class ChartAreaAlarm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 风机机型
            turbineTypes: [],
            // 隐藏的机型
            hiddenTypes: []
        };

        // 数据初始化
        this.init = this.init.bind(this);
        // 更多点击回调
        this.onMore = this.onMore.bind(this);
        // 处理机型变化
        this.handleTypeChange = this.handleTypeChange.bind(this);
        // 显示、隐藏图例
        this.toggleHiddenTypes = this.toggleHiddenTypes.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (Utils.isEmpty(this.props.data)) {
            $('.' + style.box + ' .dataEmpty').empty();
            return false;
        }
        if (prevProps.data != this.props.data) {
            this.init();
        }
    }
    componentDidMount() {
        this.init();
    }
    init() {
        let types = Object.keys(this.props.data);
        let turbineTypes = types.map((item) => item.split('_')[1]) || [];

        this.setState({
            turbineTypes: turbineTypes
        }, function() {
            // 初始化echarts图表
            this.initChart(this.props.data);
            // 设置canvas尺寸为100%，响应页面缩放、resize(写在less中被覆盖)
            Utils.handleCanvasSize('areaAlarmCanvas');
        }.bind(this));
    }
    initChart(chartDataOrigin) {
        let screenType = Utils.getScreenType();
        let chartConfig = SCREEN_TYPES[screenType];

        let paramsChartDataOrigin = Object.assign({}, chartDataOrigin);
        let chartData = {};
        let hiddenTypes = this.state.hiddenTypes;
        let keys = Object.keys(paramsChartDataOrigin);
        let showKeys = keys.filter((item) => hiddenTypes.indexOf(item.split('_')[1]) == -1);
        showKeys.forEach((item) => chartData[item] = [].concat(paramsChartDataOrigin[item]));

        let areaList = [];
        let types = Object.keys(chartData);
        types.forEach(function(type) {
            if (chartData[type].length > 0) {
                chartData[type].forEach(function(item) {
                    if (!!item.name && item.name.indexOf('区域') == -1 && areaList.indexOf(item.name) == -1) {
                        areaList.push(item.name);
                    }
                    if (!!item.name && item.name.indexOf('区域') != -1 && areaList.indexOf(item.name.slice(0, -2)) == -1) {
                        areaList.push(item.name.slice(0, -2));
                    }
                });
            }
        });
        let ty = !!types && !!types[0] ? types[0].split('_')[0] : '';
        $('#areaAlarmTime').attr('data-machine-type', ty);

        let chartDataAry = [];
        types.forEach(function(item) {
            chartData[item].forEach(function(innerItem) {
                chartDataAry.push(innerItem);
            });
        });

        let seriesData = types.map((type) => {
            let area = User.get('currentArea');
            let project = User.get('currentWindsite');
            let finalData;
            let dataAry = areaList.map((area) => {
                let data = chartDataAry.filter((item) => {
                    return !!item.name && ((item.name.indexOf('区域') != -1 && item.name.indexOf(area) != -1) || (item.name.indexOf('区域') == -1 && item.name == area));
                }) || [];
                finalData = data.filter((finalItem) => finalItem.TURBINE_MODEL == type.split('_')[0]);
                return finalData.length > 0 ? finalData[0].value : 0;
            });

            return {
                name: !!area && !!project && finalData.length > 0 ? finalData[0].name : type.split('_')[1],
                type: 'bar',
                barMaxWidth: chartConfig.barMaxWidth,
                itemStyle: {
                    normal: {
                        color: TURBINE_TYPE_COLOR_MAP[type.split('_')[1]]
                    }
                },
                cursor: 'default',
                label: {
                    normal: {
                        show: false
                    }
                },
                // barDap: '30%',
                data: dataAry
            };
        }) || [];

        let option = {
            tooltip: {
                trigger: 'axis',
                // 坐标轴指示器，坐标轴触发有效
                axisPointer: {
                    // 默认为直线，可选为：'line' | 'shadow'
                    type: 'line',
                    lineStyle: {
                        color: 'transparent'
                    }
                },
                textStyle: {
                    fontSize: chartConfig.textFontSize,
                    color: '#b2b4bd'
                },
                formatter: function(params) {
                    let tooltip = '<span style="display: inline-block; color: white;">' + params[0].name + '</span>' + '<br />' + params.map(function(item, index) {
                        let spans = '<span style="display: inline-block; margin-right: 3px; margin-left: 3px; border-radius: 10px; width: 9px; height: 9px; background-color:' + params[index].color + ';"></span>';
                        let paramsValue = spans + params[index].seriesName + ' : ' + '<span style="display: inline-block; color: white;">' + params[index].value +'&nbsp;&nbsp;'+'</span>';
                        if (index % 10 == 0 && index != 0) {
                            paramsValue += '<br />';
                        }
                        return paramsValue;
                    }).join('   ');
                    let area = User.get('currentArea');
                    let project = User.get('currentWindsite');
                    if (!!area && !!project) {
                        let dataAry = [];
                        keys.forEach((item) => dataAry = dataAry.concat(paramsChartDataOrigin[item]));

                        let targetParam = dataAry.filter((item) => item.name == params[0].name)[0];
                        tooltip = '<span style="display: inline-block; color: white;">' + params[0].name + '</span>' + ': ' + targetParam.value;
                    }
                    return tooltip;
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            grid: {
                top: '20%',
                bottom: '4%',
                left: '3%',
                right: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: areaList,
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'transparent'
                    },
                    label: {
                        textStyle: {
                            fontSize: chartConfig.textFontSize
                        }
                    }
                },
                axisLabel: {
                    color: THEME_MAP[theme].textColor,
                    fontSize: chartConfig.textFontSize,
                    interval:0
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'transparent'
                    },
                    label: {
                        textStyle: {
                            fontSize: chartConfig.labelFontSize
                        }
                    }
                },
                axisLabel: {
                    color: THEME_MAP[theme].labelColor,
                    fontSize: chartConfig.labelFontSize
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        width: chartConfig.line,
                        type: 'dashed',
                        color: THEME_MAP[theme].splitLineColor
                    }
                },
                triggerEvent: true
            },
            series: seriesData
        };
        Utils.initChart('areaAlarmCanvas', option, {
            click: function(item) {
                if (item.componentType == 'yAxis') {
                    let machineType = types.filter((typeItem) => typeItem.indexOf(item.value) != -1)[0].split('_')[0];
                    $('#areaAlarmTime').attr('data-machine-type', machineType);
                    this.handleTypeChange(machineType);
                }
            }.bind(this)
        });
    }
    handleTypeChange(type) {
        !!this.props.onTypeChange && this.props.onTypeChange(type);
    }
    toggleHiddenTypes(type) {
        let types = this.state.hiddenTypes;
        if (types.indexOf(type) == -1) {
            types.push(type);
        } else {
            types = types.filter((item) => item != type);
        }
        this.setState({
            hiddenTypes: types
        }, function() {
            this.init();
        }.bind(this));
    }
    onMore() {
        !!this.props.onMore && this.props.onMore();
    }
    render() {
        let hiddenTypes = this.state.hiddenTypes;
        let turbineTypes = this.state.turbineTypes;
        let turbineTypeNodes = turbineTypes.map(function(item) {
            let typeStyle = {
                backgroundColor: hiddenTypes.indexOf(item) != -1 ? '#bfbfbf' : TURBINE_TYPE_COLOR_MAP[item]
            };
            let typeNameStyle = {
                color: hiddenTypes.indexOf(item) != -1 ? 'rgb(205,205,205)' : THEME_MAP[theme].textColor
            };
            return (
                <div key={'turbineType' + item} className={style.turbineType + ' left'}>
                    <span className={style.turbineTypeBtn} style={typeStyle} onClick={this.toggleHiddenTypes.bind(this, item)}></span>
                    <span className={style.turbineTypeName} style={typeNameStyle} onClick={this.toggleHiddenTypes.bind(this, item)}>{item}</span>
                </div>
            );
        }.bind(this));
        return (
            <div className='full'>
                <div className='panelHeader'>
                    <span id='areaAlarmTime' className='panelTitle'>机型区域预警（近一月）</span>
                    <span className='panelLink linkBtn' onClick={this.onMore}></span>
                </div>
                {!Utils.isEmpty(this.props.data) ?
                <div className='full'>
                    <div id='areaAlarmCanvas' className='full'></div>
                    <div className={style.turbineTypes + ' clearfix'}>
                        {turbineTypeNodes}
                    </div>
                </div> :
                <div className='dataEmpty'></div>}
            </div>
        );
    }
}

module.exports = ChartAreaAlarm;
