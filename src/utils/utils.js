import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/gauge';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';

const BIG_SCREEN_THRESHOLD_MISROSOFT = 7680;
const OLD_BIG_SCREEN_THRESHOLD = 3846;
const BIG_SCREEN_THRESHOLD = 3974;
const HIGH_SCREEN_THRESHOLD = 2160;

let aspectRatioBase = 1;

function handleBigScreenDomHeight(baseRatio) {
    let items = $('body *[data-aspect-ratio]');
    for (let i = 0; i < items.length; i++) {
        let domItem = $(items[i]);
        let aspectRatio = domItem.attr('data-aspect-ratio');
        let itemWidth = domItem.css('width').slice(0, -2);
        let itemHeight = itemWidth * aspectRatio * baseRatio;

        domItem.css({
            height: itemHeight.toFixed(2) + 'px'
        });
    }
}

let Utils = {
    getFontSize: function() {
        let bodyWidth = $(document.body).width();
        let isBaseScreen = $(document.body).attr('basescreen') == 'true';
        if (isBaseScreen) {
            bodyWidth = window.screen.width;
        }
        let fontSize = 12;

        // 7680 * 2160(microsoft bigscreen: 3.56)
        if (Math.abs(bodyWidth - BIG_SCREEN_THRESHOLD_MISROSOFT) < 50) {
            fontSize = 40;
        }
        // 4096 * 2160(bigscreen: 1.89)
        if (Math.abs(bodyWidth - BIG_SCREEN_THRESHOLD) < 150) {
            fontSize = 30;
        }
        // 3840 * 2160(mytv: 1.78)、3852 * 1576(bigscreen: 2.44)
        if (Math.abs(bodyWidth - OLD_BIG_SCREEN_THRESHOLD) < 50 && Math.abs($(document.body).height() - HIGH_SCREEN_THRESHOLD) < 50) {
            fontSize = 30;
        }
        // 1920 * 1080(basescreen: 1.78)
        if (Math.abs(bodyWidth - 1920) < 50) {
            fontSize = 20;
        }
        // 1680 * 1050(1.6)
        if (Math.abs(bodyWidth - 1680) < 40) {
            fontSize = 16;
        }
        // 1600 * 900(1.78)
        if (Math.abs(bodyWidth - 1600) < 40) {
            fontSize = 16;
        }
        // 1536 * 864(basescreen: 1.78)
        if (Math.abs(bodyWidth - 1536) < 50) {
            fontSize = 16;
        }
        // 1440 * 900(1.6)
        if (Math.abs(bodyWidth - 1440) < 30) {
            fontSize = 14;
        }
        // 1366 * 768(1.78)
        if (Math.abs(bodyWidth - 1366) < 30) {
            fontSize = 12;
        }

        return fontSize;
    },
    getColor: function() {
        let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        let customColors = ['#e94620', '#eb614d', '#ff8a80', '#f29b83', '#f7b981', '#f29444', '#f7b249', '#ffe082', '#f4ff81', '#ccff90', '#e5e757', '#90c31f', '#cce198', '#56ba8a', '#03915b', '#00bcd4', '#1d99c8', '#0070a2', '#007dd4', '#5572b7', '#90caf9', '#ce93d8', '#a664b0'];
        if (Utils.getTheme() == 'dark') {
            let randomNum = Math.ceil(Math.random() * 22);
            randomColor = customColors[randomNum];
        }
        return randomColor;
    },
    getRandomColor: function() {
        let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        return randomColor;
    },
    getTheme: function() {
        return localStorage.getItem('USER_THEME') || 'light';
    },
    setTheme: function(theme) {
        localStorage.setItem('USER_THEME', theme || 'light');
        Math.ceil(Math.random() * 22)
        window.location.reload();
    },
    groupBy: function(items, key) {
        if (items.length == 0 || key == '' || key == undefined) {
            return false;
        }

        let keyValues = items.map((item) => {
            return item[key];
        }).sort();

        let finalValues = [];
        keyValues.forEach((val) => {
            if (finalValues.indexOf(val) == -1) {
                finalValues.push(val);
            }
        });

        let result = {};
        finalValues.forEach((val) => {
            result[val] = items.filter((item) => {
                return item[key] == val;
            });
        });

        return result;
    },
    isEmpty: function(data) {
        let isEmpty = data == null || data == undefined || data == '' || JSON.stringify(data) == '[]' || JSON.stringify(data) == '{}';
        return isEmpty;
    },
    handleCanvasSize: function(wrapperId) {
        let isIE = navigator.userAgent.indexOf('MSIE') != -1;
        $('#' + wrapperId + ' > div:first-child').css({
            width: '100%',
            height: '100%'
        });
        $('#' + wrapperId + ' canvas').css({
            width: '100%',
            height: isIE == true ? '100%' : 'auto'
        });
    },
    initChart: function(id, option, events) {
        let dom = document.getElementById(id);
        if (!dom) {
            return false;
        }
        let chart = echarts.getInstanceByDom(document.getElementById(id));
        if (!!chart) {
            chart.clear();
            chart.dispose();
        }

        // 图表设置option时配置项
        let devicePixelRatio = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;
        let zoom = 1 / devicePixelRatio;

        let chartConfigOption = {
            devicePixelRatio: devicePixelRatio,
            renderer: 'canvas',
            width: $('#' + id).width() * zoom,
            height: $('#' + id).height() * zoom
        };

        chart = echarts.init(document.getElementById(id), {}, chartConfigOption);

        // 隐藏工具栏
        option = Utils.hideToolbox(option);
        // 设置提示框
        option = Utils.setChartTooltip(option);
        // 设置颜色
        option = Utils.setChartColor(option);
        // 设置图例
        option = Utils.setChartLegend(option);
        // 设置y轴
        option = Utils.setChartYaxis(option);
        // 设置dataZoom
        option = Utils.setChartDataZoom(option);

        chart.setOption(option);
        chart.resize();

        if (!!events) {
            let eventTypes = Object.keys(events);
            eventTypes.forEach(function(eventType) {
                chart.off(eventType, events[eventType]);
                chart.on(eventType, events[eventType]);
            });
        }
    },
    hideToolbox: function(option) {
        if (!!option.toolbox && !!option.toolbox.show) {
            option.toolbox.show = false;
        }
        return option;
    },
    setChartTooltip: function(option) {
        option.tooltip = !Utils.isEmpty(option.tooltip) ? Object.assign({}, option.tooltip, {
            confine: true,
            position: function(point, params, dom, rect, size) {
                let nub = parseInt(size.viewSize[0]) - parseInt(point[0]);
                if (!!params[0] && params[0].seriesType == 'line' && nub < 550) {
                    return [parseInt(point[0]) - Utils.zoom(300), parseInt(point[1] - 120)];
                }
                if (!!params[0] && !!params[1] && !!params[2] && params[0].seriesType == 'line' && nub < 550) {
                    return [parseInt(point[0]) - Utils.zoom(800), parseInt(point[1] - 120)];
                }
                return [parseInt(point[0]) + Utils.zoom(35), parseInt(point[1] - 120)];
            },
            padding: 25
        }) : {
            position: function(point) {
                return [parseInt(point[0]) + Utils.zoom(35), parseInt(point[1]) + Utils.zoom(30)];
            },
            padding: 25
        };
        return option;
    },
    setChartColor: function(option) {
        if (!option.color) {
            option = Object.assign({}, option, {
                color: ['#e94620', '#eb614d', '#ff8a80', '#f29b83', '#f7b981', '#f29444', '#f7b249', '#ffe082', '#f4ff81', '#ccff90', '#e5e757', '#90c31f', '#cce198', '#56ba8a', '#03915b', '#00bcd4', '#1d99c8', '#0070a2', '#007dd4', '#5572b7', '#90caf9', '#ce93d8', '#a664b0']
            });
        }
        return option;
    },
    setChartLegend: function(option) {
        if (!!option.legend && !!option.legend.data && option.legend.data.length >= 10) {
            option.legend.type = 'scroll';
        }
        return option;
    },
    setChartYaxis: function(option) {
        if (option.yAxis instanceof Array) {
            option.yAxis.forEach((item, index) => {
                option.yAxis[index].minInterval = 1;
            });
        } else if (option.yAxis instanceof Object) {
            option.yAxis.minInterval = 1;
        }
        return option;
    },
    setChartDataZoom: function(option) {
        let isYaxisCategory = false;
        if (option.yAxis instanceof Array) {
            isYaxisCategory = option.yAxis.some((yAxis) => yAxis.type == 'category');
        } else if (option.yAxis instanceof Object) {
            isYaxisCategory = option.yAxis.type == 'category';
        }

        if (!option.dataZoom && !isYaxisCategory) {
            let series = option.series;
            let chartType = '';
            let dataLen = 0;
            if (series instanceof Array) {
                chartType = series[0].type;
                dataLen = !!series[0].data ? series[0].data.length : 0;
            } else if (series instanceof Object) {
                chartType = series.type;
                dataLen = !!series.data ? series.data.length : 0;
            }

            if (['line', 'bar'].indexOf(chartType) != -1 && dataLen > 12) {
                option = Object.assign({}, option, {
                    dataZoom: [{
                        type: 'slider',
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    }, {
                        type: 'inside',
                        realtime: true,
                        start: 0,
                        end: 100
                    }]
                });
            }
        }

        return option;
    },
    clearChart: function(id) {
        let dom = document.getElementById(id);
        if (!dom) {
            return false;
        }
        let chart = echarts.getInstanceByDom(document.getElementById(id));
        !!chart && chart.clear();
        !!chart && chart.dispose();
        $('#' + id).empty();
    },
    fixChartOption: function(option) {
        if ($(document.body).attr('bigscreenmicrosoft') == 'true') {
            option.grid = !Utils.isEmpty(option.grid) ? Object.assign({}, option.grid, {
                top: '15%',
                bottom: '10%'
            }) : {
                top: '15%',
                bottom: '10%'
            };

            // fix xAxis nameGap
            if (option.xAxis instanceof Array) {
                option.xAxis.forEach((item, index) => {
                    option.xAxis[index].nameGap = 50;
                    if (option.xAxis[index].axisLabel instanceof Array) {
                        option.xAxis[index].axisLabel.forEach((innerItem, innerIndex) => {
                            option.xAxis[index].axisLabel[innerIndex].margin = 20;
                        });
                    } else if (option.xAxis[index].axisLabel instanceof Object) {
                        option.xAxis[index].axisLabel.margin = 20;
                    }
                });
            } else if (option.xAxis instanceof Object) {
                option.xAxis.nameGap = 50;
            }

            // fix yAxis nameGap
            if (option.yAxis instanceof Array) {
                option.yAxis.forEach((item, index) => {
                    option.yAxis[index].nameGap = 50;
                    option.yAxis[index].minInterval = 1;
                });
            } else if (option.yAxis instanceof Object) {
                option.yAxis.nameGap = 50;
                option.yAxis.minInterval = 1;
            }

            // fix lenged item size
            if (option.legend instanceof Array) {
                option.legend.forEach((item, index) => {
                    option.legend[index].itemWidth = 80;
                    option.legend[index].itemHeight = 60;
                });
            } else if (option.legend instanceof Object) {
                option.legend.itemWidth = 80;
                option.legend.itemHeight = 60;
            }
        }
        return Object.assign({}, option);
    },
    tooltip: function(tips) {
        $('#tooltipWrapper').removeClass('none');
        $('#tooltipContent').text(tips);
        setTimeout(function() {
            $('#tooltipWrapper').addClass('none');
        }, 1000);
    },
    handleScreenZoom: function() {
        let devicePixelRatio = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;
        let zoom = 1 / devicePixelRatio;
        let rootFontsize = Utils.getFontSize();

        // $('html').css('font-size', rootFontsize * zoom + 'px');
        $('html').css('font-size', rootFontsize + 'px');

        $('#body').css({
            width: Math.max(document.documentElement.clientWidth / zoom, 1366) + 'px',
            zoom: zoom,
            '-moz-transform': 'scale(' + zoom + ')',
            '-moz-transform-origin': '0 0'
        });
    },
    handleBigScreenDomHeight: function() {
        let bodyWidth = $(document.body).width();
        let screenType = Utils.getScreenType();
        $(document.body).attr(screenType, 'true');

        // 7680 * 2160(microsoft bigscreen: 3.56)
        if (Math.abs(bodyWidth - BIG_SCREEN_THRESHOLD_MISROSOFT) < 50) {
            aspectRatioBase = 0.73;
        }
        // 4096 * 2160(bigscreen: 1.89)
        if (Math.abs(bodyWidth - BIG_SCREEN_THRESHOLD) < 150) {
            aspectRatioBase = 0.85;
        }
        // 3840 * 2160(mytv: 1.78)、3852 * 1576(bigscreen: 2.44)
        if (Math.abs(bodyWidth - OLD_BIG_SCREEN_THRESHOLD) < 50 && Math.abs($(document.body).height() - HIGH_SCREEN_THRESHOLD) < 50) {
            aspectRatioBase = 0.85;
        }
        // 1920 * 1080(basescreen: 1.78)
        if (Math.abs(bodyWidth - 1920) < 50) {
            aspectRatioBase = 1.2;
        }
        // 1680 * 1050(1.6)
        if (Math.abs(bodyWidth - 1680) < 40) {
            aspectRatioBase = 1.36;
        }
        // 1600 * 900(1.78)
        if (Math.abs(bodyWidth - 1600) < 40) {
            aspectRatioBase = 1.195;
        }
        // 1440 * 900(1.6)
        if (Math.abs(bodyWidth - 1440) < 30) {
            aspectRatioBase = 1.36;
        }
        // 1366 * 768(1.78)
        if (Math.abs(bodyWidth - 1366) < 30) {
            aspectRatioBase = 1.21;
        }

        handleBigScreenDomHeight(aspectRatioBase);
    },
    isBigScreen: function() {
        return Math.abs($(document.body).width() - BIG_SCREEN_THRESHOLD) < 150;
    },
    isMiniScreen: function() {
        return Math.abs($(document.body).width() - 1366) < 30;
    },
    isMsBigScreen: function() {
        return $(document.body).attr('bigscreenmicrosoft') == 'true';
    },
    getScreenType: function() {
        let screenType = '';
        let bodyWidth = $(document.body).width();

        // 7680 * 2160(microsoft bigscreen: 3.56)
        if (Math.abs(bodyWidth - BIG_SCREEN_THRESHOLD_MISROSOFT) < 50) {
            screenType = 'bigscreenmicrosoft';
        }
        // 4096 * 2160(bigscreen: 1.89)
        if (Math.abs(bodyWidth - BIG_SCREEN_THRESHOLD) < 150) {
            screenType = 'bigscreen';
        }
        // 3840 * 2160(mytv: 1.78)、3852 * 1576(bigscreen: 2.44)
        if (Math.abs(bodyWidth - OLD_BIG_SCREEN_THRESHOLD) < 50 && Math.abs($(document.body).height() - HIGH_SCREEN_THRESHOLD) < 50) {
            screenType = 'highscreen';
        }
        // 1920 * 1080(basescreen: 1.78)
        if (Math.abs(bodyWidth - 1920) < 50) {
            screenType = 'basescreen';
        }
        // 1680 * 1050(1.6)
        if (Math.abs(bodyWidth - 1680) < 40) {
            screenType = 'highmediumscreen';
        }
        // 1600 * 900(1.78)
        if (Math.abs(bodyWidth - 1600) < 40) {
            screenType = 'mediumscreen';
        }
        // 1440 * 900(1.6)
        if (Math.abs(bodyWidth - 1440) < 30) {
            screenType = 'smallscreen';
        }
        // 1366 * 768(1.78)
        if (Math.abs(bodyWidth - 1366) < 30) {
            screenType = 'miniscreen';
        }

        let htmlClsAry = $('html').attr('class').split(' ');
        if (htmlClsAry.indexOf('ipad') != -1) {
            screenType = 'ipad';
        }
        return screenType;
    },
    zoom: function(val) {
        let bodyWidth = $(document.body).width();
        if (bodyWidth <= OLD_BIG_SCREEN_THRESHOLD - 100) {
            return val;
        }
        let ratio = bodyWidth / 1920;
        let ratioFix = val > 2 ? 1.1 : 1;
        let newVal = Math.round(val * ratio * ratioFix);
        return newVal;
    }
};

module.exports = Utils;