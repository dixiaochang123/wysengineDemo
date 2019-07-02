let Constant = {
    // wysengine project config
    // API_ROOT: 'http://wysenginewd1.chinacloudapp.cn:8080/docean',
    // PROJECT: 'wysengine',
    // PROJECT_NAME: '智擎风电智慧运维及预警分析平台',

    // mingyang dev project config
    // API_ROOT: 'http://mingyang7.chinanorth.cloudapp.chinacloudapi.cn:8080/docean',
    // PROJECT: 'mingyang',
    // PROJECT_NAME: '明阳智慧能源大数据应用系统',

    // mingyang dev project config
    // API_ROOT: 'http://mingyang6.chinanorth.cloudapp.chinacloudapi.cn:8080/docean',
    // PROJECT: 'mingyang',
    // PROJECT_NAME: '明阳智慧能源大数据应用系统',

    // mingyang production config
    // API_ROOT: 'http://10.0.10.40:8080/docean',
    API_ROOT: 'http://mingyang6.chinanorth.cloudapp.chinacloudapi.cn:9080/docean',
    // API_ROOT: 'http://mingyang6.chinanorth.cloudapp.chinacloudapi.cn:9080/doceantest',
    PROJECT: 'mingyang',
    PROJECT_NAME: '明阳智慧能源大数据应用系统',

    // xiehe project config
    // API_ROOT: 'http://surfing2.chinanorth.cloudapp.chinacloudapi.cn:8080/docean',
    // PROJECT: 'xiehe',
    // PROJECT_NAME: '智擎风电智慧运维及预警分析平台',

    AREA_COLORS: {
        '华东': '#007dd4',
        '华中': '#56ba8a',
        '华北': '#90caf9',
        '华南': '#cce198',
        '西北': '#ce93d8',
        '西南': '#90c31f',
        '东北': '#f29444'
    },

    WEATHER_TYPES: {
        '台风': 'typhoon',
        '暴雨': 'rainstorm',
        '暴雪': 'snowstorm',
        '寒潮': 'cold-wave1',
        '大风': 'gale',
        '沙尘暴': 'sand-storm',
        '高温': 'heat-wave',
        '干旱': 'drought',
        '雷电': 'lightning',
        '冰雹': 'hall',
        '霜冻': 'frost',
        '大雾': 'heavy-fog',
        '霾': 'haze1',
        '道路结冰': 'road-icing1',
        '寒冷': 'cold1',
        '灰霾': 'haze2',
        '雷雨大风': 'thunder-gust',
        '森林火险': 'wild-fire',
        '降温': 'cold-wave2',
        '道路冰雪': 'road-icing2',
        '干热风': 'DH-wind',
        '空气重污染': 'pollution',
        '低温': 'cold2'
    },
    WEATHER_LEVELS: {
        '蓝色': 'blue',
        '红色': 'red',
        '橙色': 'orange',
        '黄色': 'yellow',
        '白色': 'white'
    },
    KPI_NAME_MAP: {
        // 功率特性偏离
        '功率标准差': 'PPSD  ',
        // 功率曲线符合性
        '功率符合度': '          PCC(%)',
        // 时间可利用率
        '时间可利用率': '    TBA(%)',
        // 发电量可利用率
        '发电量可利用率': '        PBA(%)',
        // 平均检修间隔时间
        '平均检修间隔时间': 'MTBI(小时)',
        // 平均故障修复时间
        '平均故障修复时间': 'MTTR(小时)',
        // 平均无故障运行时间
        '平均无故障运行时间': '      MTBF(小时)',
        // 平均故障频次
        '平均故障频次': 'FTAF(次)',
        // 平均机组故障总耗时
        '平均机组故障总耗时': '   MTOTF(小时)',
        // 总故障次数
        '总故障次数': '       TFC(次)'
    },
    LEVEL_COLOR_MAP: {
        1: '#e56361',
        2: '#f29934',
        3: '#3f8eef',
        4: '#82b4f1',
        5: '#a1c6f3',
        '一级': '#e56361',
        '二级': '#f29934',
        '三级': '#3f8eef',
        '四级': '#82b4f1',
        '五级': '#a1c6f3',
        'level1': '#e56361',
        'level2': '#f29934',
        'level3': '#3f8eef',
        'level4': '#82b4f1',
        'level5': '#a1c6f3'
    },
    STATUS_COLOR_MAP: {
        '未审核': '#f29934',
        '已通过': '#408ef0',
        '未通过': '#e56361',
        '已推送': '#366fbb',
        '已完成': '#8ccc45',
        '已确认': '#bfbfbf'
    },
    STATUS_IMG_MAP: {
        '未审核': false,
        '已通过': true,
        '未通过': false,
        '已推送': true,
        '已完成': false,
        '已确认': true
    },
    THEME_MAP: {
        light: {
            emptyColor: '#ccc',
            textColor: '#707070',
            labelColor: '#a0a0a0',
            splitLineColor: '#e5e5e5',

            axisColor: '#bfbfbf',
            chartSplitLineColor: 'rgba(238,238,238,1)',
            chartTooltipBgColor: '#354255',
            chartYtextColor: '#a0a0a0',
            chartLevelColor: '#f8f8f8',
            chartBarGapColor: '#eef5fd',
            chartBarClickColor: '#b5b5b5'
        },
        dark: {
            emptyColor: '#ccc',
            textColor: '#b0b2ba',
            labelColor: '#717c9c',
            splitLineColor: '#2e365a',

            axisColor: '#717c9c',
            chartSplitLineColor: '#2e365a',
            chartTooltipBgColor: '#28406C',
            chartYtextColor: '#717c9c',
            chartLevelColor: '#1b2036',
            chartBarGapColor: '#2a3354',
            chartBarClickColor: '#626262'
        }
    }
};

module.exports = Constant;
