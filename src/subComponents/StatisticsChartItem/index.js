// 首页-预警统计组件（预警、技术支持、执行）
import React from 'react';
import Utils from 'utils/utils';
import User from 'utils/user';
import Constant from 'constant/index';

let theme = Utils.getTheme();
let THEME_MAP = Constant.THEME_MAP;
let style = require('./' + theme + '.less');

const BAR_COLOR_MAP = {
    '未处理预警': '#3f8eef',
    '一级预警': '#e56361',
    '二级预警': '#f29934',
    '三级预警': '#6ba5ec',
    '四级预警': '#82b4f1',
    '五级预警': '#a1c6f3',
    '未审核': '#f29934',
    '已通过': '#408ef0',
    '未通过': '#e56361',
    '已推送': '#366fbb',
    '已完成': '#8ccc45'
};

const BAR_BORDER_COLOR_MAP = {
    '未处理预警': 'transparent',
    '一级预警': 'transparent',
    '二级预警': 'transparent',
    '三级预警': 'transparent',
    '四级预警': 'transparent',
    '五级预警': 'transparent',
    '未审核': 'transparent',
    '已通过': 'transparent',
    '未通过': 'transparent',
    '已推送': 'transparent',
    '已完成': 'transparent'
};

const SCREEN_TYPES = {
    ipad: {
        offset: Utils.zoom(20),
        barWidth: Utils.zoom(6),
        txtFontSize: Utils.zoom(8)
    },
    miniscreen: {
        offset: Utils.zoom(20),
        barWidth: Utils.zoom(6),
        txtFontSize: Utils.zoom(8)
    },
    smallscreen: {
        offset: Utils.zoom(20),
        barWidth: Utils.zoom(6),
        txtFontSize: Utils.zoom(12)
    },
    mediumscreen: {
        offset: Utils.zoom(20),
        barWidth: Utils.zoom(6),
        txtFontSize: Utils.zoom(12)
    },
    highmediumscreen: {
        offset: Utils.zoom(20),
        barWidth: Utils.zoom(6),
        txtFontSize: Utils.zoom(12)
    },
    basescreen: {
        offset: Utils.zoom(20),
        barWidth: Utils.zoom(6),
        txtFontSize: Utils.zoom(12)
    },
    highscreen: {
        offset: Utils.zoom(20),
        barWidth: Utils.zoom(12),
        txtFontSize: Utils.zoom(24)
    },
    bigscreen: {
        offset: Utils.zoom(20),
        barWidth: Utils.zoom(6),
        txtFontSize: Utils.zoom(12)
    },
    bigscreenmicrosoft: {
        offset: Utils.zoom(20),
        barWidth: Utils.zoom(6),
        txtFontSize: Utils.zoom(12)
    }
};

class StatisticsChartItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            subItem: ''
        };

        // 更多按钮回调事件
        this.onMore = this.onMore.bind(this);
        // 处理模块激活切换
        this.handleItemActive = this.handleItemActive.bind(this);
        // 处理图表（标题、更多、图表series）点击事件
        this.viewDetailByItem = this.viewDetailByItem.bind(this);
        // 处理标题、更多点击事件
        this.viewDetailByTitleOrMore = this.viewDetailByTitleOrMore.bind(this);
        // 初始化
        this.init = this.init.bind(this);
    }
    componentDidUpdate() {
        this.init()
    }
    componentDidMount() {
        this.init()
    }
    init() {
        // 初始化echarts图表
        this.initChart();
        let barClickColor = User.get('barClickColor3');
        [].concat(this.props.data).map(function(item) {
            if(!!barClickColor) {
                if(item.type.indexOf(barClickColor.name) != -1) {
                    BAR_COLOR_MAP[item.type] = barClickColor.beforeColor;
                    // BAR_BORDER_COLOR_MAP[item.type] = 'transparent';
                }
            }
        })
        // 设置canvas尺寸为100%，响应页面缩放、resize(写在less中被覆盖)
        Utils.handleCanvasSize(this.props.id);
    }
    initChart() {
        let barClickColor = User.get('barClickColor3');
        let screenType = Utils.getScreenType();
        let chartConfig = SCREEN_TYPES[screenType];
        let isDark = theme === 'dark';
        let yAxisData = this.props.data.map((item) => {
            return item.type.indexOf('预警') != -1 ? item.type.slice(0, -2) : item.type;
        });
        let yAxisFinishedData1 = this.props.data.map((item) => item.total + '个');
        let yAxisFinishedData = yAxisFinishedData1.map(function(item) {
            return {
                value: item,
                align: 'right'
            };
        });

        let dataVals = this.props.data.map((item) => item.total);
        dataVals.sort((a, b) => a - b < 0);

        let seriesData = this.props.data.map((item) => {
            if(!!barClickColor) {
                if(item.type.indexOf(barClickColor.name) != -1) {
                    BAR_COLOR_MAP[item.type] = barClickColor.color;
                    // BAR_BORDER_COLOR_MAP[item.type] = 'rgba(0, 0, 0, 0.3)';
                }
            }
            return {
                value: item.total,
                itemStyle: {
                    normal: {
                        color: BAR_COLOR_MAP[item.type],
                        borderColor: BAR_BORDER_COLOR_MAP[item.type],
                        borderWidth: 20
                    }
                }
            };
        });


        let subSeriesData = this.props.data.map((item) => {
            return {
                value: item.total == 0 ? (dataVals[0] || 1) : dataVals[0] - item.total
            };
        });

        let offset= this.props.offset;

        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                textStyle: {
                    fontSize: chartConfig.txtFontSize,
                    color: '#b2b4bd'
                },
                formatter: function(params) {
                    return '<span style="display: inline-block;color: white;">' + params[0].name + '</span>' + '<br />' + params[0].marker + '<span style="display: inline-block;color: white;">' + params[0].value + '</span>' + '个';
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            grid: {
                top: 10,
                left: '20%',
                right: '20%',
                bottom: 0,
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                show: false,
                splitLine: {
                    show: false
                }
            },
            yAxis: [{
                type: 'category',
                data: yAxisData.reverse(),
                offset: chartConfig.offset,
                axisLabel: {
                    margin: 20,
                    align: 'right',
                    color: function(val){
                        let color = THEME_MAP[theme].textColor;
                        if(!!barClickColor && val.indexOf(barClickColor.name) != -1) {
                            color = '#3f8eef';
                        } else {
                            color = THEME_MAP[theme].textColor;
                        }
                        return color;

                    },
                    fontSize: chartConfig.txtFontSize
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            }, {
                type: 'category',
                position: 'right',
                offset: offset,
                data: yAxisFinishedData.reverse(),
                show: !this.props.hasFinishedType,
                axisLabel: {
                    margin: 10,
                    align: 'left',
                    color: THEME_MAP[theme].textColor,
                    fontSize: chartConfig.txtFontSize
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            }],
            series: [{
                type: 'bar',
                stack: 'chart',
                data: seriesData.reverse(),
                barMaxWidth: chartConfig.barWidth
            }, {
                type: 'bar',
                stack: 'chart',
                slient: true,
                data: subSeriesData.reverse(),
                barMaxWidth: chartConfig.barWidth,
                itemStyle: {
                    normal: {
                        color: isDark ? '#2a3354' : '#eef5fd'
                    }
                }
            }]
        };

        Utils.initChart(this.props.id, option, {
            click: function(params) {
                // 阻止事件冒泡
                if (params.event.cancelBubble == true) {
                    return false;
                }

                let subItemName = '';
                if (params.componentType == 'series') {
                    subItemName = params.name.indexOf('预警') != -1 ? params.name.split('预警')[0] : params.name;
                }
                this.viewDetailByItem(subItemName);
                if(params.color != THEME_MAP[theme].chartBarClickColor) {
                    params.data.itemStyle.normal = !!THEME_MAP[theme] ? THEME_MAP[theme].chartBarClickColor : '';
                    params.event.target.style.fill = !!THEME_MAP[theme] ? THEME_MAP[theme].chartBarClickColor : '';
                    User.set('barClickColor3', {
                        index: params.dataIndex,
                        color: THEME_MAP[theme].chartBarClickColor,
                        beforeColor: params.color,
                        name: params.name
                    });
                }

                // 阻止事件冒泡
                params.event.cancelBubble = true;
            }.bind(this)
        });
    }
    handleItemActive() {
        event.stopPropagation && event.stopPropagation();
        this.setState({
            subItem: ''
        }, function() {
            !!this.props.onActive && this.props.onActive(this.props.id);
        }.bind(this));
    }
    onMore() {
        event.stopPropagation && event.stopPropagation();
        !!this.props.onMore && this.props.onMore();
    }
    viewDetailByItem(subItem) {
        event.stopPropagation && event.stopPropagation();
        this.setState({
            subItem: subItem
        }, function() {
            !!this.props.onViewDetailByItem && this.props.onViewDetailByItem(this.props.id, subItem);
        }.bind(this));
    }
    viewDetailByTitleOrMore() {
        if (this.props.noResponseOnTitleAndMoreClick) {
            return false;
        }
        this.viewDetailByItem('');
    }
    render() {
        let isActive = this.props.activeId === this.props.id && this.state.subItem == '';
        let activeIdNo = this.props.activeIdNo;
        return (
            <div className={style.box + ' left'} onClick={this.handleItemActive}>
                <div className={isActive ? 'panel ' + style.boxInner + ' ' + style.active : 'panel ' + style.boxInner + ' ' +  style.active1}>
                    <div className={'panelHeader ' + style.header}>
                        <span className='panelTitle'>{this.props.title}</span>
                        <span className={this.props.hideBtn ? 'none' : 'panelLink linkBtn'} onClick={this.viewDetailByTitleOrMore}></span>
                    </div>
                    {Utils.isEmpty(this.props.data) ?
                    <div className='dataEmpty'></div> :
                    <div id={this.props.id} className='full'></div>}
                </div>
            </div>
        );
    }
}

module.exports = StatisticsChartItem;
