import React from 'react';

import User from 'utils/user';
import Utils from 'utils/utils';
import Constant from 'constant/index';
import DropdownSearch from 'subComponents/DropdownSearch';

let THEME_MAP = Constant.THEME_MAP;
let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

let colors = [
    '#09a8fa',
    '#626fe6',
    '#5ac8d8',
    '#ffdc76',
    '#a393eb',
    '#64a092',
    '#c1168f',
    '#594a89',
    '#df03ca',
    '#716c1c',
    '#243c6c',
    '#9c6479',
    '#6a0fff',
    '#51f6d6',
    '#55ba54',
    '#5cc17e',
    '#9d717b',
    '#bee144',
    '#20fde7',
    '#5bbd59',
    '#76fa4a',
    '#230ec7',
    '#65b4ef',
    '#99df26',
    '#3eea59',
    '#7626fa',
    '#a695d0',
    '#b22486',
    '#a1eb10',
    '#eca135',
    '#3bef58',
    '#a97387',
    '#906181',
    '#7c3bfd',
    '#568e7a',
    '#e435fb',
    '#2f65ae',
    '#121e83',
    '#431f14',
    '#670f08',
    '#8cdab5',
    '#431337',
    '#8dde07',
    '#27e295',
    '#77d31a',
    '#f0d109',
    '#dbcbfb',
    '#684f1c',
    '#92d492',
    '#e0d182'
];

let emptyColorObj = {};
let colorObj = {};

const AXIS_LINE_COLOR = {
    light: '#eee',
    dark: '#2e365a'
};

class WarningInforDetailsChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否展示一个y轴
            showOneYaxis: false,
            form: {
                variableAry: [],
                variables: [],
                turbines: [],
                time: '1'
            },
            // 变量列表
            variables: [],
            // 风机列表
            turbines: [],
            // 当前查看风机的机型
            turbineType: '',
            // 可选时间
            times: [{
                key: '1',
                value: '前一分钟'
            }, {
                key: '10',
                value: '前十分钟'
            }, {
                key: '60',
                value: '前一小时'
            }],
            // 是否全选风机
            isAllTurbineSelected: false,
            // 展示的图例
            showLegends: {},
            // echarts数据缩放开始比例
            dataZoomStart: 0,
            // echarts数据缩放结束比例
            dataZoomEnd: 100
        };

        // 初始化
        this.init = this.init.bind(this);
        // 初始化图表
        this.initChart = this.initChart.bind(this);
        // 查找
        this.search = this.search.bind(this);
        // 处理时间变化
        this.handleTimeChange = this.handleTimeChange.bind(this);
        // 处理风机变化
        this.handleTurbineChange = this.handleTurbineChange.bind(this);
        // 处理变量变化
        this.handleVariableChange = this.handleVariableChange.bind(this);
        // 清除图表数据
        this.clearChart = this.clearChart.bind(this);
        // 清除所有变量
        this.clearVar = this.clearVar.bind(this);
        // 滚动到变量
        this.scrollToVar = this.scrollToVar.bind(this);
        // 清除所有风机
        this.clearTurbine = this.clearTurbine.bind(this);
        // 滚动到风机
        this.scrollToTurbine = this.scrollToTurbine.bind(this);
        // 获取目标颜色
        this.getTargetColor = this.getTargetColor.bind(this);
        // 是否查看全场
        this.isViewAll = this.isViewAll.bind(this);

        // 导出
        this.exportFile = this.exportFile.bind(this);
        // 显示隐藏变量筛选框
        this.toggleVars = this.toggleVars.bind(this);

        this.toggleYaxis = this.toggleYaxis.bind(this);
    }
    componentWillMount() {
        colors.forEach((item) => {
            emptyColorObj[item] = '';
            colorObj[item] = '';
        });
    }
    componentDidMount() {
        this.init();
        colorObj = Object.assign({}, emptyColorObj);
    }
    componentDidUpdate(prevProps) {
        let predictDataDidUpdate = prevProps.predictData != this.props.predictData;
        let variablesDidUpdate = prevProps.variables != this.props.variables;
        if (predictDataDidUpdate || variablesDidUpdate) {
            this.init();
        }
    }
    init() {
        let form = this.state.form;
        let variables = !!this.props.variables ? this.props.variables : [];
        let turbines = !!this.props.turbines ? this.props.turbines : [];
        this.setState({
            form: form,
            turbines: turbines,
            variables: variables
        }, function() {
            // 初始化echarts图表
            this.initChart();
            // 设置canvas尺寸为100%，响应页面缩放、resize(写在less中被覆盖)
            Utils.handleBigScreenDomHeight();
            Utils.handleCanvasSize(this.props.id);
        }.bind(this));
    }
    initChart() {
        let originalPredictData = this.props.predictData || [];
        let originalPredictDataKeys = Object.keys(originalPredictData);
        originalPredictDataKeys = originalPredictDataKeys.filter((item) => item != '');

        let predictData = {};
        originalPredictDataKeys.forEach((key) => {
            predictData[key] = [].concat(originalPredictData[key]);
        });
        if (Utils.isEmpty(predictData)) {
            Utils.clearChart(this.props.id);
            return false;
        }

        let dataKeys = !!predictData ? Object.keys(predictData) : [];
        dataKeys = dataKeys.filter((item) => item != '');

        let variables = !!this.props.variables ? this.props.variables : [];
        let turbines = !!this.props.turbines ? this.props.turbines : [];
        let xAxisData = !!predictData && !!predictData[dataKeys[0]] ? predictData[dataKeys[0]].map((item) => item.time) : [];

        let legends = [];
        let legendKeys = [];
        if (!Utils.isEmpty(this.state.showLegends)) {
            legends = this.isViewAll() ? turbines.filter((item) => this.state.showLegends[item.value] == true) : variables.filter((item) => this.state.showLegends[item.value] == true);
            legendKeys = legends.map((legendKey) => legendKey.key);
        }

        let hasVar = this.state.form.variables.length > 0;
        let yAxis = [];
        // 查看全场只显示一个y轴
        if (this.isViewAll()) {
            let targetVariable = this.state.form.variables[0];
            let target = variables.find((item) => item.key == targetVariable);
            let axisLineColor = AXIS_LINE_COLOR[theme] || THEME_MAP[theme].axisColor;
            yAxis = [{
                type: 'value',
                name: !!target ? target.value : '',
                nameLocation: 'end',
                nameGap: Utils.isMsBigScreen() ? 240 : 8,
                nameTextStyle: {
                    color: THEME_MAP[theme].axisColor,
                    fontSize: Utils.zoom(10)
                },
                position: 'left',
                //去除网格线
                splitLine: {
                    show: false
                },
                axisPointer: {
                    type: 'shadow',
                    label: {
                        textStyle: {
                            fontSize: Utils.zoom(12)
                        }
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: Utils.zoom(2),
                        type: 'dashed',
                        color: axisLineColor
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    width: 100,
                    height: 50,
                    align: 'center',
                    margin: 0,
                    color: THEME_MAP[theme].axisColor,
                    fontSize: Utils.zoom(10),
                    rich: {}
                }
            }];
        } else {
            let showOneYaxis = this.state.showOneYaxis;
            if (!showOneYaxis) {
                yAxis = dataKeys.map(function(key, keyIndex) {
                    let offsetUnit = $(document.body).attr('bigscreenmicrosoft') == 'true' ? 120 : 50;
                    let offset = 0;
                    let itemValues = [].concat(predictData[key]).map((item) => parseFloat(item.value));
                    itemValues.sort((a, b) => a - b);
                    let minItemVal = new Number(itemValues[0]);
                    let maxItemVal = new Number(itemValues[itemValues.length - 1]);
                    if (keyIndex > 1) {
                        let prevItems = [].concat(predictData[dataKeys[keyIndex - 2]]).sort((a, b) => a.value - b.value);
                        let prevMaxItemVal = ' ' + prevItems[prevItems.length - 2].value;
                        offset = (keyIndex - 2) * offsetUnit;
                        if (prevMaxItemVal.length > 10) {
                            offset = prevMaxItemVal.length * 10 + (keyIndex - 2) * offsetUnit;
                        }
                        offset = Math.max(offset, offsetUnit);
                    }

                    let target = this.isViewAll() ? turbines.find((item) => item.key == key) : variables.find((item) => item.key == key);
                    let targetKey = this.getTargetColor(key);
                    let targetColor = hasVar && !!targetKey ? targetKey : colors[keyIndex];
                    let axisLineColor = AXIS_LINE_COLOR[theme] || targetColor;
                    let yAxisItem = {
                        type: 'value',
                        name: !!target ? target.value : '',
                        nameLocation: 'end',
                        nameGap: Utils.isMsBigScreen() ? (keyIndex + 1) * 240 : (keyIndex + 1) * 8,
                        nameTextStyle: {
                            color: targetColor,
                            fontSize: Utils.zoom(10)
                        },
                        position: keyIndex % 2 == 0 ? 'left' : 'right',
                        offset: offset,
                        // 去除网格线
                        splitLine: {
                            show: false
                        },
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                textStyle: {
                                    fontSize: Utils.zoom(12)
                                }
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                width: Utils.zoom(2),
                                type: 'dashed',
                                color: axisLineColor
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            width: 100,
                            height: 50,
                            align: 'center',
                            margin: 0,
                            color: targetColor,
                            fontSize: Utils.zoom(10),
                            rich: {}
                        }
                    };
                    if (!isNaN(minItemVal.toFixed(2))) {
                        yAxisItem.min = minItemVal.toFixed(2);
                    }
                    if (!isNaN(maxItemVal.toFixed(2))) {
                        yAxisItem.max = maxItemVal.toFixed(2);
                    }

                    if (!Utils.isEmpty(this.state.showLegends)) {
                        yAxisItem.show = legendKeys.indexOf(key) != -1;
                    }
                    return yAxisItem;
                }.bind(this));
            }
            if (showOneYaxis) {
                let minItemVals = [];
                let maxItemVals = [];
                dataKeys.forEach((key) => {
                    let itemValues = [].concat(predictData[key]).map((item) => parseFloat(item.value));
                    itemValues.sort((a, b) => a - b);
                    let minItemVal = new Number(itemValues[0]);
                    let maxItemVal = new Number(itemValues[itemValues.length - 1]);
                    minItemVals.push(minItemVal.toFixed(2));
                    maxItemVals.push(maxItemVal.toFixed(2));
                });

                let minVal = minItemVals.sort((a, b) => a - b)[0];
                let maxVal = maxItemVals.sort((a, b) => b - a)[0];

                yAxis = [{
                    type: 'value',
                    name: '',
                    nameLocation: 'end',
                    nameGap: Utils.isMsBigScreen() ? 240 : 8,
                    nameTextStyle: {
                        color: THEME_MAP[theme].axisColor,
                        fontSize: Utils.zoom(10)
                    },
                    position: 'left',
                    min: minVal,
                    max: maxVal,
                    // 去除网格线
                    splitLine: {
                        show: false
                    },
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            textStyle: {
                                fontSize: Utils.zoom(12)
                            }
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: Utils.zoom(2),
                            type: 'dashed',
                            color: AXIS_LINE_COLOR[theme]
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        width: 100,
                        height: 50,
                        align: 'center',
                        margin: 0,
                        color: THEME_MAP[theme].axisColor,
                        fontSize: Utils.zoom(10),
                        rich: {}
                    }
                }];
            }
        }

        let legendData = dataKeys.map(function(key, index) {
            let target = this.isViewAll() ? turbines.find((item) => item.key == key) : variables.find((item) => item.key == key);
            let targetKey = this.getTargetColor(key);
            return {
                name: !!target ? target.value : '',
                textStyle: {
                    color: hasVar && !!targetKey ? targetKey : colors[index]
                }
            };
        }.bind(this));

        let seriesData = !!predictData ? dataKeys.map(function(key, keyIndex) {
            let target = this.isViewAll() ? turbines.find((item) => item.key == key) : variables.find((item) => item.key == key);
            let targetKey = this.getTargetColor(key);
            let targetColor = hasVar && !!targetKey ? targetKey : colors[keyIndex];
            let seriesDataItem = {
                yAxisIndex: this.isViewAll() || this.state.showOneYaxis ? 0 : keyIndex,
                name: !!target ? target.value : '',
                type: 'line',
                lineStyle: {
                    normal: {
                        color: targetColor,
                        width: Utils.zoom(1)
                    }
                },
                itemStyle: {
                    normal: {
                        color: targetColor
                    }
                },
                data: !!predictData && !!predictData[key] ? predictData[key].map(function(item) {
                    return {
                        value: !!item.value ? item.value : 0
                    };
                }) : []
            };

            if (!!this.props.predictStartTime) {
                seriesDataItem.markLine = {
                    lineStyle: {
                        normal: {
                            width: Utils.zoom(2),
                            type: 'solid',
                            color: '#f00'
                        }
                    },
                    data: [{
                        xAxis: this.props.predictStartTime
                    }, {
                        xAxis: this.props.predictEndTime
                    }]
                };
            }
            return seriesDataItem;
        }.bind(this)) : [];

        let xAxisLineColor = AXIS_LINE_COLOR[theme] || THEME_MAP[theme].axisColor;
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line'
                },
                formatter: function(params) {
                    let paramsData='<span style="display:inline-block;color:white;">'+params[0].name+'</span>'+'<br />';
                    params.map((item,index) =>{
                        paramsData += params[index].marker+params[index].seriesName+ ' : ' +'<span style="display:inline-block;color:white;">'+params[index].value+'</span>'+'<br />';
                    })
                    return paramsData;
                },
                textStyle: {
                    fontSize: Utils.zoom(12),
                    color: '#b2b4bd'
                },
                backgroundColor: THEME_MAP[theme].chartTooltipBgColor
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                realtime: true,
                start: this.state.dataZoomStart,
                end: this.state.dataZoomEnd,
                textStyle: {
                    color: THEME_MAP[theme].textColor
                }
            }, {
                type: 'inside',
                realtime: true,
                start: this.state.dataZoomStart,
                end: this.state.dataZoomEnd
            }],
            title: {
                show: false,
                text: this.isViewAll() ? '当前风机:' : '当前变量:',
                top: 10,
                left: 80,
                textStyle: {
                    color: THEME_MAP[theme].textColor,
                    fontWeight: 100,
                    fontSize: Utils.zoom(16)
                }
            },
            legend: {
                type: 'scroll',
                orient: 'horizontal',
                width: '70%',
                top: 10,
                right: '10%',
                data: legendData,
                itemHeight: Utils.zoom(8),
                itemWidth: Utils.zoom(20),
                textStyle: {
                    color: THEME_MAP[theme].textColor,
                    fontSize: Utils.zoom(12)
                }
            },
            grid: {
                top: '15%',
                left: Math.max(!Utils.isEmpty(this.state.showLegends) ? Math.floor(legendKeys.length / 2) * 50 : Math.floor(yAxis.length / 2) * 50, 120),
                right: Math.max(!Utils.isEmpty(this.state.showLegends) ? Math.floor(legendKeys.length / 2) * 50 : Math.floor(yAxis.length / 2) * 50, 120),
                bottom: !!Utils.isMiniScreen ? '10%' : '6%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: xAxisData,
                //去除网格线
                splitLine: {
                    show: false
                },
                axisPointer: {
                    // type: 'shadow',
                    label: {
                        textStyle: {
                            fontSize: Utils.zoom(12)
                        }
                    }
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        //x轴文本颜色 支持回调
                        color: THEME_MAP[theme].axisColor
                    },
                    fontSize: Utils.zoom(12)
                },
                axisLine: {
                    lineStyle: {
                        width: Utils.zoom(2),
                        type: 'dashed',
                        color: xAxisLineColor
                    }
                },
                axisTick: {
                    show: false
                }
            }],
            yAxis: yAxis,
            series: seriesData
        };

        if (!Utils.isEmpty(this.state.showLegends)) {
            option.legend = Object.assign({}, option.legend, {
                selected: this.state.showLegends
            });
        }

        if (yAxis.length > 0) {
            if (this.isViewAll()) {
                let legendColors = legendData.forEach(() => Utils.getRandomColor());
                option.color = legendColors;
            }
            option = Object.assign({}, option, Utils.fixChartOption(option));
            Utils.initChart(this.props.id, option, {
                datazoom: function(params) {
                    this.setState({
                        dataZoomStart: params.start,
                        dataZoomEnd: params.end
                    });
                }.bind(this),
                legendselectchanged: function(params) {
                    this.setState({
                        showLegends: params.selected
                    }, function() {
                        this.init();
                    }.bind(this));
                }.bind(this)
            });
        }
    }
    search() {
        let canSelectTurbine = !this.props.isTranslog && this.isViewAll();
        let form = this.state.form;
        if (canSelectTurbine && form.turbines.length == 0) {
            Utils.tooltip('请选择风机');
            return false;
        }
        if (form.variables.length == 0) {
            Utils.tooltip('请选择变量');
            return false;
        }
        $('#warningInforDetailsChart1Canvas').addClass('btnLoading');
        $('#warningInforDetailsChart2Canvas').addClass('btnLoading');
        !!this.props.onFilterChange && this.props.onFilterChange(form);
    }
    handleTimeChange(option) {
        let form = this.state.form;
        form.time = option.key;
        this.setState({
            form: form
        });
    }
    handleTurbineChange(option) {
        let form = this.state.form;
        // 查看全场(包含风场预警)时，可以全选（实际是选中类型最多的风机）风机
        if (this.isViewAll()) {
            // 全选风机
            if (option.value === '全选') {
                if (!this.state.isAllTurbineSelected) {
                    let allTurbines = this.props.allTurbines;
                    let allTurbineGroup = Utils.groupBy(allTurbines, 'MODEL_');
                    let allTurbineKeys = Object.keys(allTurbineGroup);
                    let allTurbineTypes = allTurbineKeys.map((key) => {
                        return {
                            key: key,
                            len: allTurbineGroup[key].length
                        };
                    });
                    allTurbineTypes.sort((a, b) => b.len - a.len);

                    let turbineType = allTurbineTypes[0].key;
                    let formTurbines = allTurbineGroup[turbineType];
                    form.turbines = formTurbines.map((item) => item.CODE_ + '__' + this.props.id);

                    if (form.turbines.length == allTurbines.length) {
                        form.turbines.unshift('ALL__' + this.props.id)
                    }

                    this.setState({
                        form: form,
                        isAllTurbineSelected: true,
                        turbineType: turbineType
                    });
                } else {
                    form.turbines = [];
                    this.setState({
                        form: form,
                        isAllTurbineSelected: false,
                        turbineType: ''
                    });
                }
                let newForm = Object.assign({}, form);
                newForm.turbines = newForm.turbines.filter((item) => item != ('ALL__' + this.props.id));
                !!this.props.onFilterChange && this.props.onFilterChange(newForm);
                return false;
            }
            // 选择单个风机
            if (form.turbines.indexOf(option.key) == -1) {
                if (form.turbines.length == 0) {
                    let targetTurbine = this.props.allTurbines.find((item) => item.CODE_ == option.key.split('__')[0]);
                    this.setState({
                        turbineType: targetTurbine.MODEL_
                    });
                }
                if (form.turbines.length > 0) {
                    let newTurbine = this.props.allTurbines.find((item) => item.CODE_ == option.key.split('__')[0]);
                    if (newTurbine.MODEL_ != this.state.turbineType) {
                        Utils.tooltip('只能查看同机型风机');
                        return false;
                    }
                }
                form.turbines.push(option.key);
            } else {
                form.turbines = form.turbines.filter((item) => item != option.key);
            }
            this.setState({
                form: form
            });
            let newForm = Object.assign({}, form);
            !!this.props.onFilterChange && this.props.onFilterChange(newForm);
            return false;
        }
        // 非查看全场，最多选择一个风机
        // 替换选中的风机
        if (form.turbines.indexOf(option.key) == -1) {
            form.turbines = [option.key];
        } else {
            form.turbines = [];
        }
        this.setState({
            form: form
        });
        let newForm = Object.assign({}, form);
        !!this.props.onFilterChange && this.props.onFilterChange(newForm);
    }
    handleVariableChange(option) {
        let form = this.state.form;
        let showLegends = this.state.showLegends;
        // 查看全场(包含风场预警)，只能选择一个变量
        if (this.isViewAll()) {
            if (form.variables.indexOf(option.key) == -1) {
                form.variables = [option.key];
                form.variableAry = [Object.assign({}, option)];
            } else {
                form.variables = [];
                form.variableAry = [];
            }
            this.setState({
                form: form
            });
            return false;
        }
        // 非参看全场预警时，最多选择15个变量
        if (form.variables.indexOf(option.key) == -1) {
            if (form.variables.length == 15) {
                Utils.tooltip('最多展示15个变量的变化趋势');
                return false;
            }

            let keys = Object.keys(colorObj);
            let emptyKeys = keys.filter((item) => colorObj[item] == '');
            if (emptyKeys.length > 0) {
                let key = emptyKeys[0];
                colorObj[key] = option.key.split('__')[0];
            }

            form.variables.push(option.key);
            form.variableAry.push(option);
            showLegends[option.value] = true;
        } else {
            let targetVal = option.key.split('__')[0];
            let targetKey = this.getTargetColor(targetVal);
            colorObj[targetKey] = '';
            delete showLegends[option.value];
            form.variables = form.variables.filter((item) => item != option.key);
            form.variableAry = form.variableAry.filter((item) => item.key != option.key);
        }
        this.setState({
            form: form,
            showLegends: showLegends
        }, function() {
            form.variables.length == 0 ? Utils.clearChart(this.props.id) : this.init();
        }.bind(this));
    }
    clearChart() {
        !!this.props.onChartClear && this.props.onChartClear();
    }
    clearVar() {
        let form = this.state.form;
        form.variables = [];
        form.variableAry = [];
        colorObj = Object.assign({}, emptyColorObj);

        this.clearChart();
        this.setState({
            form: form,
            showLegends: {}
        }, function() {
            Utils.clearChart(this.props.id);
        });
    }
    clearTurbine() {
        let form = this.state.form;
        form.turbines = [];
        form.variables = [];
        form.variableAry = [];
        colorObj = Object.assign({}, emptyColorObj);

        this.clearChart();
        this.setState({
            form: form,
            variable: [],
            showLegends: {}
        }, function() {
            Utils.clearChart(this.props.id)
        });
    }
    scrollToVar(key, event) {
        // stop propagation
        if ($(event.target).attr('data-stop') == 'true') {
            return false;
        }
        let firstDom = $('#varSearchDropdownWrapper ul li:first-child');
        let targetDom = $('#varSearchDropdownWrapper ul li[data-key="' + key + '"]');
        if (!!targetDom) {
            $('#varSearchDropdownWrapper ul').animate({
                scrollTop: $(targetDom).offset().top - $(firstDom).offset().top
            });
        }
    }
    scrollToTurbine(key, event) {
        // stop propagation
        if ($(event.target).attr('data-stop') == 'true') {
            return false;
        }
        let firstDom = $('#turbineSearchDropdownWrapper ul li:first-child');
        let targetDom = $('#turbineSearchDropdownWrapper ul li[data-key="' + key + '"]');
        if (!!targetDom) {
            $('#turbineSearchDropdownWrapper ul').animate({
                scrollTop: $(targetDom).offset().top - $(firstDom).offset().top
            });
        }
    }
    getTargetColor(val) {
        let keys = Object.keys(colorObj);
        let color = keys.find((key) => colorObj[key] == val);
        return color;
    }
    isViewAll() {
        return this.props.isViewAll == 1;
    }
    exportFile() {
        if (this.state.form.variables.length > 0 && !Utils.isEmpty(this.props.postData)) {
            let form = $('#exportTendency');
            form.submit();
            return false;
        }
        Utils.tooltip('请选择导出条件');
    }
    toggleVars() {
        !!this.props.onVarsToggle && this.props.onVarsToggle();
    }
    toggleYaxis() {
        this.setState({
            showOneYaxis: !this.state.showOneYaxis
        }, function() {
            this.initChart();
        }.bind(this));
    }
    render() {
        let userInfo = User.get();
        let truePostData = this.props.postData || {};
        for (let objKey in truePostData) {
            truePostData[objKey] = !!truePostData[objKey] ? truePostData[objKey] : '';
        }
        let chartId = this.props.id;
        let canSelectTurbine = !this.props.isTranslog && this.isViewAll();
        let variableOptions = this.state.variables.map((item) => {
            return {
                key: item.key + '__' + chartId,
                value: item.value,
                isActive: item.isActive
            };
        });

        let turbineOptions = this.state.turbines.map((item) => {
            return {
                key: item.key + '__' + chartId,
                value: item.value
            };
        });
        // 查看全场时，可选全部风机
        if (this.isViewAll()) {
            turbineOptions.unshift({
                key: 'ALL__' + chartId,
                value: '全选'
            });
        }

        let times = this.state.times.map(function(time) {
            return (
                <div key={time.key} className={this.state.form.time == time.key ? style.varPanelLabelActive + ' left' : style.varPanelLabel + ' left'} onClick={this.handleTimeChange.bind(this, time)}>{time.value}</div>
            );
        }.bind(this));

        let hasVar = this.state.form.variables.length > 0;
        let selectedKeys = this.state.form.variables.map((item) => item.split('__')[0]);
        let selectedVars = this.state.variables.filter((item) => selectedKeys.indexOf(item.key) != -1);
        let selectedVarKeys = selectedVars.map((item) => item.key);
        let sortSelectedVars = selectedVarKeys.map((item) => {
            return selectedVars.find((innerItem) => innerItem.key == item);
        });

        let selectedVarNodes = sortSelectedVars.map(function(item, index) {
            let selectedItem = {
                key: item.key + '__' + this.props.id,
                value: item.value
            };
            let targetKey = this.getTargetColor(item.key);
            let onlyOneVar = this.isViewAll();
            let varNodeStyle = {
                backgroundColor: hasVar && !!targetKey ? targetKey : colors[index]
            };
            if (onlyOneVar) {
                varNodeStyle = {};
            }
            return (
                <div key={'selctedVar' + item.key} className={onlyOneVar ? style.selectedVarOnly : style.selectedVar} style={varNodeStyle} onClick={this.scrollToVar.bind(this, item.key)}>
                    <span>{item.value}</span>
                    <span className={style.selectedVarClose} onClick={this.handleVariableChange.bind(this, selectedItem)} data-stop='true'>x</span>
                </div>
            );
        }.bind(this));

        // let formTurbineKeys = this.state.form.turbines.map((item) => item.split('__')[0]);
        // let selectedTurbines = this.state.turbines.filter((item) => {
        //     return formTurbineKeys.indexOf('' + item.key) != -1;
        // });

        let exportForm;
        if (Constant.PROJECT == 'wysengine') {
            exportForm = (
                <form id='exportTendency' action={Constant.API_ROOT + '/predict/exportParameterData'} method='POST' target=''>
                    <input type='hidden' id='token' name='token' value={userInfo.token} />
                    <input type='hidden' id='ID' name='ID' value={truePostData.ID} />
                    <input type='hidden' id='demoTagColumns' name='demoTagColumns' value={truePostData.demoTagColumns} />
                    <input type='hidden' id='TIME_TYPE' name='TIME_TYPE' value={truePostData.TIME_TYPE} />
                    <span  className={style.btn} onClick={this.exportFile} ></span>
                </form>
            );
        } else if (Constant.PROJECT == 'mingyang') {
            exportForm = (
                <form id='exportTendency' action={Constant.API_ROOT + '/predict/exportParameterData'} method='POST' target=''>
                    <input type='hidden' id='token' name='token' value={userInfo.token} />
                    <input type='hidden' id='PREDICT_ID' name='PREDICT_ID' value={truePostData.PREDICT_ID} />
                    <input type='hidden' id='PARAM_NAME' name='PARAM_NAME' value={truePostData.PARAM_NAME} />
                    <input type='hidden' id='TIME_TYPE' name='TIME_TYPE' value={truePostData.TIME_TYPE} />
                    <input type='hidden' id='turbines' name='turbines' value={truePostData.turbines} />
                    <span title='导出'  className={style.btn} onClick={this.exportFile} ></span>
                </form>
            );
        } else if (Constant.PROJECT == 'xiehe') {
            exportForm = (
                <form id='exportTendency' action={Constant.API_ROOT + '/predict/exportParameterData'} method='POST' target=''>
                    <input type='hidden' id='token' name='token' value={userInfo.token} />
                    <input type='hidden' id='PREDICT_ID' name='PREDICT_ID' value={truePostData.PREDICT_ID} />
                    <input type='hidden' id='PARAM_NAME' name='PARAM_NAME' value={truePostData.PARAM_NAME} />
                    <input type='hidden' id='TIME_TYPE' name='TIME_TYPE' value={truePostData.TIME_TYPE} />
                    <input type='hidden' id='turbines' name='turbines' value={truePostData.turbines} />
                    <span  className={style.btn} onClick={this.exportFile} ></span>
                </form>
            );
        }

        let panelCls = this.props.showVars ? style.varPanelsShow : style.varPanels;
        if (this.props.onVarsToggle && this.props.isTranslog) {
            panelCls += (' ' + style.varPanelsBig);
        }

        let btnCls = this.props.showVars ? style.switchTitleOpen : style.switchTitle;
        if (this.props.onVarsToggle == undefined) {
            btnCls += ' none';
        }
        return (
            <div className={style.box}>
                <div className={this.isViewAll() ? 'none' : style.tabs}>
                    <span onClick={this.toggleYaxis} className={this.state.showOneYaxis ? style.tab + ' ' + style.tabActive : style.tab}>单轴</span>
                    <span onClick={this.toggleYaxis} className={this.state.showOneYaxis ? style.tab : style.tab + ' ' + style.tabActive}>多轴</span>
                </div>
                {exportForm}
                <div id={this.props.id} className={this.props.isTranslog ? style.boxInnerFoot + ' ' + style.showMore : style.boxInnerFoot}></div>
                <div className={panelCls}>
                    <span className={btnCls} onClick={this.toggleVars}>变量选择</span>
                    <div className={style.varPanel}>
                        <span>时间选择：</span>
                        <div className={style.varPanelContent + ' clearfix'}>
                            {times}
                        </div>
                    </div>
                    {canSelectTurbine ?
                    <div className={style.varPanel}>
                        <span>风机选择：</span>
                        <div id='turbineSearchDropdownWrapper' className={style.selectDropdown}>
                            <DropdownSearch
                                placeholder={'搜索风机'}
                                selectedKeys={this.state.form.turbines}
                                overlayCls={style.overlayCls}
                                options={turbineOptions}
                                onSelect={this.handleTurbineChange}
                                isWrapperShow={this.props.showVars} />
                        </div>
                    </div> : null}
                    <div className={style.varPanel}>
                        <span>已选变量：</span>
                        <div className={style.varPanelContent}>
                            {selectedVarNodes}
                            {selectedVarNodes.length > 0 ?
                            <div className={style.clear} onClick={this.clearVar}>清除所有</div> : null}
                        </div>
                    </div>
                    <div className={style.varPanel}>
                        <span>变量选择：</span>
                        <div id='varSearchDropdownWrapper' className={style.selectDropdown}>
                            <DropdownSearch
                                placeholder={'搜索变量'}
                                selectedKeys={this.state.form.variables}
                                overlayCls={style.overlayCls}
                                options={variableOptions}
                                onSelect={this.handleVariableChange}
                                isWrapperShow={this.props.showVars} />
                        </div>
                    </div>
                    <div className={style.searchBtn} onClick={this.search}>查找</div>
                </div>
            </div>
        );
    }
}

module.exports = WarningInforDetailsChart;
