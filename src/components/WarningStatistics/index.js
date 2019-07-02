// 预警统计
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import Utils from 'utils/utils';
import User from 'utils/user';

import IconFan2 from 'images/warninginfordetails/wf2.png';
import IconMyse3 from 'images/myseimg/myse3.png';

// 大部件阴影部件——鼠标滑过
import IconFanCfgg from 'images/warninginfordetails/color_cfgg.png'; // 测风桅杆
import IconFanClx from 'images/warninginfordetails/color_clx.png'; // 齿轮箱
import IconFanClxsrqjfd from 'images/warninginfordetails/color_clxsrqjfd.png'; // 齿轮箱散热器及风道
import IconFanFdj from 'images/warninginfordetails/color_fdj.png'; // 发电机
import IconFanFdjsrqjfd from 'images/warninginfordetails/color_fdjsrqjfd.png'; // 发电机散热器及风道
import IconFanGszdq from 'images/warninginfordetails/color_gszdq.png'; // 高速制动器
import IconFanHzc from 'images/warninginfordetails/color_hzc.png'; // 后轴承
import IconFanJckzg from 'images/warninginfordetails/color_jckzg.png'; // 机舱控制柜
import IconFanLzq from 'images/warninginfordetails/color_lzq.png'; // 联轴器
import IconFanQzc from 'images/warninginfordetails/color_qzc.png'; // 前轴承
import IconFanTxzc from 'images/warninginfordetails/color_txzc.png'; // 弹性支承
import IconFanYyz from 'images/warninginfordetails/color_yyz.png'; // 液压站
import IconFanZz from 'images/warninginfordetails/color_zz.png'; // 主轴
import IconFanYp from 'images/warninginfordetails/color_yp.png'; // 叶片

// 大部件阴影部件1
import IconFanCfgg1 from 'images/warninginfordetails/color_cfgg1.png'; // 测风桅杆
import IconFanClx1 from 'images/warninginfordetails/color_clx1.png'; // 齿轮箱
import IconFanClxsrqjfd1 from 'images/warninginfordetails/color_clxsrqjfd1.png'; // 齿轮箱散热器及风道
import IconFanFdj1 from 'images/warninginfordetails/color_fdj1.png'; // 发电机
import IconFanFdjsrqjfd1 from 'images/warninginfordetails/color_fdjsrqjfd1.png'; // 发电机散热器及风道
import IconFanGszdq1 from 'images/warninginfordetails/color_gszdq1.png'; // 高速制动器
import IconFanHzc1 from 'images/warninginfordetails/color_hzc1.png'; // 后轴承
import IconFanJckzg1 from 'images/warninginfordetails/color_jckzg1.png'; // 机舱控制柜
import IconFanLzq1 from 'images/warninginfordetails/color_lzq1.png'; // 联轴器
import IconFanQzc1 from 'images/warninginfordetails/color_qzc1.png'; // 前轴承
import IconFanTxzc1 from 'images/warninginfordetails/color_txzc1.png'; // 弹性支承
import IconFanYyz1 from 'images/warninginfordetails/color_yyz1.png'; // 液压站
import IconFanZz1 from 'images/warninginfordetails/color_zz1.png'; // 主轴
import IconFanYp1 from 'images/warninginfordetails/color_yp1.png'; // 叶片

//MySe3 大部件阴影---鼠标滑过
import IconFanJcsrxt from 'images/myseimg/jcsrxt.png'; // 机舱散热系统
import IconFanJckzgxt from 'images/myseimg/jckzgxt.png'; // 机舱控制柜系统
import IconFanFdjxt from 'images/myseimg/fdjxt.png'; // 发电机系统
import IconFanClxxt from 'images/myseimg/clxxt.png'; // 齿轮箱系统
import IconFanYpxt from 'images/myseimg/ypxt.png'; // 叶片系统
import IconFanClxrhxt from 'images/myseimg/clxrhxt.png'; // 齿轮箱润滑系统
import IconFanYyxt from 'images/myseimg/Yyxt.png'; // 液压系统
import IconFanFdjslxt from 'images/myseimg/fdjslxt.png'; // 发电机水冷系统
import IconFanPhxt from 'images/myseimg/phxt.png'; // 偏航系统
import IconFanBjxt from 'images/myseimg/bjxt.png'; // 变桨系统

//MySe3 大部件点击---鼠标点击
import IconFanJcsrxt1 from 'images/myseimg/jcsrxt1.png'; // 机舱散热系统
import IconFanJckzgxt1 from 'images/myseimg/jckzgxt1.png'; // 机舱控制柜系统
import IconFanFdjxt1 from 'images/myseimg/fdjxt1.png'; // 发电机系统
import IconFanClxxt1 from 'images/myseimg/clxxt1.png'; // 齿轮箱系统
import IconFanYpxt1 from 'images/myseimg/ypxt1.png'; // 叶片系统
import IconFanClxrhxt1 from 'images/myseimg/clxrhxt1.png'; // 齿轮箱润滑系统
import IconFanYyxt1 from 'images/myseimg/Yyxt1.png'; // 液压系统
import IconFanFdjslxt1 from 'images/myseimg/fdjslxt1.png'; // 发电机水冷系统
import IconFanPhxt1 from 'images/myseimg/phxt1.png'; // 偏航系统
import IconFanBjxt1 from 'images/myseimg/bjxt1.png'; // 变桨系统


import Navbar from 'subComponents/Navbar';
import WarningStatisticsHead from 'subComponents/WarningStatisticsHead';
import WarningStatisticsChart1 from 'subComponents/WarningStatisticsChart1';
import Table from 'subComponents/Table';
import ChartWarningStatisticsLevel from 'subComponents/ChartWarningStatisticsLevel';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class WarningStatistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pager: {
                total: 1,
                pageSize: 6,
                currPage: 1
            },
            pager1: {
                total: 1,
                pageSize: 16,
                currPage: 1
            },
            totalRow: 16,
            chart4: true,
            clospartsImg: false,
            comp_related_name: '',
            compRelated: '',
            area: '',
            project: '',
            selected: '',
            selected1: '',
            time: 'year',
            notCompletes1: [],
            // 禁止
            ban: false,
            handleArrowBoxShow: false,
            yearAndmonth: '今年',
            isMySe3: false,
            turbine: '',
            NAME: ''
        };

        this.goToPage = this.goToPage.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageChange2 = this.handlePageChange2.bind(this);
        this.getStatisticsOverview = this.getStatisticsOverview.bind(this);
        this.getStatisticsSearch = this.getStatisticsSearch.bind(this);
        this.handleAreaChange = this.handleAreaChange.bind(this);
        this.handleMonth = this.handleMonth.bind(this);
        this.handleYear = this.handleYear.bind(this);
        // 点击区域事件
        this.onAreaOrWindsiteChange = this.onAreaOrWindsiteChange.bind(this);
        // 点击部件事件
        this.handleComponentChange = this.handleComponentChange.bind(this);
        // 点击表格事件
        this.handleItemClick = this.handleItemClick.bind(this);
        this.clospartsImg = this.clospartsImg.bind(this);
        this.screenWidth = this.screenWidth.bind(this);
        // 弹出框事件
        this.handleArrowBoxShow = this.handleArrowBoxShow.bind(this);
        // 蒙层
        this.handleMc = this.handleMc.bind(this);

        this.handleCfggChange = this.handleCfggChange.bind(this);
        this.handleJckzgChange = this.handleJckzgChange.bind(this);
        this.handleClxChange = this.handleClxChange.bind(this);
        this.handleClxsrqjfdChange = this.handleClxsrqjfdChange.bind(this);
        this.handleZzChange = this.handleZzChange.bind(this);
        this.handleQzcChange = this.handleQzcChange.bind(this);
        this.handleHzcChange = this.handleHzcChange.bind(this);
        this.handleYyzChange = this.handleYyzChange.bind(this);
        this.handleTxzcChange = this.handleTxzcChange.bind(this);
        this.handleGszdqChange = this.handleGszdqChange.bind(this);
        this.handleLzqChange = this.handleLzqChange.bind(this);
        this.handleFdjChange = this.handleFdjChange.bind(this);
        this.handleFdjsrqjfdChange = this.handleFdjsrqjfdChange.bind(this);
        this.handleYpChange = this.handleYpChange.bind(this);

        //MySe3 大部件事件
        this.handleYJcsrxtChange = this.handleYJcsrxtChange.bind(this);
        this.handleYJckzgxtChange = this.handleYJckzgxtChange.bind(this);
        this.handleYFdjxtChange = this.handleYFdjxtChange.bind(this);
        this.handleYClxChange = this.handleYClxChange.bind(this);
        this.handleYYpChange = this.handleYYpChange.bind(this);
        this.handleBjxtChange = this.handleBjxtChange.bind(this);
        this.handleFdjslxtChange = this.handleFdjslxtChange.bind(this);
        this.handlePhxtChange = this.handlePhxtChange.bind(this);
        this.handleYyxtChange = this.handleYyxtChange.bind(this);
        this.handleClxrhxtChange = this.handleClxrhxtChange.bind(this);
        //获取机型ID
        this.getParameterByTypeCode = this.getParameterByTypeCode.bind(this);

        // 选择下拉部件
        this.handlePartsInfo2 = this.handlePartsInfo2.bind(this);
        // 选择下拉全部部件
        this.handlePartsInfo1 = this.handlePartsInfo1.bind(this);
    }
    componentWillMount() {
        Utils.handleBigScreenDomHeight();
        let area = 2 || User.get('currentArea').CODE;
        let project = User.get('currentWindsite').CODE_ || '';

        if (!!project) {
            this.setState({
                chart4: false,
                project: project
            });
        }
        this.getStatisticsOverview(1, area, project, '', '');
        this.props.getParamTypeList({});

        this.props.getParameterByTypeCode({
            data: {
                CODE: 'turbineModel'
            }
        });

        // 明阳大屏
        let isBigScreen = $(document.body).attr('bigscreen') == 'true' ? true : false;
        // 微软大屏
        let isMsBigScreen = $(document.body).attr('bigscreenmicrosoft') == 'true' ? true : false;
        // 1360屏
        let isMiniScreen = $(document.body).attr('miniscreen') == 'true' ? true : false;
        if (!!isBigScreen) {
            let newPager = this.state.pager1;
            newPager.pageSize = 12
            this.setState({
                totalRow: 12,
                pager1: newPager
            });
        }
        if (!!isMsBigScreen) {
            let newPager1 = this.state.pager1;
            newPager1.pageSize = 9
            this.setState({
                totalRow: 9,
                pager1: newPager1
            });
        }
        if (!!isMiniScreen) {
            let newPager1 = this.state.pager1;
            newPager1.pageSize = 17
            this.setState({
                totalRow: 17,
                pager1: newPager1
            });
        }

        User.set('barClickColor1', {});

        let turbine_model = User.get('currentWindsite').TURBINE_MODEL || '';

        this.props.getParameterByTypeCode({
            data: {
                CODE: 'turbineModel'
            },
            success: function(res) {
                let arr = res.body || [];
                let dataList = arr.find(function(item) {
                    return item.ID == turbine_model
                })
                let NAME = !!dataList && !!dataList.NAME ? dataList.NAME : '';
                this.setState({
                    NAME: NAME
                })
            }.bind(this)
        });
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();

        Utils.handleScreenZoom(function() {
            Utils.handleBigScreenDomHeight();
        });
        this.screenWidth();
        $(window).resize(function() {
            this.screenWidth();
        }.bind(this));
    }
    handlePartsInfo1(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            handleArrowBoxShow: false
        });
        this.handleComponentChange();
    }
    handlePartsInfo2(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            handleArrowBoxShow: false
        });
    }
    handleMc() {
        this.setState({
            handleArrowBoxShow: false,
            ban: true
        });
    }
    handleArrowBoxShow() {
        this.setState({
            handleArrowBoxShow: true,
            ban: true
        });
    }
    handleItemClick(item) {
        this.props.router.push({
            pathname: '/warninginfordetails',
            state: {
                alarmId: !!item && !!item.ID ? item.ID : ''
            }
        });
    }

    getParameterByTypeCode(code, comp_related_name) {
        let project = User.get('currentWindsite').CODE_ || '';
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'turbineComp'
            },
            success: function(res) {
                let arr = res.body || [];
                let dataList = arr.find(function(item) {
                    return item.CODE == code
                })
                let ID = dataList.ID || '';
                let pager = this.state.pager1;
                pager.currPage = 1;
                this.setState({
                    comp_related_name: comp_related_name,
                    compRelated: ID,
                    pager1: pager
                })
                this.getStatisticsSearch(1, this.state.area || '', this.state.project || '', '', ID);
            }.bind(this)
        });
    }

    handleCfggChange() {
        let comp_related_name = '测风桅杆';
        this.getParameterByTypeCode('cefengweigan', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 测风桅杆
        $('#cfgg').addClass(style.cfgg).removeClass('none');
    }
    handleJckzgChange() {
        let comp_related_name = '机舱控制柜';
        this.getParameterByTypeCode('jicangkongzhigui', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 机舱控制柜
        $('#jckzg').addClass(style.jckzg).removeClass('none');
    }
    handleClxChange() {
        let comp_related_name = '齿轮箱';
        this.getParameterByTypeCode('chilunxiang', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 齿轮箱
        $('#clx').addClass(style.clx).removeClass('none');
    }
    handleClxsrqjfdChange() {
        let comp_related_name = '齿轮箱散热器及风道';
        this.getParameterByTypeCode('chilunxiangsanreqi', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 齿轮箱散热器及风道
        $('#clxsrqjfd').addClass(style.clxsrqjfd).removeClass('none');
    }
    handleZzChange() {
        let comp_related_name = '主轴';
        this.getParameterByTypeCode('zhuzhou', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 主轴
        $('#zz').addClass(style.zz).removeClass('none');
    }
    handleQzcChange() {
        let comp_related_name = '前轴承';
        this.getParameterByTypeCode('qianzhoucheng', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 前轴承
        $('#qzc').addClass(style.qzc).removeClass('none');
    }
    handleHzcChange() {
        let comp_related_name = '后轴承';
        this.getParameterByTypeCode('houzhoucheng', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 后轴承
        $('#hzc').addClass(style.hzc).removeClass('none');
    }
    handleYyzChange() {
        let comp_related_name = '液压站';
        this.getParameterByTypeCode('yeyazhan', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 液压站
        $('#yyz').addClass(style.yyz).removeClass('none');
    }
    handleTxzcChange() {
        let comp_related_name = '弹性支撑';
        this.getParameterByTypeCode('tanxingzhichi', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 弹性支撑
        $('#txzc').addClass(style.txzc).removeClass('none');
    }
    handleGszdqChange() {
        let comp_related_name = '高速制动器';
        this.getParameterByTypeCode('gaosuzhouzhidongqi', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 高速制动器
        $('#gszdq').addClass(style.gszdq).removeClass('none');
    }
    handleLzqChange() {
        let comp_related_name = '联轴器';
        this.getParameterByTypeCode('lianzhouqi', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 联轴器
        $('#lzq').addClass(style.lzq).removeClass('none');
    }
    handleFdjChange() {
        let comp_related_name = '发电机';
        this.getParameterByTypeCode('fadianji', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 发电机
        $('#fdj').addClass(style.fdj).removeClass('none');
    }
    handleFdjsrqjfdChange() {
        let comp_related_name = '发电机散热器及风道';
        this.getParameterByTypeCode('fadianjisanre', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 发电机散热器及风道r
        $('#fdjsrqjfd').addClass(style.fdjsrqjfd).removeClass('none');
    }
    handleYpChange() {
        let comp_related_name = '叶片';
        this.getParameterByTypeCode('yepian', comp_related_name);
        $('#wf').nextAll('img').addClass('none');
        // 叶片
        $('#yp').addClass(style.yp).removeClass('none');
    }

    //MySe3 大部件点击事件
    handleYJcsrxtChange() {
        let comp_related_name = '机舱散热系统';
        this.getParameterByTypeCode('jicangsanrexitong', comp_related_name);
        $('#wf1').nextAll('img').addClass('none');
        // 机舱散热系统
        $('#jcsrxt1').addClass(style.jcsrxt).removeClass('none');
    }
    handleYJckzgxtChange() {
        let comp_related_name = '机舱控制柜';
        this.getParameterByTypeCode('jicangkongzhigui', comp_related_name);
        $('#wf1').nextAll('img').addClass('none');
        // 机舱控制柜
        $('#jckzgxt1').addClass(style.jckzgxt).removeClass('none');
    }
    handleYFdjxtChange() {
        let comp_related_name = '发电机';
        this.getParameterByTypeCode('fadianji', comp_related_name);
        $('#wf1').nextAll('img').addClass('none');
        // 发电机
        $('#fdjxt1').addClass(style.fdjxt).removeClass('none');
    }
    handleYClxChange() {
        let comp_related_name = '齿轮箱';
        this.getParameterByTypeCode('chilunxiang', comp_related_name);
        $('#wf1').nextAll('img').addClass('none');
        // 齿轮箱
        $('#clxxt1').addClass(style.clxxt).removeClass('none');
    }
    handleYYpChange() {
        let comp_related_name = '叶片';
        this.getParameterByTypeCode('yepian', comp_related_name);
        $('#wf1').nextAll('img').addClass('none');
        // 叶片
        $('#ypxt1').addClass(style.ypxt).removeClass('none');
    }
    handleBjxtChange() {
        let comp_related_name = '变桨系统';
        this.getParameterByTypeCode('bianjiangxitong', comp_related_name);
        $('#wf1').nextAll('img').addClass('none');
        // 变桨系统
        $('#bjxt1').addClass(style.bjxt).removeClass('none');
    }
    handleFdjslxtChange() {
        let comp_related_name = '发电机水冷系统';
        this.getParameterByTypeCode('fadianjishuilengxitong', comp_related_name);
        $('#wf1').nextAll('img').addClass('none');
        // 机舱散热系统
        $('#fdjslxt1').addClass(style.fdjslxt).removeClass('none');
    }
    handlePhxtChange() {
        let comp_related_name = '偏航系统';
        this.getParameterByTypeCode('pianhangxitong', comp_related_name);
        $('#wf1').nextAll('img').addClass('none');
        // 机舱散热系统
        $('#phxt1').addClass(style.phxt).removeClass('none');
    }
    handleYyxtChange() {
        let comp_related_name = '液压系统';
        this.getParameterByTypeCode('yeyaxitong', comp_related_name);
        $('#wf1').nextAll('img').addClass('none');
        // 液压系统
        $('#yyxt1').addClass(style.yyxt).removeClass('none');
    }
    handleClxrhxtChange() {
        let comp_related_name = '齿轮箱润滑系统';
        this.getParameterByTypeCode('chilunxiangrunhuaxitong', comp_related_name);
        $('#wf1').nextAll('img').addClass('none');
        // 机舱散热系统
        $('#clxrhxt1').addClass(style.clxrhxt).removeClass('none');
    }

    onAreaOrWindsiteChange() {
        let pager = this.state.pager;
        let area = User.get('currentArea').CODE;
        let project = User.get('currentWindsite').CODE_ || '';
        let turbine_model = User.get('currentWindsite').TURBINE_MODEL || '';

        this.props.getParameterByTypeCode({
            data: {
                CODE: 'turbineModel'
            },
            success: function(res) {
                let arr = res.body || [];
                let dataList = arr.find(function(item) {
                    return item.ID == turbine_model
                })
                let NAME = !!dataList && !!dataList.NAME ? dataList.NAME : '';
                this.setState({
                    NAME: NAME
                })
            }.bind(this)
        });

        pager.currPage = 1;
        this.setState({
            area: area || '',
            project: project || '',
            chart4: !(!!project && project != ''),
            pager: pager,
            ban: false,
            turbine: '',
            NAME: ''
        });

        this.getStatisticsOverview(1, area, project);
        User.set('barClickColor1', {});
    }
    handleMonth() {
        this.setState({
            handleArrowBoxShow: false,
            yearAndmonth: '本月',
            ban: false
        });

        let area = User.get('currentArea').CODE || '';
        let project = User.get('currentWindsite').CODE_ || '';

        let selectedCode1 = !!this.props.statisticsOverview && !!this.props.statisticsOverview.areaList && !!this.props.statisticsOverview.areaList[0] && !!this.props.statisticsOverview.areaList[0].PROJECT ? this.props.statisticsOverview.areaList[0].PROJECT : '';
        let selectedCode2 = !!this.props.statisticsOverview && !!this.props.statisticsOverview.areaList && !!this.props.statisticsOverview.areaList[0] && !!this.props.statisticsOverview.areaList[0].TURBINE ? this.props.statisticsOverview.areaList[0].TURBINE : '';
        if (area == '' || area == null) {
            this.setState({
                selected: '',
                time: 'month'
            });
        }
        if (!!area && area != '') {
            this.setState({
                selected: selectedCode1 || '',
                time: 'month'
            });
        }
        if (!!area && !!project && !!this.state.selected) {
            this.setState({
                selected: selectedCode2 || '',
                time: 'month'
            });
        }
        this.getStatisticsOverview(1, area, project, this.state.selected, 'month');
    }
    handleYear() {
        this.setState({
            handleArrowBoxShow: false,
            yearAndmonth: '今年',
            ban: false
        });

        let area = User.get('currentArea').CODE || '';
        let project = User.get('currentWindsite').CODE_ || '';

        let selectedCode1 = !!this.props.statisticsOverview && !!this.props.statisticsOverview.areaList && !!this.props.statisticsOverview.areaList[0] && !!this.props.statisticsOverview.areaList[0].PROJECT ? this.props.statisticsOverview.areaList[0].PROJECT : '';
        let selectedCode2 = !!this.props.statisticsOverview && !!this.props.statisticsOverview.areaList && !!this.props.statisticsOverview.areaList[0] && !!this.props.statisticsOverview.areaList[0].TURBINE ? this.props.statisticsOverview.areaList[0].TURBINE : '';
        if (area == '' || area == null) {
            this.setState({
                selected: '',
                time: 'month'
            });
        }
        if (!!area && area != '') {
            this.setState({
                selected: selectedCode1 || '',
                time: 'month'
            });
        }
        if (!!area && !!project && !!this.state.selected) {
            this.setState({
                selected: selectedCode2 || '',
                time: 'month'
            });
        }

        this.getStatisticsOverview(1, area, project, this.state.selected, 'year');
    }
    goToPage(pathname) {
        this.props.router.push({
            pathname: pathname
        });
    }
    handlePageChange(currPage) {
        let currentArea = User.get('currentArea');
        let currentWindsite = User.get('currentWindsite');
        let area = this.state.area || (!!currentArea ? currentArea.CODE : '');
        let project = this.state.project || (!!currentWindsite ? currentWindsite.CODE_ : '');
        let selected = this.state.selected;

        if (area == selected) {
            area = ''
        }
        if (project == selected) {
            project = ''
        }

        let pager = this.state.pager;
        pager.currPage = currPage;
        this.setState({
            pager: pager,
            ban: true
        });
        this.getStatisticsOverview(currPage, area, project, selected, '');
    }
    handlePageChange2(currPage) {
        let pager = this.state.pager1;
        pager.currPage = currPage;
        this.setState({
            pager1: pager,
            ban: true
        });
        let area = !!this.state.area ? this.state.area : (User.get('currentArea').CODE || '');
        let project = !!this.state.project ? this.state.project : '';
        let time = !!this.state.time ? this.state.time : '';
        let compRelated = !!this.state.compRelated ? this.state.compRelated : '';
        this.getStatisticsSearch(currPage, area, project, time, compRelated);
    }
    getStatisticsSearch(currPage, area, project, time, compRelated) {
        let hasAuth = User.hasAuth('workbench__query');
        if (!hasAuth) {
            return false;
        }
        this.props.getStatisticsSearch({
            data: {
                currentPage: currPage || this.state.pager1.currPage,
                showCount: this.state.pager1.pageSize,
                AREA: area || '',
                PROJECT: project || '',
                TIME: time || 'year',
                COMP_RELATED: compRelated || '',
                turbine: this.state.turbine || ''
            },
            success: function() {
                let pager = this.state.pager1;
                pager.total = this.props.statisticsSearch.totalResult;
                this.setState({
                    pager1: pager
                });
            }.bind(this)
        });
    }
    getStatisticsOverview(currPage, area, project, selected, time) {
        let hasAuth = User.hasAuth('statistics__query');
        if (!hasAuth) {
            return false;
        }
        // if(!!area && !!project && !!selected) {
        //     this.setState({
        //         isMySe3: true
        //     })
        // } else {
        //     this.setState({
        //         isMySe3: false
        //     })
        // }
        this.props.getStatisticsOverview({
            data: {
                currentPage: currPage || this.state.pager.currPage,
                showCount: this.state.pager.pageSize,
                AREA: area || '',
                PROJECT: project || '',
                selected: selected || '',
                TIME: time || 'year'
            },
            success: function() {
                $(document.body).removeClass('btnLoading');
                let pager = this.state.pager;
                pager.total = this.props.statisticsOverview.areaListPage.totalResult;
                this.setState({
                    pager: pager
                });
            }.bind(this)
        });
    }
    screenWidth() {
        let screenWidth = window.innerWidth;
        let screenWidthNew = screenWidth / 1920;
        if (screenWidth == 1920) {
            $('#partsImg').css({
                zoom: 0.9
            });
        } else if (screenWidth > 3800 && screenWidth < 3840 || screenWidth == 3840) {
            $('#partsImg').css({
                zoom: 1.7
            });
        } else if (screenWidth > 3840 && screenWidth < 7000) {
            $('#partsImg').css({
                zoom: 1.5
            });
        } else if (screenWidth > 7000) {
            $('#partsImg').css({
                zoom: 2.4
            });
        } else {
            $('#partsImg').css({
                zoom: screenWidthNew
            });
        }
    }
    // 点击区域
    handleAreaChange(data) {
        console.log(data)
        let area1 = User.get('currentArea').CODE || '';
        let project1 = User.get('currentWindsite').CODE_ || '';

        var area = data.data.origin.AREA || '';
        var project = data.data.origin.PROJECT || '';
        var turbine = data.data.origin.TURBINE || '';
        var turbine_model = data.data.origin.TURBINE_MODEL || '';
        console.log(turbine_model)
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'turbineModel'
            },
            success: function(res) {
                // User.set('barClickColor1', {});
                console.log(res)
                let arr = res.body || [];
                let dataList = arr.find(function(item) {
                    return item.ID == turbine_model
                })
                let NAME = !!dataList && !!dataList.NAME ? dataList.NAME : '';
                console.log(NAME)
                this.setState({
                    NAME: NAME
                })
            }.bind(this)
        });

        let areaCode = !!this.state.project || !!project || !!turbine ? area1 || area : '';
        let selected = turbine || project || area;
        let projectCode = !!turbine ? project || this.state.project || project1 : '';

        if (area) {
            this.setState({
                area: area,
                selected: selected
            });
        }
        if (project) {
            this.setState({
                project: project,
                selected: selected
            });
        }
        if (turbine) {
            this.setState({
                selected: selected,
                turbine: turbine
            });
        } else {
            this.setState({
                turbine: ''
            });
        }
        let pager = this.state.pager;
        pager.currPage = 1;
        this.setState({
            pager: pager,
            ban: false
        });
        this.getStatisticsOverview(1, areaCode, projectCode, selected, 'year');
    }
    // 点击部件
    handleComponentChange(data) {
        let area2 = User.get('currentArea').CODE || '';
        this.setState({
            clospartsImg: true
        });
        let compRelated = !!data && !!data.data && !!data.data.origin ? data.data.origin.name : '';
        let comp_related = !!data && !!data.data && !!data.data.origin ? data.data.origin.COMP_RELATED : '';
        let time = this.state.time;
        let areaCode = !!area2 ? area2 : (this.state.area || '');
        this.setState({
            comp_related_name: compRelated,
            compRelated: comp_related
        });
        this.getStatisticsSearch(1, areaCode, this.state.project || '', time, comp_related);

        this.props.getNotCompleteComponent({
            success: function(res) {
                let notCompletes = !!res && !!res.body ? res.body : [];
                let notCompletes1 = notCompletes.map(function(key) {
                    return key.COMP_RELATED
                });
                this.props.getParameterByTypeCode({
                    data: {
                        CODE: 'turbineComp'
                    },
                    success: function(res) {
                        let arr = res.body || [];
                        notCompletes1.map(function(key) {
                            let dataList = arr.find(function(item) {
                                return item.ID == key
                            })
                            let CODE = dataList.CODE;
                            if (!!comp_related && comp_related == key && CODE == 'qianzhoucheng') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 前轴承
                                $('#qzc').addClass(style.qzc).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'zhuzhou') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 主轴
                                $('#zz').addClass(style.zz).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'houzhoucheng') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 后轴承
                                $('#hzc').addClass(style.hzc).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'yeyazhan') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 液压站
                                $('#yyz').addClass(style.yyz).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'tanxingzhichi') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 弹性支持
                                $('#txzc').addClass(style.txzc).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'chilunxiang') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 齿轮箱
                                $('#clx').addClass(style.clx).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'lianzhouqi') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 联轴器
                                $('#lzq').addClass(style.lzq).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'fadianji') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 发电机
                                $('#fdj').addClass(style.fdj).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'fadianjisanre') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 发电机散热器及风道
                                $('#fdjsrqjfd').addClass(style.fdjsrqjfd).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'cefengweigan') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 测风桅杆
                                $('#cfgg').addClass(style.cfgg).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'jicangkongzhigui') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 机舱控制柜
                                $('#jckzg').addClass(style.jckzg).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'gaosuzhouzhidongqi') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 高速轴制动器
                                $('#gszdq').addClass(style.gszdq).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'chilunxiangsanreqi') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 齿轮箱散热器及风道
                                $('#clxsrqjfd').addClass(style.clxsrqjfd).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'yepian') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 叶片
                                $('#yp').addClass(style.yp).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'jicangsanrexitong') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 机舱散热系统
                                $('#jcsrxt1').addClass(style.jcsrxt).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'bianjiangxitong') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 变桨系统
                                $('#bjxt1').addClass(style.bjxt).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'fadianjishuilengxitong') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 发电机水冷系统
                                $('#fdjslxt1').addClass(style.fdjslxt).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == '') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 偏航系统
                                $('#phxt1').addClass(style.phxt).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'yeyaxitong') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 液压系统
                                $('#yyxt1').addClass(style.yyxt).removeClass('none');
                            }
                            if (!!comp_related && comp_related == key && CODE == 'chilunxiangrunhuaxitong') {
                                // $('#wf').nextAll('img').addClass('none');
                                // 齿轮箱润滑系统
                                $('#clxrhxt1').addClass(style.yyxt).removeClass('none');
                            }

                        })

                    }.bind(this)
                });

            }.bind(this)
        });
    }
    clospartsImg() {
        // let clospartsImg = this.state.clospartsImg;
        let newPager = this.state.pager1;
        newPager.currPage = 1;

        $('#wf').nextAll('img').addClass('none');
        $('#wf1').nextAll('img').addClass('none');
        this.setState({
            clospartsImg: false,
            pager1: newPager
        });
    }
    render() {
        let statisticsOverview = this.props.statisticsOverview || {};
        let areaList = statisticsOverview.areaList || [];
        let compCountList = statisticsOverview.compCountList || [];
        let areaListPage = statisticsOverview.areaListPage || {};
        let pageData = areaListPage.pageData || [];
        let levelCountList = statisticsOverview.levelCountList || [];
        let modelCountList = statisticsOverview.modelCountList || [];
        let statisticsSearch = this.props.statisticsSearch || {};
        let pageData2 = statisticsSearch.pageData || [];

        let parameterCode = this.props.parameterCode || [];

        return (
            <div className={style.box} >
                <Navbar
                    props={this.props}
                    showAreaIcon={true}
                    onAreaOrWindsiteChange={this.onAreaOrWindsiteChange} />
                <div className='boxInner'>
                    <div className={style.boxInner}>
                        <div id='partsImg' className={this.state.clospartsImg  ? style.partsImg :'none'}>
                            <div id='partsImgLeft' className={this.state.NAME!='MySE3.0' ? style.partsImgLeft : ' none'}>
                                <img id='wf' src={IconFan2} className={style.wfParts} />
                                {/*<img id='wf' src={IconMyse3} className={style.wfParts} />*/}
                                <img id='cfgg' src={IconFanCfgg} className={'none'} />
                                <img id='cfgg1' src={IconFanCfgg1} className={'none'} />
                                <div
                                    className={style.infoCfgg}
                                    onClick={this.handleCfggChange}
                                    onMouseOver={function() {
                                        $('#cfgg1').addClass(style.cfgg).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#cfgg1').addClass('none')
                                    }.bind(this)}></div>
                                <img id='jckzg' src={IconFanJckzg} className={'none'} />
                                <img id='jckzg1' src={IconFanJckzg1} className={'none'} />
                                <div
                                    className={style.infoJckzg}
                                    onClick={this.handleJckzgChange}
                                    onMouseOver={function() {
                                        $('#jckzg1').addClass(style.jckzg).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#jckzg1').addClass('none')
                                    }.bind(this)}></div>
                                <img id='clx' src={IconFanClx} className={!!this.state.imgShow ? style.clx : 'none'} />
                                <img id='clx1' src={IconFanClx1} className={!!this.state.imgShow ? style.clx : 'none'} />
                                <div
                                    className={style.infoClx}
                                    onClick={this.handleClxChange}
                                    onMouseOver={function() {
                                        $('#clx1').addClass(style.clx).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#clx1').addClass('none')
                                    }.bind(this)}></div>
                                <img id='clxsrqjfd' src={IconFanClxsrqjfd} className={'none'} />
                                <img id='clxsrqjfd1' src={IconFanClxsrqjfd1} className={'none'} />
                                <div
                                    className={style.infoClxsrqjfd}
                                    onClick={this.handleClxsrqjfdChange}
                                    onMouseOver={function() {
                                        $('#clxsrqjfd1').addClass(style.clxsrqjfd).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#clxsrqjfd1').addClass('none')
                                    }.bind(this)}></div>
                                <img id='zz' src={IconFanZz} className={'none'} />
                                <img id='zz1' src={IconFanZz1} className={'none'} />
                                <div
                                    className={style.infoZz}
                                    onClick={this.handleZzChange}
                                    onMouseOver={function() {
                                        $('#zz1').addClass(style.zz).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#zz1').addClass('none')
                                    }.bind(this)}></div>
                                <img id='qzc' src={IconFanQzc} className={'none'} />
                                <img id='qzc1' src={IconFanQzc1} className={'none'} />
                                <div
                                    className={style.infoQzc}
                                    onClick={this.handleQzcChange}
                                    onMouseOver={function() {
                                        $('#qzc1').addClass(style.qzc).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#qzc1').addClass('none')
                                    }.bind(this)}></div>
                                <img id='hzc' src={IconFanHzc} className={'none'} />
                                <img id='hzc1' src={IconFanHzc1} className={'none'} />
                                <div
                                    className={style.infoHzc}
                                    onClick={this.handleHzcChange}
                                    onMouseOver={function() {
                                        $('#hzc1').addClass(style.hzc).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#hzc1').addClass('none')
                                    }.bind(this)}></div>
                                <img id='yyz' src={IconFanYyz} className={'none'} />
                                <img id='yyz1' src={IconFanYyz1} className={'none'} />
                                <div
                                    className={style.infoYyz}
                                    onClick={this.handleYyzChange}
                                    onMouseOver={function() {
                                        $('#yyz1').addClass(style.yyz).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#yyz1').addClass('none')
                                    }.bind(this)}></div>
                                <img id='txzc' src={IconFanTxzc} className={'none'} />
                                <img id='txzc1' src={IconFanTxzc1} className={'none'} />
                                <div
                                    className={style.infoTxzc}
                                    onClick={this.handleTxzcChange}
                                    onMouseOver={function() {
                                        $('#txzc1').addClass(style.txzc).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#txzc1').addClass('none')
                                    }.bind(this)}></div>
                                <img id='gszdq' src={IconFanGszdq} className={'none'} />
                                <img id='gszdq1' src={IconFanGszdq1} className={'none'} />
                                <div
                                    className={style.infoGszdq}
                                    onClick={this.handleGszdqChange}
                                    onMouseOver={function() {
                                        $('#gszdq1').addClass(style.gszdq).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#gszdq1').addClass('none')
                                    }.bind(this)}></div>
                                <img id='lzq' src={IconFanLzq} className={!!this.state.imgShow ? style.lzq : 'none'} />
                                <img id='lzq1' src={IconFanLzq1} className={!!this.state.imgShow ? style.lzq : 'none'} />
                                <div
                                    className={style.infoLzq}
                                    onClick={this.handleLzqChange}
                                    onMouseOver={function() {
                                        $('#lzq1').addClass(style.lzq).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#lzq1').addClass('none')
                                    }.bind(this)}></div>
                                <img id='fdj' src={IconFanFdj} className={'none'} />
                                <img id='fdj1' src={IconFanFdj1} className={'none'} />
                                <div
                                    className={style.infoFdj}
                                    onClick={this.handleFdjChange}
                                    onMouseOver={function() {
                                        $('#fdj1').addClass(style.fdj).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#fdj1').addClass('none')
                                    }.bind(this)}></div>
                                <img id='fdjsrqjfd' src={IconFanFdjsrqjfd} className={'none'} />
                                <img id='fdjsrqjfd1' src={IconFanFdjsrqjfd1} className={'none'} />
                                <div
                                    className={style.infoFdjsrqjfd}
                                    onClick={this.handleFdjsrqjfdChange}
                                    onMouseOver={function() {
                                        $('#fdjsrqjfd1').addClass(style.fdjsrqjfd).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#fdjsrqjfd1').addClass('none')
                                    }.bind(this)}></div>
                                <img id='yp' src={IconFanYp} className={'none'} />
                                <img id='yp1' src={IconFanYp1} className={'none'} />
                                <div
                                    className={style.infoYp}
                                    onClick={this.handleYpChange}
                                    onMouseOver={function() {
                                        $('#yp1').addClass(style.yp).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#yp1').addClass('none')
                                    }.bind(this)}></div>
                            </div>
                            <div id='partsImgLeft1' className={this.state.NAME=='MySE3.0' ? style.partsImgLeft1 : ' none'}>
                                <img id='wf1' src={IconMyse3} className={style.wfParts} />
                                <img id='jcsrxt' src={IconFanJcsrxt} className={'none'} />
                                <img id='jcsrxt1' src={IconFanJcsrxt1} className={'none'} />
                                <div
                                    className={style.infoJcsrxt}
                                    onClick={this.handleYJcsrxtChange}
                                    onMouseOver={function() {
                                        $('#jcsrxt').addClass(style.jcsrxt).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#jcsrxt').addClass('none')
                                    }.bind(this)}></div>
                                <img id='jckzgxt' src={IconFanJckzgxt} className={'none'} />
                                <img id='jckzgxt1' src={IconFanJckzgxt1} className={'none'} />
                                <div
                                    className={style.infoJckzgxt}
                                    onClick={this.handleYJckzgxtChange}
                                    onMouseOver={function() {
                                        $('#jckzgxt').addClass(style.jckzgxt).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#jckzgxt').addClass('none')
                                    }.bind(this)}></div>
                                <img id='fdjxt' src={IconFanFdjxt} className={'none'} />
                                <img id='fdjxt1' src={IconFanFdjxt1} className={'none'} />
                                <div
                                    className={style.infofdjxt}
                                    onClick={this.handleYFdjxtChange}
                                    onMouseOver={function() {
                                        $('#fdjxt').addClass(style.fdjxt).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#fdjxt').addClass('none')
                                    }.bind(this)}></div>
                                <img id='clxxt' src={IconFanClxxt} className={'none'} />
                                <img id='clxxt1' src={IconFanClxxt1} className={'none'} />
                                <div
                                    className={style.infoclxxt}
                                    onClick={this.handleYClxChange}
                                    onMouseOver={function() {
                                        $('#clxxt').addClass(style.clxxt).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#clxxt').addClass('none')
                                    }.bind(this)}></div>
                                <img id='ypxt' src={IconFanYpxt} className={'none'} />
                                <img id='ypxt1' src={IconFanYpxt1} className={'none'} />
                                <div
                                    className={style.infoypxt}
                                    onClick={this.handleYYpChange}
                                    onMouseOver={function() {
                                        $('#ypxt').addClass(style.ypxt).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#ypxt').addClass('none')
                                    }.bind(this)}></div>
                                <img id='bjxt' src={IconFanBjxt} className={'none'} />
                                <img id='bjxt1' src={IconFanBjxt1} className={'none'} />
                                <div
                                    className={style.infobjxt}
                                    onClick={this.handleBjxtChange}
                                    onMouseOver={function() {
                                        $('#bjxt').addClass(style.bjxt).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#bjxt').addClass('none')
                                    }.bind(this)}></div>
                                <img id='fdjslxt' src={IconFanFdjslxt} className={'none'} />
                                <img id='fdjslxt1' src={IconFanFdjslxt1} className={'none'} />
                                <div
                                    className={style.infofdjslxt}
                                    onClick={this.handleFdjslxtChange}
                                    onMouseOver={function() {
                                        $('#fdjslxt').addClass(style.fdjslxt).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#fdjslxt').addClass('none')
                                    }.bind(this)}></div>
                                <img id='phxt' src={IconFanPhxt} className={'none'} />
                                <img id='phxt1' src={IconFanPhxt1} className={'none'} />
                                <div
                                    className={style.infophxt}
                                    onClick={this.handlePhxtChange}
                                    onMouseOver={function() {
                                        $('#phxt').addClass(style.phxt).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#phxt').addClass('none')
                                    }.bind(this)}></div>
                                <img id='yyxt' src={IconFanYyxt} className={'none'} />
                                <img id='yyxt1' src={IconFanYyxt1} className={'none'} />
                                <div
                                    className={style.infoyyxt}
                                    onClick={this.handleYyxtChange}
                                    onMouseOver={function() {
                                        $('#yyxt').addClass(style.yyxt).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#yyxt').addClass('none')
                                    }.bind(this)}></div>
                                <img id='clxrhxt' src={IconFanClxrhxt} className={'none'} />
                                <img id='clxrhxt1' src={IconFanClxrhxt1} className={'none'} />
                                <div
                                    className={style.infoclxrhxt}
                                    onClick={this.handleClxrhxtChange}
                                    onMouseOver={function() {
                                        $('#clxrhxt').addClass(style.clxrhxt).removeClass('none');
                                    }.bind(this)}
                                    onMouseOut={function() {
                                        $('#clxrhxt').addClass('none')
                                    }.bind(this)}></div>
                            </div>
                            <div className={style.partsImgRight}>
                                <div className={' panel'}>
                                    <div className={style.panelHeader + ' panelHeader'}>
                                        <span className={style.partsInfo + ' panelTitle'} onClick={this.handleArrowBoxShow}>
                                            {!!this.state.comp_related_name ? this.state.comp_related_name : '全部部件'}一预警信息
                                            <div className={!!this.state.handleArrowBoxShow ? style.arrow_box1 +' '+ style.down+' '+ style.down1 : ' none'}>
                                                <p className={style.year} onClick={this.handlePartsInfo1}>全部部件</p>
                                                <p className={!!this.state.comp_related_name ? style.month : ' none'} onClick={this.handlePartsInfo2}>{!!this.state.comp_related_name ? this.state.comp_related_name : ''}</p>
                                            </div>
                                        </span>
                                        <span className="panelLink closeBtn" onClick={this.clospartsImg}></span>
                                    </div>
                                    <div className={!!this.state.handleArrowBoxShow ? style.mc : ' none'} onClick={this.handleMc}></div>
                                    <div className={style.tableParent1}>
                                        <Table
                                            tableId='predictUnitTable'
                                            table={pageData2}
                                            ths={['预警ID', '预警信息', '区域', '风场', '风机', '开始时间', '结束时间', '累计异常时间(小时)', '模型名称','备注', '类型', '等级']}
                                            keys={['ID', 'CONTENT', 'AREA_NAME', 'PROJECT_NAME', 'LOCATION_CODE', 'START_TIME', 'END_TIME', 'ADD_UP_TIME', 'PREDICT_MODEL_NAME', 'REMARK', 'MODEL_TYPE', 'LEVEL_NAME']}
                                            hasHeader={false}
                                            hasOrder={false}
                                            hasCheckbox={false}
                                            pager={this.state.pager1}
                                            totalRow={this.state.totalRow}
                                            onItemClick={this.handleItemClick}
                                            onPageChange={this.handlePageChange2}
                                            trAspectRatio={0.0500} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style.subTitle}>
                            <div className={style.subTitleLeft}>
                                <a href='javascript:;' onClick={this.handleArrowBoxShow}>预警统计分析 / {this.state.yearAndmonth}</a>
                                <a href='javascript:;' onClick={this.goToPage.bind(this, '/kpistatistics')}>KPI统计分析</a>
                                <div className={!!this.state.handleArrowBoxShow ? style.arrow_box +' '+ style.down+' '+ style.down1 : ' none'}>
                                    <p className={style.year} onClick={this.handleYear}>今年</p>
                                    <p className={style.month} onClick={this.handleMonth}>本月</p>
                                </div>
                            </div>
                        </div>
                        <div className={!!this.state.handleArrowBoxShow ? style.mc : ' none'} onClick={this.handleMc}></div>
                        {!!statisticsOverview ?
                        <WarningStatisticsHead
                            key='WarningStatisticsHead1'
                            statisticsOverview={statisticsOverview} /> : <div className='dataEmpty'></div>}
                        <div className={style.WarningStatisticsMain} data-aspect-ratio='0.1405' >
                            <div className={style.WarningStatisticsMainLeftParent}>
                                <div className='panel'>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>{!!this.state.chart4 ? '区域预警明细' : '风机预警明细'}</span>
                                    </div>
                                    {Utils.isEmpty(areaList) ? <div className='dataEmpty'></div> :
                                    <WarningStatisticsChart1
                                        id="warningStatisticsChart1Canvas"
                                        data={areaList}
                                        ban={this.state.ban}
                                        interval={'auto'}
                                        color={['#6acff9']}
                                        onAreaChange={this.handleAreaChange} />}
                                </div>
                            </div>
                            <div className={style.WarningStatisticsMainRightParent}>
                                <div className='panel'>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>部件预警明细</span>
                                        <span title='全部部件' className='panelLink linkBtn' onClick={this.handleComponentChange}></span>
                                    </div>
                                    {Utils.isEmpty(compCountList) ? <div className='dataEmpty'></div> :
                                    <WarningStatisticsChart1
                                        id="warningStatisticsChart2Canvas"
                                        data={compCountList}
                                        ban={this.state.ban}
                                        interval={'auto'}
                                        color={['#3f8eef','#3f8eef']}
                                        onComponentChange={this.handleComponentChange} />}
                                </div>
                            </div>
                        </div>
                        <div id='WarningStatisticsMain1' className={style.WarningStatisticsMain1} data-aspect-ratio='0.1405' >
                             <div className={style.WarningStatisticsTableParent}>
                                 <div className={style.WarningStatisticsTable}>
                                    <div className='panel'>
                                        <div className='panelHeader'>
                                            <span className='panelTitle'>预警列表</span>
                                        </div>
                                        {Utils.isEmpty(pageData) ? <div className='dataEmpty'></div> :
                                        <div className={style.tableParent}>
                                        <Table
                                            tableId='workbench'
                                            table={pageData}
                                            ths={['预警ID', '区域', '风场', '风机', '模型名称','预警信息', '类型', '关联部件', '等级']}
                                            keys={['ID', 'AREA_NAME', 'PROJECT_NAME', 'LOCATION_CODE', 'PREDICT_MODEL_NAME', 'CONTENT', 'MODEL_TYPE', 'COMP_RELATED_NAME','LEVEL_NAME']}
                                            hasHeader={false}
                                            hasOrder={false}
                                            totalRow={6}
                                            pager={this.state.pager}
                                            onPageChange={this.handlePageChange}
                                            onItemClick={this.handleItemClick}
                                            trAspectRatio={0.0305} />
                                        </div>}
                                     </div>
                                 </div>
                             </div>
                             <div className={!!this.state.chart4 ? style.WarningStatisticsChart4Parent : 'none'}>
                                 <div className='panel'>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>区域机型预警分布</span>
                                    </div>
                                    {Utils.isEmpty(modelCountList) ? <div className='dataEmpty'></div> :
                                    <WarningStatisticsChart1
                                        id="warningStatisticsChart3Canvas"
                                        data={modelCountList}
                                        ban={this.state.ban}
                                        interval={0}
                                        color={['rgb(53,179,232)', 'rgb(58,100,157)', 'rgb(89,189,153)']}
                                        parameterCode={parameterCode} />}
                                 </div>
                             </div>
                             <div className={!!this.state.chart4 ? style.chartRightParent : style.chartRightParent1}>
                                 <div className='panel'>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>区域预警等级分布</span>
                                    </div>
                                    {Utils.isEmpty(levelCountList) ? <div className='dataEmpty'></div> :
                                    <ChartWarningStatisticsLevel
                                        id='todayAlarmLevelInWorkbench1'
                                        data={levelCountList}
                                        ban={this.state.ban} />}
                                </div>
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
        statisticsOverview: state.alarms.statisticsOverview || {},
        statisticsSearch: state.alarms.statisticsSearch || {},
        areaList: state.area.areaList || [],
        notCompleteComponent: state.alarms.notCompleteComponent || {},
        paramTypeList: state.paramtype.paramTypeList || [],
        parameterCode: state.parameter.parameterCode || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getStatisticsOverview: function({
            data,
            before,
            after,
            success,
            fail
        }) {
            dispatch(actions.getStatisticsOverview({
                data,
                before,
                after,
                success,
                fail
            }));
        },
        getStatisticsSearch: function({
            data,
            before,
            after,
            success,
            fail
        }) {
            dispatch(actions.getStatisticsSearch({
                data,
                before,
                after,
                success,
                fail
            }));
        },
        getNotCompleteComponent: function({
            data,
            before,
            after,
            success,
            fail
        }) {
            dispatch(actions.getNotCompleteComponent({
                data,
                before,
                after,
                success,
                fail
            }));
        },
        getParamTypeList: function({
            data,
            before,
            after,
            success,
            fail
        }) {
            dispatch(actions.getParamTypeList({
                data,
                before,
                after,
                success,
                fail
            }));
        },
        getParameterByTypeCode: function({
            data,
            before,
            after,
            success,
            fail
        }) {
            dispatch(actions.getParameterByTypeCode({
                data,
                before,
                after,
                success,
                fail
            }));
        }
    };
};
module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(WarningStatistics);