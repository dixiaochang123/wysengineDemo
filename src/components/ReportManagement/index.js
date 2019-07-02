// 报告管理 - 周报
import React from 'react';
import Moment from 'moment';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

import Navbar from 'subComponents/Navbar';
import Dropdown from 'subComponents/Dropdown';
import ExportBtn from 'subComponents/ExportBtn';
import ReportPanels from 'subComponents/ReportPanels';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class ReportManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 周报列表
            reports: [],
            // 当前年份
            year: Moment().format('YYYY'),
            // 可选年份
            years: [],
            // 可选年份数量
            yearCount: 10,
            // 选中的风场
            selectedWindsites: []
        };

        // 初始化数据
        this.initData = this.initData.bind(this);
        // 获取周报列表
        this.getReports = this.getReports.bind(this);
        // 跳转页面
        this.goToPage = this.goToPage.bind(this);
        // 改变年份
        this.handleYearChange = this.handleYearChange.bind(this);
        // 单选改变风场
        this.handleWindsiteChange = this.handleWindsiteChange.bind(this);
        // 单独选择一个选项
        this.handleItemSelect = this.handleItemSelect.bind(this);
    }
    componentWillMount() {
        this.initData();
        // 获取线上风场
        this.props.getWindsiteListOnline({});
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
        $(document.body).removeClass('btnLoading');
    }
    initData() {
        let yearCount = this.state.yearCount;
        let years = [];
        for (var i = 0; i < yearCount; i++) {
            let year = Moment().add(-i, 'year').format('YYYY');
            years.push({
                key: year,
                value: year + '年'
            });
        }
        this.setState({
            years: years
        });
        this.getReports();
    }
    getReports() {
        let hasAuth = User.hasAuth('report__query');
        if (!hasAuth) {
            return false;
        }
        let selectedWindsites = this.state.selectedWindsites || [];
        let selectedWindsiteCodes = selectedWindsites.map((item) => item.key);
        selectedWindsiteCodes = selectedWindsiteCodes.filter((item) => item != 'ALL');

        this.props.getWeeklyReportList({
            data: {
                REPORT_YEAR: this.state.year || Moment().format('YYYY'),
                PROJECTS: selectedWindsiteCodes.join(',')
            },
            success: function() {
                let weeklyReportList = this.props.weeklyReportList || [];
                let reports = weeklyReportList.map((item) => {
                    return Object.assign({}, item, {
                        id: item.ID,
                        time: '第' + item.REPORT_DATE + '周',
                        isSelected: false
                    });
                });
                this.setState({
                    reports: reports
                });
            }.bind(this)
        });
    }
    goToPage(pathname) {
        this.props.router.push({
            pathname: pathname
        });
    }
    handleYearChange(year) {
        this.setState({
            year: year.key
        }, function() {
            this.getReports();
        }.bind(this));
    }
    handleWindsiteChange(windsite) {
        let selectedWindsites = this.state.selectedWindsites || [];
        let selectedKeys = selectedWindsites.map((item) => item.key);

        if (windsite.key == 'ALL') {
            if (selectedWindsites.length == this.props.windsiteListOnline.length + 1) {
                selectedWindsites = [];
            } else {
                selectedWindsites = this.props.windsiteListOnline.map((item) => {
                    return {
                        key: item.CODE_,
                        value: item.NAME_
                    };
                });
                selectedWindsites.unshift({
                    key: 'ALL',
                    value: '所有风场'
                });
            }
        } else if (selectedKeys.indexOf(windsite.key) == -1) {
            selectedWindsites.push(windsite);
            selectedWindsites = selectedWindsites.filter((item) => item.key != 'ALL');
        } else {
            selectedWindsites.forEach((item, index) => {
                if (item.key == windsite.key) {
                    selectedWindsites.splice(index, 1);
                }
            });
            selectedWindsites = selectedWindsites.filter((item) => item.key != 'ALL');
        }

        this.setState({
            selectedWindsites: selectedWindsites
        }, function() {
            this.getReports();
        }.bind(this));
    }
    handleItemSelect(item) {
        let reports = this.state.reports || [];
        reports.forEach((report, index) => {
            reports[index].isSelected = report.ID == item.id ? !reports[index].isSelected : false;
        });

        this.setState({
            reports: reports
        });
    }
    render() {
        let reports = this.state.reports || [];
        let windsiteList = this.props.windsiteListOnline || [];
        let windsiteOptions = !!windsiteList && windsiteList.length > 0 ? windsiteList.map((item) => {
            return {
                key: item.CODE_,
                value: item.NAME_
            };
        }) : [];
        windsiteOptions.unshift({
            key: 'ALL',
            value: '全部风场'
        });

        let selectedReports = reports.filter((item) => item.isSelected == true) || [];
        let selectedIds = selectedReports.map((item) => item.ID).join(',');
        let selectedWindsiteKeys = this.state.selectedWindsites.map((item) => item.key);
        selectedWindsiteKeys = selectedWindsiteKeys.filter((item) => item != 'ALL');
        let formData = {
            formId: 'exportWeeklyReports',
            reportIds: selectedIds,
            PROJECTS: selectedWindsiteKeys.join(','),
            url: '/report/exportReport'
        };

        let selectedWindsitesText = this.state.selectedWindsites.length > 0 ? this.state.selectedWindsites.filter((windsite) => windsite.key != 'ALL').map((item) => item.value).join('、') : '全部风场';
        if (this.state.selectedWindsites.length == this.props.windsiteListOnline.length + 1) {
            selectedWindsitesText = '全部风场';
        }
        if (this.state.selectedWindsites.length == 0) {
            selectedWindsitesText = '无';
        }

        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                <div className='boxInner'>
                    <div className={style.boxInner} data-aspect-ratio={0.35}>
                        <div className='panel'>
                            <div className='panelHeader'>
                                <div className='panelTitle'>报告管理</div>
                            </div>
                            <div className={'panelBody ' + style.panelBody}>
                                <div className={style.header}>
                                    <div className={style.subTitle}>
                                        <a href='javascript:;' className={style.active}>周报</a>
                                        <a href='javascript:;' onClick={this.goToPage.bind(this, '/reportmanagementmonthly')}>月报</a>
                                        <a href='javascript:;' onClick={this.goToPage.bind(this, '/reportmanagementyear')}>年报</a>
                                        <Dropdown
                                            btnCls={style.dropdownTime}
                                            options={this.state.years}
                                            onSelect={this.handleYearChange} />
                                        <Dropdown
                                            btnCls={style.dropdownTime}
                                            isMultiple={true}
                                            options={windsiteOptions}
                                            selectedKeys={selectedWindsiteKeys}
                                            onSelect={this.handleWindsiteChange} />
                                        {!!selectedWindsitesText ?
                                        <div title={selectedWindsitesText} className={style.selectedWindsites}>{'已选风场：' + selectedWindsitesText}</div> : null}
                                    </div>
                                    <div className={reports.length > 0 ? style.exportBtn : 'none'}>
                                        <ExportBtn
                                            data={formData} />
                                    </div>
                                </div>
                                {reports.length > 0 ?
                                <ReportPanels
                                    reports={reports}
                                    onItemSelect={this.handleItemSelect} /> : <div className='dataEmpty'></div>}
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
        weeklyReportList: state.reports.weeklyReportList || [],
        windsiteListOnline: state.windsite.windsiteListOnline || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getWeeklyReportList: function({ data, before, after, success, fail }) {
            dispatch(actions.getWeeklyReportList({ data, before, after, success, fail }));
        },
        getWindsiteListOnline: function({ data, before, after, success, fail }) {
            dispatch(actions.getWindsiteListOnline({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ReportManagement);
