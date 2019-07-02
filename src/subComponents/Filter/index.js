import React from 'react';

import Moment from 'moment';
const ReactRedux = require('react-redux');

import actions from 'actions';
import Utils from 'utils/utils';
import Constant from 'constant/index';

import Dropdown from 'subComponents/Dropdown';
import Datebox from 'subComponents/Datebox';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

const DATE_FORMAT = 'YYYY-MM-DD';

class Filter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 属性筛选条件
            propsFilter: {},
            // 筛选条件
            filter: {
                time: 'year',
                startDate: '',
                endDate: '',
                area: {
                    id: '',
                    name: '全部'
                },
                windsite: {
                    code: '',
                    name: '全部'
                },
                status: {
                    id: '',
                    code: '',
                    name: '全部'
                },
                level: {
                    id: '',
                    code: '',
                    name: '全部'
                },
                unit: {
                    id: '',
                    code: '',
                    name: '全部'
                },
                machineType: {
                    id: '',
                    code: '',
                    name: '全部'
                },
                footerYear: {},
                footerMonth: {},
                number: ''
            },
            // 可选年
            years: [],
            // 可选月
            months: [],
            // 可选时间
            times: [{
                key: 'today',
                value: '今天'
            }, {
                key: 'week',
                value: '近一周'
            }, {
                key: 'month',
                value: '近一月'
            }, {
                key: 'year',
                value: '近一年'
            }],
            // 区域
            areas: [],
            // 风场
            windsites: [],
            // 预警状态
            status: [],
            // 预警等级
            levels: [],
            // 风机关联部件
            units: [],
            // 风机机型
            machineTypes: []
        };

        // 搜索
        this.search = this.search.bind(this);
        // 选择头部开始日期
        this.selectHeaderStartDate = this.selectHeaderStartDate.bind(this);
        // 选择头部结束日期
        this.selectHeaderEndDate = this.selectHeaderEndDate.bind(this);
        // 生成可选年份
        this.generateYears = this.generateYears.bind(this);
        // 生成可选月份
        this.generateMonths = this.generateMonths.bind(this);
        // 选择时间
        this.selectTime = this.selectTime.bind(this);
        // 选择日期
        this.selectArea = this.selectArea.bind(this);
        // 选择风场
        this.selectWindsite = this.selectWindsite.bind(this);
        // 选择状态
        this.selectStatus = this.selectStatus.bind(this);
        // 选择等级
        this.selectLevel = this.selectLevel.bind(this);
        // 选择关联部件
        this.selectUnit = this.selectUnit.bind(this);
        // 选择风机类型
        this.selectMachineType = this.selectMachineType.bind(this);
        // 处理预警编号变化
        this.handleNumberChange = this.handleNumberChange.bind(this);
        // 重置筛选条件
        this.resetFilter = this.resetFilter.bind(this);
        // 设置时间
        this.setTime = this.setTime.bind(this);
    }
    componentWillMount() {
        let hideItems = this.props.hideItems || [];
        if (hideItems.indexOf('footerTime') == -1) {
            this.generateYears();
            this.generateMonths(true);
        }

        // 获取预警状态
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'predictStatus'
            },
            success: function(res) {
                this.setState({
                    status: res.body || []
                });
            }.bind(this)
        });

        // 获取预警等级
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'predictLevel'
            },
            success: function(res) {
                this.setState({
                    levels: Constant.PROJECT != 'mingyang' ? res.body.filter((level) => ['四级', '五级'].indexOf(level.NAME) == -1) : (res.body || [])
                });
            }.bind(this)
        });

        // 获取风机关联部件
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'turbineComp'
            },
            success: function(res) {
                res.body.map(function(item) {
                    if(item.DESCRIPTION=='全局') {
                        res.body.unshift(item);
                    }
                })
                this.setState({
                    units: res.body || []
                });
            }.bind(this)
        });

        // 获取风机机型
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'turbineModel'
            },
            success: function(res) {
                this.setState({
                    machineTypes: res.body || []
                });
            }.bind(this)
        });
    }
    componentDidMount() {
        this.setState({
            renderDatebox: true
        });
    }
    componentWillReceiveProps() {
    // componentWillReceiveProps(nextProps) {
        // if (!!nextProps.filter && nextProps.filter != this.state.propsFilter) {
        //     let filter = this.state.filter;
        //     let nextPropsFitler = nextProps.filter;
        //     let nextPropsFilterKeys = Object.keys(nextPropsFitler);
        //     nextPropsFilterKeys.forEach(function(key) {
        //         if (nextPropsFitler[key] instanceof Array) {
        //             filter[key] = nextPropsFitler[key].slice(0);
        //         }
        //         if (nextPropsFitler[key] instanceof Object) {
        //             filter[key] = Object.assign({}, filter[key], nextPropsFitler[key]);
        //             if (key == 'status') {
        //                 filter[key].id = nextPropsFitler[key].ID;
        //                 filter[key].code = nextPropsFitler[key].CODE;
        //             }
        //         }
        //     });
        //     this.setState({
        //         filter: filter,
        //         propsFilter: nextProps.filter
        //     });
        // }
    }
    search() {
        !!this.props.onSearch && this.props.onSearch(this.state.filter);
    }
    selectHeaderStartDate(date) {
        let filter = this.state.filter;
        filter.startDate = date;
        this.setState({
            filter: filter
        }, function() {
            this.setTime();
        }.bind(this));
    }
    selectHeaderEndDate(date) {
        let filter = this.state.filter;
        filter.endDate = date;
        this.setState({
            filter: filter
        }, function() {
            this.setTime();
        }.bind(this));
    }
    generateYears() {
        let years = [];
        let filter = this.state.filter;
        for (let i = 0; i < 10; i++) {
            years.push({
                key: Moment().add(-i, 'year').format('YYYY'),
                value: Moment().add(-i, 'year').locale('zh-cn').format('YYYY年')
            });
        }
        filter.footerYear = years[0];
        this.setState({
            years: years,
            filter: filter
        });
    }
    generateMonths(isThisYear) {
        let months = [];
        let filter = this.state.filter;
        let count = isThisYear ? Moment().month() + 1 : 12;
        for (let i = 1; i <= count; i++) {
            months.push({
                key: Moment().month(i - 1).format('MM'),
                value: Moment().month(i - 1).locale('zh-cn').format('MM月')
            });
        }
        filter.footerMonth = months[months.length - 1];
        this.setState({
            months: months,
            filter: filter
        });
    }
    selectFooterYear(year) {
        let filter = this.state.filter;
        filter.footerYear = year;
        this.setState({
            filter: filter
        }, function() {
            let isThisYear = year.key == Moment().year();
            this.generateMonths(isThisYear);
        }.bind(this));
    }
    selectFooterMonth(month) {
        let filter = this.state.filter;
        filter.footerMonth = month;
        this.setState({
            filter: filter
        });
    }
    selectTime(item) {
        let filter = this.state.filter;
        filter.time = item.key;
        filter.endDate = Moment().format(DATE_FORMAT);
        if (filter.time == 'today') {
            filter.startDate = Moment().format(DATE_FORMAT);
        }
        if (filter.time == 'week') {
            filter.startDate = Moment().add(-7, 'day').format(DATE_FORMAT);
        }
        if (filter.time == 'month') {
            filter.startDate = Moment().add(-1, 'month').format(DATE_FORMAT);
        }
        if (filter.time == 'year') {
            filter.startDate = Moment().add(-1, 'year').format(DATE_FORMAT);
        }
        this.setState({
            filter: filter
        });
    }
    setTime() {
        let filter = this.state.filter;
        let now = Moment().format(DATE_FORMAT);
        let isNow = now == filter.endDate;
        filter.time = '';
        if (isNow && filter.startDate == now) {
            filter.time = 'today';
        }
        if (isNow && Moment(now, DATE_FORMAT).diff(Moment(filter.startDate), 'day') == 7) {
            filter.time = 'week';
        }
        if (isNow && Moment(now, DATE_FORMAT).diff(Moment(filter.startDate), 'month') == 1) {
            filter.time = 'month';
        }
        if (isNow && Moment(now, DATE_FORMAT).diff(Moment(filter.startDate), 'year') == 1) {
            filter.time = 'year';
        }
        this.setState({
            filter: filter
        });
    }
    selectArea(item) {
        let filter = this.state.filter;
        filter.area = Object.assign({}, {
            id: item.ID,
            name: item.NAME
        }, item);
        filter.windsite = {
            code: '',
            name: '全部'
        };
        this.setState({
            filter: filter
        }, function() {
            if (item.ID == '') {
                this.setState({
                    windsites: []
                });
            } else {
                this.props.getOnlineProjectListByArea({
                    data: {
                        AREA: item.CODE
                    },
                    success: function(res) {
                        this.setState({
                            windsites: res.body || []
                        });
                    }.bind(this)
                });
            }
        }.bind(this));
    }
    selectWindsite(item) {
        let filter = this.state.filter;
        filter.windsite = Object.assign({}, {
            code: item.CODE_,
            name: item.NAME_
        }, item);
        this.setState({
            filter: filter
        });
    }
    selectStatus(item) {
        let filter = this.state.filter;
        filter.status = Object.assign({}, {
            id: item.ID,
            code: item.CODE,
            name: item.NAME
        }, item);
        this.setState({
            filter: filter
        });
    }
    selectLevel(item) {
        let filter = this.state.filter;
        filter.level = Object.assign({}, {
            id: item.ID,
            code: item.CODE,
            name: item.NAME
        }, item);
        this.setState({
            filter: filter
        });
    }
    selectUnit(item) {
        let filter = this.state.filter;
        filter.unit = Object.assign({}, {
            id: item.ID,
            code: item.CODE,
            name: item.NAME
        }, item);
        this.setState({
            filter: filter
        });
    }
    selectMachineType(item) {
        let filter = this.state.filter;
        filter.machineType = Object.assign({}, {
            id: item.ID,
            code: item.CODE,
            name: item.NAME
        }, item);
        this.setState({
            filter: filter
        });
    }
    handleNumberChange(event) {
        let filter = this.state.filter;
        let val = event.target.value;
        if (isNaN(val)) {
            return false;
        }
        filter.number = val;
        this.setState({
            filter: filter
        });
    }
    resetFilter() {
        this.setState({
            filter: {
                time: 'year',
                startDate: '',
                endDate: '',
                area: {
                    id: '',
                    name: '全部'
                },
                windsite: {
                    code: '',
                    name: '全部'
                },
                status: {
                    id: '',
                    code: '',
                    name: '全部'
                },
                level: {
                    id: '',
                    code: '',
                    name: '全部'
                },
                unit: {
                    id: '',
                    code: '',
                    name: '全部'
                },
                machineType: {
                    id: '',
                    code: '',
                    name: '全部'
                },
                // footerYear: {},
                // footerMonth: {},
                number: ''
            }
        },function() {
            let filter = this.state.filter;
            filter.endDate = Moment().format(DATE_FORMAT);
            filter.startDate = Moment().add(-1, 'year').format(DATE_FORMAT);
            this.setState({
                windsites: []
            });
        }.bind(this));
    }
    render() {
        let filter = this.state.filter;
        let times = this.state.times.map(function(item, index) {
            return (
                <span key={'filterTime' + index} className={filter.time == item.key ? style.filter + ' ' + style.active : style.filter} onClick={this.selectTime.bind(this, item)}>{item.value}</span>
            );
        }.bind(this));
        let areaList = [{
            ID: '',
            NAME: '全部'
        }];
        if (!!this.props.areaList) {
            areaList = areaList.concat(this.props.areaList);
        }
        let areas = areaList.map(function(item, index) {
            return (
                <span key={'filterArea' + index} className={filter.area.id == item.ID ? style.filter + ' ' + style.active : style.filter} onClick={this.selectArea.bind(this, item)}>{item.NAME}</span>
            );
        }.bind(this));

        let windsiteList = [{
            CODE_: '',
            NAME_: '全部'
        }];
        if (!!this.state.windsites && this.state.windsites.length > 0) {
            windsiteList = windsiteList.concat(this.state.windsites);
        }
        let windsites = windsiteList.map(function(item, index) {
            return (
                <span key={'filterWindSite' + index} className={filter.windsite.code == item.CODE_ ? style.filter + ' ' + style.active : style.filter} onClick={this.selectWindsite.bind(this, item)}>{item.NAME_}</span>
            );
        }.bind(this));

        let statusList = [{
            ID: '',
            CODE: '',
            NAME: '全部'
        }];
        if (!!this.state.status && this.state.status.length > 0) {
            statusList = statusList.concat([], this.state.status);
        }
        let status = statusList.map(function(item, index) {
            return (
                <span key={'filterStatus' + index} className={filter.status.id == item.ID ? style.filter + ' ' + style.active : style.filter} onClick={this.selectStatus.bind(this, item)}>{item.NAME}</span>
            );
        }.bind(this));

        let levelList = [{
            ID: '',
            CODE: '',
            NAME: '全部'
        }];
        if (!!this.state.levels && this.state.levels.length > 0) {
            levelList = levelList.concat(this.state.levels);
        }
        let levels = levelList.map(function(item, index) {
            return (
                <span key={'filterLevel' + index} className={filter.level.id == item.ID ? style.filter + ' ' + style.active : style.filter} onClick={this.selectLevel.bind(this, item)}>{item.NAME}</span>
            );
        }.bind(this));

        let unitList1 = [{
            ID: '',
            CODE: '',
            NAME: '全部'
        }];
        if (!!this.state.units && this.state.units.length > 0) {
            unitList1 = unitList1.concat(this.state.units);
        }
        let unitList = Array.from(new Set(unitList1));
        let units = unitList.map(function(item, index) {
            return (
                <span key={'filterUnit' + index} className={filter.unit.id == item.ID ? style.filter + ' ' + style.active : style.filter} onClick={this.selectUnit.bind(this, item)}>{item.NAME}</span>
            );
        }.bind(this));

        let machineTypeList = [{
            ID: '',
            CODE: '',
            NAME: '全部'
        }];
        if (!!this.state.machineTypes && this.state.machineTypes.length > 0) {
            machineTypeList = machineTypeList.concat(this.state.machineTypes);
        }
        let machineTypes = machineTypeList.map(function(item, index) {
            return (
                <span key={'filterMachineType' + index} className={filter.machineType.id == item.ID ? style.filter + ' ' + style.active : style.filter} onClick={this.selectMachineType.bind(this, item)}>{item.NAME}</span>
            );
        }.bind(this));

        let boxStyle = {};
        let scrollbarStyle = {};
        let boxInnerStyle = {};
        let filtersStyle = {};
        if (!!this.props.size) {
            boxStyle = {
                width: this.props.size[0] + 'px',
                height: this.props.size[1] + 'px'
            };
            scrollbarStyle = {
                width: this.props.size[0] + 'px',
                height: (this.props.size[1] - 40) + 'px'
            };
            boxInnerStyle = {
                width: (parseInt(this.props.size[0]) + 20) + 'px',
                height: (this.props.size[1] - 40) + 'px'
            };
            filtersStyle = {
                width: (this.props.size[0] - 100) + 'px'
            };
        }
        let arrowStyle = {};
        if (!!this.props.arrowPos) {
            arrowStyle = Object.assign({}, this.props.arrowPos);
        }
        let hideItems = this.props.hideItems || [];
        let isMsBigScreen = $(document.body).attr('bigscreenmicrosoft') == 'true';
        let dateboxW = '7.5rem';
        let dateboxH = isMsBigScreen ? '2rem' : '1.5rem';

        let boxCls = style.box + ' clearfix';
        if (!!this.props.noBorder) {
            boxCls += (' ' + style.boxNoBorder);
        }
        if (!!this.props.showFilter) {
            boxCls += (' ' + style.boxShow);
        }

        let selectedFitler = [];
        if (!Utils.isEmpty(filter.area)) {
            selectedFitler.push({
                key: filter.area.CODE,
                value: filter.area.NAME
            });
        }
        if (!Utils.isEmpty(filter.windsite)) {
            selectedFitler.push({
                key: filter.windsite.CODE_,
                value: filter.windsite.NAME_
            });
        }
        if (!Utils.isEmpty(filter.status)) {
            selectedFitler.push({
                key: filter.status.CODE,
                value: filter.status.NAME
            });
        }
        if (!Utils.isEmpty(filter.level)) {
            selectedFitler.push({
                key: filter.level.CODE,
                value: filter.level.NAME
            });
        }
        if (!Utils.isEmpty(filter.machineType)) {
            selectedFitler.push({
                key: filter.machineType.CODE,
                value: filter.machineType.NAME
            });
        }
        if (!Utils.isEmpty(filter.unit)) {
            selectedFitler.push({
                key: filter.unit.CODE,
                value: filter.unit.NAME
            });
        }
        selectedFitler = selectedFitler.filter((item) => !!item.key);
        let selectedFitlerNodes = selectedFitler.map((item) => <span key={item.key} className={'left btn ' + style.selectedFilterLabel}>{item.value}</span>);
        let selectedFilterStyle = {};
        if (!!this.props.filterPos) {
            selectedFilterStyle = Object.assign({}, this.props.filterPos);
        }

        return (
            <div className={boxCls} style={!!this.props.showFilter ? boxStyle : {}}>
                {selectedFitler.length > 0 ?
                <div className={style.selectedFitler} style={selectedFilterStyle}>
                    <span className={'left ' + style.selectedFilterLabel + ' ' + style.selectedFilterLabelSpe}>筛选条件：</span>
                    <div className={'left clearfix ' + style.selectedFilterNodes}>
                        {selectedFitlerNodes}
                    </div>
                    <span className={'left btn ' + style.selectedFilterLabel + ' ' + style.selectedFilterLabelSpe} onClick={this.resetFilter}>清空筛选条件</span>
                </div> : null}
                <div className={this.props.showFilter ? '' : 'none'}>
                    <div className={style.boxArrow} style={arrowStyle}></div>
                    <div className={style.boxArrowAfter} style={arrowStyle}></div>
                    <div className={style.boxScrollbar} style={scrollbarStyle}>
                        <div className={style.boxInner} style={boxInnerStyle}>
                            <div className={hideItems.indexOf('headerTime') == -1 ? style.filterGroup : 'none'} data-type='headerTime'>
                                <span className={style.filterLabel}>时间选择：</span>
                                <div className={style.filters} style={filtersStyle}>
                                    {times}
                                    <div className={style.dateboxWrapper}>
                                        <Datebox
                                            id='filterStartDate'
                                            onSelect={this.selectHeaderStartDate}
                                            date={this.state.filter.startDate}
                                            boxStyle={this.props.boxStyle ? this.props.boxStyle : {width: dateboxW, height: dateboxH}} />
                                    </div>
                                    <div className={style.dateboxWrapper}>
                                        <Datebox
                                            id='filterEndDate'
                                            onSelect={this.selectHeaderEndDate}
                                            date={this.state.filter.endDate}
                                            boxStyle={this.props.boxStyle ? this.props.boxStyle : {width: dateboxW, height: dateboxH}} />
                                    </div>
                                </div>
                            </div>
                            <div className={hideItems.indexOf('area') == -1 ? style.filterGroup : 'none'} data-type='area'>
                                <span className={style.filterLabel}>区域选择：</span>
                                <div className={style.filters} style={filtersStyle}>
                                    {areas}
                                </div>
                            </div>
                            <div className={hideItems.indexOf('windSite') == -1 ? style.filterGroup : 'none'} data-type='windSite'>
                                <span className={style.filterLabel}>风场选择：</span>
                                <div className={style.filters} style={filtersStyle}>
                                    {windsites}
                                </div>
                            </div>
                            <div className={hideItems.indexOf('status') == -1 ? style.filterGroup : 'none'} data-type='status'>
                                <span className={style.filterLabel}>状态选择：</span>
                                <div className={style.filters} style={filtersStyle}>
                                    {status}
                                </div>
                            </div>
                            <div className={hideItems.indexOf('alarmLevel') == -1 ? style.filterGroup : 'none'} data-type='alarmLevel'>
                                <span className={style.filterLabel}>预警等级：</span>
                                <div className={style.filters} style={filtersStyle}>
                                    {levels}
                                </div>
                            </div>
                            <div className={hideItems.indexOf('unit') == -1 ? style.filterGroup : 'none'} data-type='unit'>
                                <span className={style.filterLabel}>关联部件：</span>
                                <div className={style.filters} style={filtersStyle}>
                                    {units}
                                </div>
                            </div>
                            <div className={hideItems.indexOf('machineType') == -1 ? style.filterGroup : 'none'} data-type='machineType'>
                                <span className={style.filterLabel}>机型选择：</span>
                                <div className={style.filters} style={filtersStyle}>
                                    {machineTypes}
                                </div>
                            </div>
                            <div className={hideItems.indexOf('footerTime') == -1 ? style.filterGroup : 'none'} data-type='footerTime'>
                                <span className={style.filterLabel}>时间选择：</span>
                                <div className={style.filters + ' clearfix'} style={filtersStyle}>
                                    <div className={style.footerYear + ' left'}>
                                        <Dropdown
                                            selectedItem={!!this.state.filter.footerYear ? this.state.filter.footerYear : this.state.years[0]}
                                            options={this.state.years}
                                            onSelect={this.selectFooterYear.bind(this)} />
                                    </div>
                                    <div className='left'>
                                        <Dropdown
                                            selectedItem={!!this.state.filter.footerMonth ? this.state.filter.footerMonth : this.state.months[0]}
                                            options={this.state.months}
                                            onSelect={this.selectFooterMonth.bind(this)} />
                                    </div>
                                </div>
                            </div>
                            <div className={hideItems.indexOf('number') == -1 ? style.filterGroup : 'none'} data-type='number'>
                                <span className={style.filterLabel}>预警编号：</span>
                                <div className={style.filters} style={filtersStyle}>
                                    <input type='text' value={this.state.filter.number} placeholder='请输入预警编号' className={style.filterInput} onChange={this.handleNumberChange} />
                                </div>
                            </div>
                            <div className='tc'>
                                <div className={style.btn + ' ' + style.search + ' ' + style.active} onClick={this.search}>查找</div>
                                <div className={style.btn + ' ' + style.rest} onClick={this.resetFilter}>重置</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        areaList: state.area.areaList || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getParameterByTypeCode: function({ data, before, after, success, fail }) {
            dispatch(actions.getParameterByTypeCode({ data, before, after, success, fail }));
        },
        getOnlineProjectListByArea: function({ data, before, after, success, fail }) {
            dispatch(actions.getOnlineProjectListByArea({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Filter);
