// 工作平台
import React from 'react';
import Moment from 'moment';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

import Constant from 'constant/index';
import Modal from 'subComponents/Modal';
import Table from 'subComponents/Table';
import Turbine from 'subComponents/Turbine';
import Navbar from 'subComponents/Navbar';
import Filter from 'subComponents/Filter';
import Datebox from 'subComponents/Datebox';
import Confirm from 'subComponents/Confirm';
import Dropdown from 'subComponents/Dropdown';
import StatisticsCharts from 'subComponents/StatisticsCharts';
import ChartTodayAlarmLevel from 'subComponents/ChartTodayAlarmLevel';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class Workbench extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 当前展示的视图
            currView: 'list',
            // 当前编辑的预警信息
            editingAlarm: {},
            // 是否展示添加、编辑弹框
            showModal: false,
            // 是否展示审核弹框
            showApproveModal: false,
            // 获取正在修改的预警信息，加载事件太长防止多次点击
            isLoading: false,
            // 是否展示筛选框
            showFilter: false,
            // 筛选器弹框尺寸
            filterSize: [1200, 400],
            // 筛选条件
            filter: {},
            // 当前为激活状态的item的id
            activeItemId: !!this.props.location.state ? this.props.location.state.itemId : 'statisticsAlarm',
            activeIdNo: true,
            // 当前选中的item的子项目
            activeItemSub: !!this.props.location.state ? this.props.location.state.subItemName : '',
            // 表格分页
            pager: {
                // 总数据条数
                total: 1,
                // 当前页
                currPage: 1,
                // 每页尺寸
                pageSize: 12
            },
            // 添加预警时的临时保存对象
            form: {
                // 弹框表单标题
                title: '',
                // 表单有错
                err: '',
                // 区域
                area: {
                    key: '',
                    value: ''
                },
                // 风场
                windsite: {
                    key: '',
                    value: ''
                },
                // 风机
                turbine: {
                    key: '',
                    value: ''
                },
                // 预警模型
                model: {
                    key: '',
                    value: ''
                },
                // 预警信息
                info: '',
                // 风机关联部件
                unit: {
                    key: '',
                    value: ''
                },
                // 预警状态
                status: {
                    key: '',
                    value: ''
                },
                // 开始预警日期
                date: '',
                // 开始预警时间
                time: '',
                // 结束预警日期
                date1: '',
                // 结束预警时间
                time1: '',
                // 工单号
                workorder: ''
            },
            statisticsPlan: '',
            // 风场列表
            windsites: [],
            // 风机列表
            turbines: [],
            // 预警等级列表
            alarmLevels: [],
            // 预警状态列表
            alarmStatus: [],
            // 预警审核状态列表
            alarmApproveList: [],
            // 风机关联部件
            units: [],
            // 风机机型列表
            turbineModels: [],
            // 展示确认框
            showConfirm: false,
            // 预警审核状态
            approveStatus: {
                status: '',
                content: ''
            },
            flag: false,
            exportChange: false,
            // 机型概览
            turbineOverview: {},
            // 预警类型列表
            predictTypes: [],
            // 预警列表
            predictType: '全部'
        };

        // 通过区域、风场获取数据
        this.initDataByAreaOrWindsite = this.initDataByAreaOrWindsite.bind(this);
        // 导出
        this.exportFile = this.exportFile.bind(this);

        // 显示添加弹框
        this.showModal = this.showModal.bind(this);
        // 显示编辑弹框
        this.showEditModal = this.showEditModal.bind(this);
        // 关闭弹框
        this.closeModal = this.closeModal.bind(this);

        // 设置筛选条件弹框尺寸
        this.setFilterSize = this.setFilterSize.bind(this);
        // 显示、隐藏筛选条件弹框
        this.toggleFilter = this.toggleFilter.bind(this);

        // 按条件搜索预警列表
        this.getWorkbenchSearch = this.getWorkbenchSearch.bind(this);
        // 预警列表翻页回调
        this.handlePageChange = this.handlePageChange.bind(this);
        // 处理风机变化
        this.cleanErr = this.cleanErr.bind(this);
        // 清除表单
        this.cleanForm = this.cleanForm.bind(this);
        // 处理区域变化
        this.handleAreaChange = this.handleAreaChange.bind(this);
        // 处理风场变化
        this.handleWindsiteChange = this.handleWindsiteChange.bind(this);
        // 处理风机变化
        this.handleTurbineChange = this.handleTurbineChange.bind(this);
        // 处理预警信息变化
        this.handleInfoChange = this.handleInfoChange.bind(this);
        // 处理预警日期变化
        this.handleDateChange = this.handleDateChange.bind(this);
        // 处理预警时间变化
        this.handleTimeChange = this.handleTimeChange.bind(this);
        // 处理模型变化
        this.handleModelChange = this.handleModelChange.bind(this);
        // 处理风机关联部件变化
        this.handleUnitChange = this.handleUnitChange.bind(this);
        // 处理预警审核工单编号变化
        this.handleWorkorderChange = this.handleWorkorderChange.bind(this);

        // 创建预警
        this.createAlarm = this.createAlarm.bind(this);
        // 编辑预警
        this.modifyAlarm = this.modifyAlarm.bind(this);
        // 表单验证，返回表单数据是否可提交
        this.canSubmit = this.canSubmit.bind(this);
        // 查看预警详情
        this.viewDetail = this.viewDetail.bind(this);

        // 处理工作平台概览区跳转事件
        this.viewDetailByItem = this.viewDetailByItem.bind(this);
        // 获取筛选条件
        this.getFilter = this.getFilter.bind(this);
        // 按条件搜索预警列表
        this.searchAlarm = this.searchAlarm.bind(this);

        // 处理表格单条数据修改事件
        this.handleModify = this.handleModify.bind(this);
        // 处理表格单条数据审核事件
        this.handleApprove = this.handleApprove.bind(this);
        // 处理表格单条数据删除事件
        this.handleDelete = this.handleDelete.bind(this);

        // 删除预警
        this.deleteAlarm = this.deleteAlarm.bind(this);
        // 隐藏确认框
        this.hideConfirm = this.hideConfirm.bind(this);

        // 审核预警
        this.approveAlarm = this.approveAlarm.bind(this);
        // 预警审核状态
        this.handleApproveStatusChange = this.handleApproveStatusChange.bind(this);
        // 预警审核状态
        this.handleApproveContentChange = this.handleApproveContentChange.bind(this);
        // 关闭审核弹框
        this.closeApproveModal = this.closeApproveModal.bind(this);

        // 处理视图切换
        this.handleViewSwitch = this.handleViewSwitch.bind(this);
        // 获取机型概览
        this.getStaticByTurbineModel = this.getStaticByTurbineModel.bind(this);
        // 切换预警类型
        this.handlePredictTypeChange = this.handlePredictTypeChange.bind(this);

        // 今日预警等级分布点击事件
        this.todayChanges = this.todayChanges.bind(this);
    }
    componentWillMount() {
        Utils.handleBigScreenDomHeight();
        this.props.getParamTypeList({});

        // 获取预警审核状态列表
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'predictApproveCode'
            },
            success: function(res) {
                this.setState({
                    alarmApproveList: res.body || []
                });
            }.bind(this)
        });

        // 获取风机机型列表
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'turbineModel'
            },
            success: function(res) {
                this.setState({
                    turbineModels: res.body || []
                });
            }.bind(this)
        });

        // 获取预警类型列表
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'modelType2'
            },
            success: function(res) {
                this.setState({
                    predictTypes: res.body || []
                });
            }.bind(this)
        });

        // 获取风机关联部件列表
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'turbineComp'
            },
            success: function(res) {
                this.setState({
                    units: res.body || []
                });
            }.bind(this)
        });

        // 获取预警等级列表
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'predictLevel'
            },
            success: function(res) {
                this.setState({
                    alarmLevels: res.body || []
                }, function() {
                    // 获取预警状态列表
                    this.props.getParameterByTypeCode({
                        data: {
                            CODE: 'predictStatus'
                        },
                        success: function(innerRes) {
                            this.setState({
                                alarmStatus: innerRes.body || []
                            }, function() {
                                this.initDataByAreaOrWindsite(); // 通过区域、风场获取数据
                            }.bind(this));
                        }.bind(this)
                    });
                }.bind(this));
            }.bind(this)
        });

        // 获取预警模型列表
        this.props.getModelList({});
        User.set('barClickColor3', {});
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
        Utils.handleScreenZoom(function() {
            Utils.handleBigScreenDomHeight();
        });
    }
    
    initDataByAreaOrWindsite() {
        let hasAuth = User.hasAuth('workbench__query');
        if (!hasAuth) {
            return false;
        }
        let currentArea = User.get('currentArea') || '';
        let currentWindsite = User.get('currentWindsite') || '';
        let postData = {
            AREA: !!currentArea ? currentArea.CODE : '',
            PROJECT: !!currentWindsite ? currentWindsite.CODE_ : ''
        };
        // 获取工作平台概览
        this.props.getWorkbenchOverview({
            data: postData
        });
        // 获取工作平台预警等级
        this.props.getWorkbenchLevel({
            data: postData
        });
        // 获取机型概览
        this.getStaticByTurbineModel();

        let pager = this.state.pager;
        pager.currPage = 1;
        this.setState({
            pager: pager
        });

        let activeItemId = this.state.activeItemId ? this.state.activeItemId : (!!this.props.location.state ? this.props.location.state.itemId : 'statisticsAlarm');
        let activeItemSub = this.state.activeItemSub ? this.state.activeItemSub : (!!this.props.location.state ? this.props.location.state.subItemName : '');
        let filter = this.getFilter(activeItemId, activeItemSub);
        filter.area = currentArea;
        filter.windsite = currentWindsite;
        this.setState({
            filter: filter
        }, function() {
            this.getWorkbenchSearch(1, filter);
        }.bind(this));
    }
    getStaticByTurbineModel() {
        let currentArea = User.get('currentArea') || '';
        let currentWindsite = User.get('currentWindsite') || '';
        let postData = {
            AREA: !!currentArea ? currentArea.CODE : '',
            PROJECT: !!currentWindsite ? currentWindsite.CODE_ : ''
        };
        this.props.getStaticByTurbineModel({
            data: postData,
            success: function(res) {
                this.setState({
                    turbineOverview: !!res.body ? res.body : {}
                });
            }.bind(this)
        });
    }
    exportFile() {
        let hasAuth = User.hasAuth('workbench__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportWorkbench');
        form.submit();
    }
    getFilter(itemId, itemSub) {
        let level = '';
        let status = '';

        if (itemId == 'statisticsAlarm' && !!itemSub && ['一级', '二级', '三级', '四级', '五级'].indexOf(itemSub) != -1) {
            level = this.state.alarmLevels.find((item) => item.NAME == itemSub);
        }
        if (itemId == 'statisticsAlarm') {
            let targetStatus = this.state.alarmStatus.filter((item) => ['已推送', '未审核'].indexOf(item.NAME) != -1) || [];
            status = Object.assign({}, {
                ID: targetStatus.map((item) => item.ID).join(',')
            });
        }

        if (itemId == 'statisticsTech' && !itemSub) {
            let targetStatus = this.state.alarmStatus.filter((item) => ['未审核', '已通过', '未通过'].indexOf(item.NAME) != -1) || [];
            status = Object.assign({}, {
                ID: targetStatus.map((item) => item.ID).join(',')
            });
        }
        if (itemId == 'statisticsTech' && itemSub == '已通过') {
            let targetStatus = this.state.alarmStatus.filter((item) => ['已通过', '已推送', '已完成', '已确认'].indexOf(item.NAME) != -1) || [];
            status = Object.assign({}, {
                ID: targetStatus.map((item) => item.ID).join(',')
            });
        }
        if (itemId == 'statisticsTech' && itemSub && itemSub != '已通过') {
            let targetStatus = this.state.alarmStatus.filter((item) => [itemSub].indexOf(item.NAME) != -1) || [];
            status = Object.assign({}, {
                ID: targetStatus.map((item) => item.ID).join(',')
            });
        }
        if (itemId == 'statisticsPlan' && !itemSub) {
            let targetStatus = this.state.alarmStatus.filter((item) => ['已推送', '已完成'].indexOf(item.NAME) != -1) || [];
            status = Object.assign({}, {
                ID: targetStatus.map((item) => item.ID).join(',')
            });
        }
        if (itemId == 'statisticsPlan' && itemSub) {
            let targetStatus = this.state.alarmStatus.filter((item) => [itemSub].indexOf(item.NAME) != -1) || [];
            status = Object.assign({}, {
                ID: targetStatus.map((item) => item.ID).join(',')
            });
        }


        let filter = {
            level: !!level ? level : '',
            status: !!status ? status : ''
        };

        if(itemId=='statisticsPlan') {
            this.setState({
                statisticsPlan: 'statisticsPlan'
            })
        } else {
            this.setState({
                statisticsPlan: ''
            })
        }
        return filter;
    }
    getWorkbenchSearch(currPage, filter) {
        let hasAuth = User.hasAuth('workbench__query');
        if (!hasAuth) {
            return false;
        }
        let pager = this.state.pager;
        let currentArea = User.get('currentArea') || '';
        let currentWindsite = User.get('currentWindsite') || '';
        filter = !!filter ? Object.assign({}, this.state.filter, filter) : Object.assign({}, this.state.filter);
        let postData = {
            AREA: !!filter && !!filter.area ? filter.area.CODE : (!!currentArea ? currentArea.CODE : ''),
            PROJECT: !!filter && !!filter.windsite ? filter.windsite.CODE_ : (!!currentWindsite ? currentWindsite.CODE_ : ''),
            currentPage: currPage || pager.currPage || 1,
            showCount: pager.pageSize
        };
        let newPostData = Object.assign({}, postData, {
            TIME: !!filter && !!filter.time ? filter.time : 'year',
            START: !!filter && !!filter.startDate ? filter.startDate : '',
            END: !!filter && !!filter.endDate ? filter.endDate : '',
            STATUS: !!filter && !!filter.status ? filter.status.ID : '',
            LEVEL: !!filter && !!filter.level ? filter.level.ID : '',
            COMP_RELATED: !!filter && !!filter.unit ? filter.unit.ID : '',
            ID: !!filter && !!filter.number ? filter.number : ''
        });

        let currPredictType = this.state.predictType;
        if (!!currPredictType && currPredictType != '全部') {
            let targetPredictType = this.state.predictTypes.find((item) => item.NAME == currPredictType);
            newPostData.MODEL_TYPE = targetPredictType.ID;
        }

        if (!!filter && !!filter.startDate && !!filter.endDate) {
            newPostData.TIME = '';
        }
        this.props.getWorkbenchSearch({
            data: newPostData,
            success: function(res) {
                $(document.body).removeClass('btnLoading');
                pager.total = res.body.totalResult;
                this.setState({
                    alarms: res.body.pageData || [],
                    pager: pager
                });
            }.bind(this)
        });
    }
    viewDetailByItem(id, subItem) {
        let pager = this.state.pager;
        let filter = this.getFilter(id, subItem);
        pager.currPage = 1;

        this.setState({
            pager: pager,
            filter: filter,
            activeItemId: id,
            activeIdNo: true,
            activeItemSub: subItem,
            flag: true
        }, function() {
            this.getWorkbenchSearch(1, filter);
        }.bind(this));
    }
    todayChanges() {
        this.setState({
            activeIdNo: false,
            activeItemId: 'sssss'
        },function() {

            //获取当前时间
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            let nowDate = year + "-" + month + "-" + day;
            let pager = this.state.pager;
            this.props.getWorkbenchSearch({
                data: {
                    currentPage: 1,
                    showCount: pager.pageSize,
                    TIME: '',
                    START: '',
                    ID: '',
                    START: nowDate,
                    END: nowDate
                }, success: function(res) {
                    pager.total = res.body.totalResult;
                    this.setState({
                        alarms: res.body.pageData || [],
                        pager: pager
                    });
                }.bind(this)
            });
        }.bind(this))
    }
    searchAlarm(filter) {
        let pager = this.state.pager;
        pager.currPage = 1;
        this.setState({
            filter: filter,
            showFilter: false,
            flag: false
        }, function() {
            this.getWorkbenchSearch(pager.currPage, filter);
        }.bind(this));
    }
    handlePageChange(currPage) {
        let pager = this.state.pager;
        pager.currPage = currPage;
        this.setState({
            pager: pager
        });
        let flag = this.state.flag;
        let filter1 = this.getFilter(this.state.activeItemId, this.state.activeItemSub);
        let filter2 = this.state.filter;
        let filter = !!flag ? filter1 : filter2;
        this.getWorkbenchSearch(currPage, filter);
    }
    handleModify(item) {
        if (this.state.isLoading) {
            return false;
        }
        let formDate = Moment(item.PREDICT_DATE).format('YYYY-MM-DD');
        let formTime = Moment(item.PREDICT_DATE).format('HH:mm:ss');

        let form = {
            err: '',
            area: {
                key: item.AREA,
                value: item.AREA_NAME
            },
            windsite: {
                key: item.PROJECT,
                value: item.PROJECT_NAME
            },
            turbine: {
                key: item.TURBINE,
                value: item.LOCATION_CODE
            },
            model: {
                key: item.PREDICT_MODEL,
                value: item.PREDICT_MODEL_NAME
            },
            info: item.CONTENT,
            unit: {
                key: item.COMP_RELATED,
                value: item.COMP_RELATED_NAME
            },
            status: {
                key: item.STATUS,
                value: item.STATUS_NAME
            },
            date: formDate,
            time: formTime,
            workorder: item.TICKET_ID
        };
        $('#alarmDatebox input').val(formDate);
        $('#alarmTimebox input').val(formTime);

        let targetArea = this.props.areaList.find((item) => {
            return item.CODE == form.area.key;
        });
        form.area = Object.assign({}, targetArea, form.area);

        // 获取区域风场
        this.handleAreaChange(form.area, function() {
            this.setState({
                isLoading: true
            });
            let targetWindsite = this.state.windsites.find((windsiteItem) => {
                return windsiteItem.CODE_ == form.windsite.key;
            });
            form.windsite = Object.assign({}, targetWindsite, form.windsite);
            // 获取风场风机
            this.handleWindsiteChange(form.windsite, function() {
                let targetTurbine = this.state.turbines.find((item) => {
                    return item.CODE_ == form.turbine.key;
                });
                form.turbine = Object.assign({}, targetTurbine, form.turbine);
                this.setState({
                    form: form,
                    editingAlarm: item
                }, function() {
                    this.setState({
                        isLoading: false
                    });
                    this.showEditModal();
                    let pager = this.state.pager;
                    this.getWorkbenchSearch(pager.currPage);
                }.bind(this));
            }.bind(this));
        }.bind(this));
    }
    handleApprove(item) {
        let hasAuth = User.hasAuth('workbench__approve');
        if (!hasAuth) {
            return false;
        }
        let alarmApproveList = this.state.alarmApproveList;
        let targetStatus = alarmApproveList.find((status) => status.NAME == item.APPROVE_CODE_NAME);
        this.setState({
            editingAlarm: item,
            approveStatus: {
                status: !!targetStatus ? targetStatus.CODE : '',
                content: !!targetStatus ? targetStatus.NAME : ''
            },
            showApproveModal: true
        });
    }
    handleDelete(item) {
        let hasAuth = User.hasAuth('workbench__delete');
        if (!hasAuth) {
            return false;
        }
        this.setState({
            showConfirm: true,
            editingAlarm: item
        });
    }
    hideConfirm() {
        this.setState({
            editingAlarm: {},
            showConfirm: false
        });
    }
    deleteAlarm() {
        let editingAlarm = this.state.editingAlarm;
        this.props.removePredict({
            data: {
                ID: editingAlarm.ID
            },
            success: function() {
                this.hideConfirm();
                this.getWorkbenchSearch(this.state.pager.currPage);
            }.bind(this)
        });
    }
    showModal() {
        let hasAuth = User.hasAuth('workbench__add');
        if (!hasAuth) {
            return false;
        }
        this.cleanForm();
        this.setState({
            showModal: true
        });
    }
    showEditModal() {
        let hasAuth = User.hasAuth('workbench__edit');
        if (!hasAuth) {
            return false;
        }
        let form = this.state.form;
        form.title = '编辑预警信息';
        this.setState({
            showModal: true,
            form: form
        });
    }
    approveAlarm() {
        let approveStatus = this.state.approveStatus;
        let editingAlarm = this.state.editingAlarm;
        let targetApprove = this.state.alarmApproveList.find((approve) => approve.NAME == approveStatus.NAME);
        let targetStatus = this.state.alarmStatus.find((status) => status.ID == editingAlarm.STATUS);

        if (approveStatus.status == '') {
            Utils.tooltip('请勾选审核意见');
            return false;
        }
        if (approveStatus.content == '') {
            Utils.tooltip('请填写审核意见');
            return false;
        }
        if (approveStatus.status == 'predictApprovePass' && !editingAlarm.TICKET_ID) {
            Utils.tooltip('请填写工单编号');
            return false;
        }
        if (approveStatus.status == 'predictApprovePass' && editingAlarm.TICKET_ID && isNaN(editingAlarm.TICKET_ID)) {
            Utils.tooltip('工单编号只能为数字');
            return false;
        }

        let postData = {
            ID: editingAlarm.ID,
            TICKET_ID: editingAlarm.TICKET_ID,
            STATUS: targetStatus.CODE,
            APPROVE_CODE: targetApprove.CODE,
            APPROVE_DESC: approveStatus.content
        };
        this.props.getWorkbenchApprove({
            data: postData,
            success: function() {
                Utils.tooltip('审核成功');
                setTimeout(function() {
                    this.setState({
                        editingAlarm: {},
                        approveStatus: {
                            status: '',
                            content: ''
                        }
                    });
                    this.closeApproveModal();
                    let pager = this.state.pager;
                    this.getWorkbenchSearch(pager.currPage);
                }.bind(this), 1000);
            }.bind(this)
        });
    }
    handleApproveStatusChange(item) {
        let approveStatus = this.state.approveStatus;
        approveStatus.status = item.CODE;
        this.setState({
            approveStatus: Object.assign({}, approveStatus, item)
        });
    }
    handleApproveContentChange(event) {
        let approveStatus = this.state.approveStatus;
        approveStatus.content = event.target.value;
        this.setState({
            approveStatus: approveStatus
        });
    }
    closeApproveModal() {
        this.setState({
            showApproveModal: false
        });
    }
    closeModal() {
        this.setState({
            showModal: false
        });
    }
    handleAreaChange(area, success) {
        let form = this.state.form;
        let targetArea = this.props.areaList.find((item) => {
            return item.CODE == area.key;
        });
        form.area = Object.assign({}, targetArea, area);
        form.windsite = {
            key: null,
            value: '不选择'
        };
        form.turbine = {
            key: null,
            value: '不选择'
        };
        this.setState({
            form: form,
            turbines: []
        }, function() {
            this.props.getOnlineProjectListByArea({
                data: {
                    AREA: area.key
                },
                success: function(res) {
                    this.setState({
                        windsites: res.body || []
                    }, function() {
                        !!success && success();
                    }.bind(this));
                }.bind(this)
            });
        }.bind(this));
    }
    handleWindsiteChange(windsite, success) {
        let form = this.state.form;
        let targetWindsite = this.state.windsites.find((item) => {
            return item.CODE_ == windsite.key;
        });
        form.windsite = Object.assign({}, targetWindsite, windsite);
        form.turbine = {
            key: null,
            value: '不选择'
        };
        this.setState({
            form: form
        }, function() {
            this.props.getTurbineListByProject({
                data: {
                    FARM_CODE: windsite.key
                },
                success: function(res) {
                    this.setState({
                        turbines: res.body || []
                    }, function() {
                        !!success && success();
                    }.bind(this));
                }.bind(this)
            });
        }.bind(this));
    }
    handleTurbineChange(turbine) {
        let form = this.state.form;
        let targetTurbine = this.state.turbines.find((item) => {
            return item.CODE_ == turbine.key;
        });
        form.turbine = Object.assign({}, targetTurbine, turbine);
        this.setState({
            form: form
        });
    }
    cleanErr() {
        let form = this.state.form;
        form.err = '';
        this.setState({
            form: form
        });
    }
    handleInfoChange(event) {
        let form = this.state.form;
        form.info = event.target.value;
        this.setState({
            form: form
        });
    }
    handleDateChange(date) {
        let form = this.state.form;
        form.date = date;
        this.setState({
            form: form
        });
    }
    handleTimeChange(time) {
        let form = this.state.form;
        form.time = time;
        this.setState({
            form: form
        });
    }
    handleModelChange(model) {
        let form = this.state.form;
        let targetModel = this.props.modelList.find((item) => {
            return item.ID == model.key;
        });
        form.model = Object.assign({}, targetModel, model);
        this.setState({
            form: form
        });
    }
    handleUnitChange(unit) {
        let form = this.state.form;
        let targetUnit = this.state.units.find((item) => {
            return item.CODE == unit.key;
        });
        form.unit = Object.assign({}, targetUnit, unit);
        this.setState({
            form: form
        });
    }
    handleWorkorderChange(event) {
        let editingAlarm = this.state.editingAlarm;
        editingAlarm.TICKET_ID = event.target.value;
        this.setState({
            editingAlarm: editingAlarm
        });
    }
    createAlarm() {
        let form = this.state.form;
        let data = '添加';
        let canSubmit = this.canSubmit(data);
        if (!canSubmit) {
            return false;
        }
        let date = $('#alarmDatebox > div:nth-child(2)').text();
        let time = $('#alarmTimebox > div:nth-child(2)').text();
        let date1 = $('#alarmDatebox1 > div:nth-child(2)').text();
        let time1 = $('#alarmTimebox1 > div:nth-child(2)').text();
        form.date = date;
        form.time = time;
        form.date1 = date1;
        form.time1 = time1;
        let targetTurbine = this.state.turbineModels.find((item) => item.NAME == form.turbine.MODEL_);
        let targetStatus = this.state.alarmStatus.find((item) => item.NAME == '未审核');
        let postData = {
            AREA: form.area.CODE,
            AREA_NAME: form.area.NAME,
            PROJECT: form.windsite.CODE_,
            PROJECT_NAME: form.windsite.NAME_,
            TURBINE: form.turbine.CODE_,
            LOCATION_CODE: form.turbine.LOCATION_CODE,
            TURBINE_MODEL: targetTurbine.ID,
            TURBINE_MODEL_NAME: targetTurbine.NAME,
            PREDICT_MODEL: form.model.ID,
            PREDICT_MODEL_NAME: form.model.NAME,
            // PREDICT_DATE: form.date + ' ' + form.time,
            START_TIME: form.date + ' ' + form.time,
            END_TIME: form.date1 + ' ' + form.time1,
            // TICKET_ID: form.workorder || '',
            SOURCE: 'predictSourceManual',
            LEVEL: form.model.LEVEL,
            LEVEL_NAME: form.model.LEVEL_NAME,
            COMP_RELATED: form.unit.ID,
            COMP_RELATED_NAME: form.unit.NAME,
            CONTENT: form.info,
            STATUS: targetStatus.ID,
            STATUS_NAME: targetStatus.NAME
        };

        this.props.createPredict({
            data: postData,
            success: function() {
                Utils.tooltip('添加成功');
                this.cleanForm();
                setTimeout(function() {
                    this.closeModal();
                    let pager = this.state.pager;
                    this.getWorkbenchSearch(pager.currPage);
                }.bind(this), 1000);
            }.bind(this),
            fail: function() {
                Utils.tooltip('添加失败');
                setTimeout(function() {
                    this.closeModal();
                }.bind(this), 1000);
                return false;
            }.bind(this)
        });
    }
    modifyAlarm() {
        let form = this.state.form;
        let canSubmit = this.canSubmit();

        if (!canSubmit) {
            return false;
        }
        let date = $('#alarmDatebox > div:nth-child(2)').text();
        let time = $('#alarmTimebox > div:nth-child(2)').text();
        form.date = date;
        form.time = time;
        let editingAlarm = this.state.editingAlarm;
        let targetTurbine = this.state.turbineModels.find((item) => item.NAME == form.turbine.MODEL_);
        let targetStatus = this.state.alarmStatus.find((item) => item.NAME == '未审核');
        let postData = {
            ID: editingAlarm.ID,
            AREA: form.area.CODE,
            AREA_NAME: form.area.NAME,
            PROJECT: form.windsite.CODE_,
            PROJECT_NAME: form.windsite.NAME_,
            TURBINE: form.turbine.CODE_,
            LOCATION_CODE: form.turbine.LOCATION_CODE,
            TURBINE_MODEL: targetTurbine.ID,
            TURBINE_MODEL_NAME: targetTurbine.NAME,
            PREDICT_MODEL: form.model.ID || editingAlarm.PREDICT_MODEL,
            PREDICT_MODEL_NAME: form.model.NAME || editingAlarm.PREDICT_MODEL_NAME,
            PREDICT_DATE: (form.date != '' && form.time != '') ? form.date + ' ' + form.time : editingAlarm.PREDICT_DATE,
            TICKET_ID: form.workorder || '',
            LEVEL: form.model.LEVEL || editingAlarm.LEVEL,
            LEVEL_NAME: form.model.LEVEL_NAME || editingAlarm.LEVEL_NAME,
            COMP_RELATED: form.unit.ID || editingAlarm.COMP_RELATED,
            COMP_RELATED_NAME: form.unit.NAME || editingAlarm.COMP_RELATED_NAME,
            CONTENT: form.info,
            STATUS: targetStatus.ID,
            STATUS_NAME: targetStatus.NAME
        };

        this.props.modifyPredict({
            data: postData,
            success: function() {
                Utils.tooltip('编辑成功');
                this.cleanForm();
                setTimeout(function() {
                    this.closeModal();
                    let pager = this.state.pager;
                    this.getWorkbenchSearch(pager.currPage);
                }.bind(this), 1000);
            }.bind(this),
            fail: function() {

            }
        });
    }
    canSubmit(data) {
        let form = this.state.form;
        let canSubmit = true;
        let date = $('#alarmDatebox > div:nth-child(2)').text();
        let time = $('#alarmTimebox > div:nth-child(2)').text();
        let date1 = $('#alarmDatebox1 > div:nth-child(2)').text();
        let time1 = $('#alarmTimebox1 > div:nth-child(2)').text();

        let start_time = date + ' ' + time;
        let end_time = date1 + ' ' + time1;

        let dateNub1 = new Date(start_time);
        let dateNub2 = new Date(end_time);
        let dateNub3 = dateNub2.getTime()-dateNub1.getTime();
        let days=Math.floor(dateNub3/(24*3600*1000));
        let leave1=dateNub3%(24*3600*1000);
        var hours=Math.floor(leave1/(3600*1000));
        let seconds = days*24 + hours;
        if(!!data && seconds > 24) {
            form.err = '预警时间不可超过24小时，请重新选择';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.area.key) {
            form.err = '请选择预警区域';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.windsite.key) {
            form.err = '请选择预警风场';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.turbine.key) {
            form.err = '请选择预警风机';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.model.key) {
            form.err = '请选择预警模型';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.unit.key && !!data) {
            form.err = '请选择关联部件';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.info && !data) {
            form.err = '请输入预警信息';
            this.setState({
                form: form
            });
            return false;
        }
        // if (!form.date || !form.time) {
        //     form.err = '请选择预警日期';
        //     this.setState({
        //         form: form
        //     });
        //     return false;
        // }
        return canSubmit;
    }
    cleanForm() {
        let alarmStatus = this.state.alarmStatus;
        let targetStatus = alarmStatus.find((item) => item.NAME == '未审核');
        let form = {
            title: '添加预警信息',
            err: '',
            area: {
                key: '',
                value: ''
            },
            windsite: {
                key: '',
                value: ''
            },
            turbine: {
                key: '',
                value: ''
            },
            model: {
                key: '',
                value: ''
            },
            info: '',
            unit: {
                key: '',
                value: ''
            },
            status: {
                key: targetStatus.ID,
                value: targetStatus.NAME
            },
            date: '',
            time: '',
            workorder: ''
        };
        $('#alarmDatebox input').val('');
        $('#alarmTimebox input').val('');
        this.setState({
            form: form,
            editingAlarm: {}
        });
    }
    viewDetail(detail) {
        this.props.router.push({
            pathname: '/warninginfordetails',
            state: {
                alarmId: detail.ID
            }
        });
    }
    setFilterSize() {
        let tableWidth = $('.' + style.table).css('width').slice(0, -2);
        let tableHeight = $('.' + style.table).height();
        this.setState({
            filterSize: [tableWidth, tableHeight]
        });
    }
    toggleFilter() {
        let showFilter = this.state.showFilter;
        this.setFilterSize();
        this.setState({
            showFilter: !showFilter
        });
    }
    handleViewSwitch(viewType) {
        this.setState({
            currView: viewType
        });
    }
    handlePredictTypeChange(predictType) {
        this.setState({
            predictType: predictType
        }, function() {
            this.getWorkbenchSearch(1);
        }.bind(this));
    }
    render() {
        let userInfo = User.get();
        let filter = this.state.filter;
        let currentArea = !!filter && !!filter.area ? filter.area : (User.get('currentArea') || '');
        let currentWindsite = !!filter && !!filter.windsite ? filter.windsite : (User.get('currentWindsite') || '');

        let alarms = this.state.alarms || [];

        let workbenchOverview = this.props.workbenchOverview || {};
        let levelGroup = !!this.props.workbenchLevel ? this.props.workbenchLevel : {};
        let levels = Object.keys(levelGroup);
        let finalLevelGroup = {};
        levels.forEach((level) => {
            finalLevelGroup[level.slice(5)] = !!levelGroup[level] ? levelGroup[level].value : 0;
        });

        let form = this.state.form;

        let areaList = this.props.areaList || [];
        let areaOptions = areaList.map((area) => {
            return {
                key: area.CODE,
                value: area.NAME
            };
        });
        areaOptions.unshift({
            key: null,
            value: '不选择'
        });

        let windsites = this.state.windsites || [];
        let windsiteOptions = windsites.map((windsite) => {
            return {
                key: windsite.CODE_,
                value: windsite.NAME_
            };
        });
        windsiteOptions.unshift({
            key: null,
            value: '不选择'
        });

        let turbines = this.state.turbines || [];
        let turbineOptions = turbines.map((turbine) => {
            return {
                key: turbine.CODE_,
                value: turbine.LOCATION_CODE
            };
        });
        turbineOptions.unshift({
            key: null,
            value: '不选择'
        });

        let models = this.props.modelList || [];
        let modelOptions = models.map((model) => {
            return {
                key: model.ID,
                value: model.NAME
            };
        });
        modelOptions.unshift({
            key: null,
            value: '不选择'
        });

        let units = this.state.units || [];
        let unitOptions = units.map((item) => {
            return {
                key: item.CODE,
                value: item.NAME
            };
        });
        unitOptions.unshift({
            key: null,
            value: '不选择'
        });

        let editingAlarm = this.state.editingAlarm;
        let editingAlarmTicketId = editingAlarm.TICKET_ID || '';
        let canEdit = JSON.stringify(editingAlarm) == '{}';

        let approveStatus = this.state.approveStatus;
        let showWorkerInput = approveStatus.status == 'predictApprovePass';
        let approveList = this.state.alarmApproveList || [];
        let approveNodes = approveList.map(function(item, index) {
            return (
                <div key={'approve' + item.ID + index} className='modalFormRadioWrapper'>
                    <span className={this.state.approveStatus.status == item.CODE ? 'modalFormRadio active' : 'modalFormRadio'} onClick={this.handleApproveStatusChange.bind(this, item)}></span>
                    <span className='modalFormRadioText'>{item.NAME}</span>
                </div>
            );
        }.bind(this));

        let activeItemId = this.state.activeItemId ? this.state.activeItemId : (!!this.props.location.state ? this.props.location.state.itemId : 'statisticsAlarm');
        let isMsBigScreen = $(document.body).attr('bigscreenmicrosoft') == 'true';
        let isMiniscreen = $(document.body).attr('miniscreen') == 'true';

        let date = !!this.state.form && !!this.state.form.date ? this.state.form.date: '';
        let time = !!this.state.form && !!this.state.form.time ? this.state.form.time: '';

        let arrowPosLeft = {
            left: !!Utils.isMiniScreen() ? '7rem' : '5rem'
        };

        let showList = this.state.currView == 'list';
        let showOverview = this.state.currView == 'overview';
        let turbineOverview = this.state.turbineOverview;
        let turbineOverviewKeys = Object.keys(turbineOverview);
        turbineOverviewKeys.sort();
        let turbineNodes = turbineOverviewKeys.map(function(item) {
            let itemId = item.replace(/\./, '');
            let itemDetail = Object.assign({}, turbineOverview[item]);
            return (
                <div key={itemId} className='pure-u-8-24'>
                    <Turbine
                        id={itemId}
                        type={item}
                        turbineOverview={itemDetail} />
                </div>
            );
        });

        if (showOverview) {
            activeItemId = '';
        }

        let currPredictType = this.state.predictType;
        let predictTypeNodes = this.state.predictTypes.map(function(item) {
            return (
                <span key={'predictType' + item.ID} className={currPredictType == item.NAME ? style.tab + ' ' + style.active : style.tab} onClick={this.handlePredictTypeChange.bind(this, item.NAME)}>{item.NAME}</span>
            );
        }.bind(this));


        let ths=['预警ID', '区域', '风场', '风机', '开始时间', '结束时间', '累计异常时间(小时)', '模型名称','备注', '预警信息', '类型', '等级', '关联部件', '状态'];
        let keys=['ID', 'AREA_NAME', 'PROJECT_NAME', 'LOCATION_CODE', 'START_TIME', 'END_TIME', 'ADD_UP_TIME', 'PREDICT_MODEL_NAME', 'REMARK', 'CONTENT', 'MODEL_TYPE', 'LEVEL_NAME', 'COMP_RELATED_NAME', 'STATUS_NAME'];
        if(!!this.state.statisticsPlan && this.state.statisticsPlan=='statisticsPlan') {
            ths=['预警ID', '区域', '风场', '风机', '开始时间', '结束时间', '累计异常时间(小时)', 'EAM工单号','推送日','排查日','准确性','准确性描述','模型名称','备注', '预警信息', '类型', '等级', '关联部件', '状态'];
            keys=['ID', 'AREA_NAME', 'PROJECT_NAME', 'LOCATION_CODE', 'START_TIME', 'END_TIME', 'ADD_UP_TIME', 'TICKET_ID','CREATEDATE','SCREENINGDATE','COMPLETE_CODE_NAME','VERACITYDESC', 'PREDICT_MODEL_NAME', 'REMARK', 'CONTENT', 'MODEL_TYPE', 'LEVEL_NAME', 'COMP_RELATED_NAME', 'STATUS_NAME'];
        }

        return (
            <div className={style.box}>
                <Navbar
                    props={this.props}
                    showAreaIcon={true}
                    onAreaOrWindsiteChange={this.initDataByAreaOrWindsite} />
                <div className='boxInner'>
                    <div className={style.charts + ' pure-g'}>
                        <div className='pure-u-19-24 gapRight'>
                            <div className={style.chartLeft}>
                                <StatisticsCharts
                                    data={workbenchOverview}
                                    activeId={activeItemId}
                                    activeIdNo={this.state.activeIdNo}
                                    onViewDetailByItem={this.viewDetailByItem}
                                    hideBtn={true} />
                            </div>
                        </div>
                        <div className='pure-u-5-24' onClick={this.todayChanges}>
                            <div className={!!this.state.activeIdNo ? style.chartRight+' panel' : style.chartRightBorder+' panel'}>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>今日预警等级分布</span>
                                </div>
                                {JSON.stringify(finalLevelGroup) != '{}' ?
                                <ChartTodayAlarmLevel
                                    id='todayAlarmLevelInWorkbench'
                                    data={finalLevelGroup}
                                    legend={{right: '0%'}} /> : <div className='dataEmpty'></div>}
                            </div>
                        </div>
                    </div>
                    <div className={style.table + ' panel'}>
                        <div className={style.filterWrapper}>
                            <Filter
                                showFilter={this.state.showFilter}
                                filter={this.state.filter}
                                size={this.state.filterSize}
                                arrowPos={arrowPosLeft}
                                hideItems={['machineType', 'footerTime']}
                                onSearch={this.searchAlarm} />
                        </div>
                        <div className={style.btns + ' panelHeader'}>
                            {showList ?
                            <span href='javascript:;' className={style.yjtableTitle + ' panelTitle'} onClick={this.toggleFilter}>预警列表</span> : null}
                            {showOverview ?
                            <span href='javascript:;' className={style.yjtableTitle + ' ' + style.titleNoFilter + ' panelTitle'}>机型概览</span> : null}
                            <div className={'clearfix ' + style.viewSwitch}>
                                <span className={showList ? style.active : ''} onClick={this.handleViewSwitch.bind(this, 'list')}>列表</span>
                                <span className={showOverview ? style.active : ''} onClick={this.handleViewSwitch.bind(this, 'overview')}>机型概览</span>
                            </div>
                            <span href='javascript:;' title='添加' className={showList ? style.addIcon : style.addIcon + ' transparent'} onClick={this.showModal}></span>
                            <form id='exportWorkbench' title='导出' className={showList ? style.btnWrapper : style.btnWrapper + ' transparent'} action={Constant.API_ROOT + '/predict/getWorkbenchExport'} method='POST' target=''>
                                <input type='hidden' id='token' name='token' value={userInfo.token} />
                                <input type='hidden' id='AREA' name='AREA' value={!!currentArea ? currentArea.CODE : ''} />
                                <input type='hidden' id='PROJECT' name='PROJECT' value={!!currentWindsite ? currentWindsite.CODE_ : ''} />
                                <input type='hidden' id='TIME' name='TIME' value={!!filter && !!filter.time ? filter.time : ''} />
                                <input type='hidden' id='START' name='START' value={!!filter && !!filter.startDate ? filter.startDate : ''} />
                                <input type='hidden' id='END' name='END' value={!!filter && !!filter.endDate ? filter.endDate : ''} />
                                <input type='hidden' id='STATUS' name='STATUS' value={!!filter && !!filter.status ? filter.status.ID : ''} />
                                <input type='hidden' id='LEVEL' name='LEVEL' value={!!filter && !!filter.level ? filter.level.ID : ''} />
                                <input type='hidden' id='COMP_RELATED' name='COMP_RELATED' value={!!filter && !!filter.unit ? filter.unit.ID : ''} />
                                <input type='hidden' id='ID' name='ID' value={!!filter && !!filter.number ? filter.number : ''} />
                                <span className={style.exportIcon} onClick={this.exportFile} onMouseOut={this.exportChange}></span>
                            </form>
                        </div>
                        <div className={style.tabs}>
                            <span className={this.state.predictType == '全部' ? style.tab + ' ' + style.active : style.tab} onClick={this.handlePredictTypeChange.bind(this, '全部')}>全部</span>
                            {predictTypeNodes}
                        </div>
                        <div className={showList ? 'full' : 'none'}>
                            <Table
                                tableId='workbench'
                                table={alarms}
                                ths={ths}
                                keys={keys}
                                hasHeader={false}
                                hasOrder={false}
                                hasCheckbox={false}
                                onItemClick={this.viewDetail}
                                pager={this.state.pager}
                                onPageChange={this.handlePageChange}
                                withOperation={true}
                                onModify={this.handleModify}
                                onApprove={this.handleApprove}
                                onDelete={this.handleDelete} />
                        </div>
                        <div className={showOverview ? 'pure-g' : 'none'}>
                            {turbineNodes}
                        </div>
                        <Modal
                            isOpen={this.state.showModal}
                            onClose={this.closeModal}>
                            <div className='modalForm'>
                                <div className='panel'>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>{this.state.form.title}</span>
                                    </div>
                                    <div className='modalFormErr'>{this.state.form.err}</div>
                                    <div className='modalFormPanel'>
                                        <div className='modalFormItem'>
                                            <div className='modalFormLabel'>预警状态：</div>
                                            <span className='modalFormText'>{form.status.value}</span>
                                        </div>
                                        <div className='modalFormItem'>
                                            <div className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>预警模型：</span>
                                            </div>
                                            <div className={style.dropdownWrapper}>
                                                <Dropdown
                                                    tabIndex='4'
                                                    options={modelOptions}
                                                    onSelect={this.handleModelChange}
                                                    overlayCls={style.dropdown}
                                                    selectedItem={form.model}
                                                    isDisabled={!canEdit}
                                                    isInModal={true} />
                                            </div>
                                        </div>
                                        <div className='modalFormItem'>
                                            <div className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>关联部件：</span>
                                            </div>
                                            <div className={style.dropdownWrapper}>
                                                <Dropdown
                                                    tabIndex='5'
                                                    options={unitOptions}
                                                    onSelect={this.handleUnitChange}
                                                    overlayCls={style.dropdown}
                                                    selectedItem={form.unit}
                                                    isDisabled={!canEdit}
                                                    isInModal={true} />
                                            </div>
                                        </div>
                                        <div className='modalFormItem'>
                                            <div className='modalFormLabel'>开始时间：</div>
                                            {canEdit ?
                                            <div className={style.dateboxWrapper}>
                                                <div className={style.dateboxDom}>
                                                    <Datebox
                                                        id='alarmDatebox'
                                                        onSelect={this.handleDateChange}
                                                        boxStyle={{width: isMsBigScreen ? '8rem' : (isMiniscreen ? '7rem': '5rem'), display: 'inline-block'}}
                                                        isActive={true}
                                                        isInModal={true} />
                                                    {JSON.stringify(this.state.editingAlarm) != '{}' ?
                                                        <Datebox
                                                            id='alarmTimebox'
                                                            onSelect={this.handleTimeChange}
                                                            boxStyle={{width: isMsBigScreen ? '8rem' : (isMiniscreen ? '7rem': '5rem'), display: 'inline-block'}}
                                                            mode='timebox'
                                                            mode={JSON.stringify(this.state.editingAlarm) != '{}' ? 'timebox' : ''}
                                                            isActive={true}
                                                            isInModal={true} /> :
                                                        <Datebox
                                                            id='alarmTimebox'
                                                            onSelect={this.handleTimeChange}
                                                            boxStyle={{width: isMsBigScreen ? '8rem' : (isMiniscreen ? '7rem': '5rem'), display: 'inline-block'}}
                                                            mode='timebox'
                                                            isActive={true}
                                                            isInModal={true} />}
                                                </div>
                                            </div> :
                                            <input type='text' className='modalFormInput disabled' value={date + ' ' + time} disabled />}
                                        </div>
                                        <div className='modalFormItem'>
                                            <div className='modalFormLabel'>结束时间：</div>
                                            {canEdit ?
                                            <div className={style.dateboxWrapper}>
                                                <div className={style.dateboxDom}>
                                                    <Datebox
                                                        id='alarmDatebox1'
                                                        onSelect={this.handleDateChange}
                                                        boxStyle={{width: isMsBigScreen ? '8rem' : (isMiniscreen ? '7rem': '5rem'), display: 'inline-block'}}
                                                        isActive={true}
                                                        isInModal={true} />
                                                    <Datebox
                                                        id='alarmTimebox1'
                                                        onSelect={this.handleTimeChange}
                                                        boxStyle={{width: isMsBigScreen ? '8rem' : (isMiniscreen ? '7rem': '5rem'), display: 'inline-block'}}
                                                        mode='timebox'
                                                        isActive={true}
                                                        isInModal={true} />
                                                </div>
                                            </div> :
                                            <input type='text' className='modalFormInput disabled' value={date + ' ' + time} disabled />}
                                        </div>
                                    </div>
                                    <div className='modalFormPanel'>
                                        <div className='modalFormItem'>
                                            <div className='modalFormLabel'>预警编号：</div>
                                            <span className='modalFormText'>{editingAlarm.ID}</span>
                                        </div>
                                        <div className='modalFormItem'>
                                            <div className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>区域选择：</span>
                                            </div>
                                            <div className={style.dropdownWrapper}>
                                                <Dropdown
                                                    tabIndex='1'
                                                    options={areaOptions}
                                                    onSelect={this.handleAreaChange}
                                                    overlayCls={style.dropdown}
                                                    selectedItem={form.area}
                                                    isDisabled={!canEdit}
                                                    isInModal={true} />
                                            </div>
                                        </div>
                                        <div className='modalFormItem'>
                                            <div className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>风场选择：</span>
                                            </div>
                                            <div className={style.dropdownWrapper}>
                                                <Dropdown
                                                    tabIndex='2'
                                                    options={windsiteOptions}
                                                    onSelect={this.handleWindsiteChange}
                                                    overlayCls={style.dropdown}
                                                    selectedItem={form.windsite}
                                                    isDisabled={!canEdit}
                                                    isInModal={true} />
                                            </div>
                                        </div>
                                        <div className='modalFormItem'>
                                            <div className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>风机选择：</span>
                                            </div>
                                            <div className={style.dropdownWrapper}>
                                                <Dropdown
                                                    tabIndex='3'
                                                    options={turbineOptions}
                                                    onSelect={this.handleTurbineChange}
                                                    overlayCls={style.dropdown}
                                                    selectedItem={form.turbine}
                                                    isDisabled={!canEdit}
                                                    isInModal={true} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='modalFormItemLarge'>
                                        <div className='modalFormLabel'>备注信息：</div>
                                        {canEdit ?
                                        <textarea rows='3' tabIndex='6' placeholder='请输入备注信息' className='modalFormTextArea' value={this.state.form.info} onChange={this.handleInfoChange} onFocus={this.cleanErr}></textarea> :
                                        <textarea rows='3' tabIndex='6' placeholder='请输入备注信息' className='modalFormTextArea' value={this.state.form.info} disabled></textarea>}
                                    </div>
                                    <div className='modalFormBtns'>
                                        <div href='javascript:;' className='modalFormConfirmBtn' onClick={JSON.stringify(this.state.editingAlarm) != '{}' ? this.modifyAlarm : this.createAlarm}>确认</div>
                                        <div href='javascript:;' className='modalFormCancelBtn' onClick={this.closeModal}>取消</div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                        <Modal
                            isOpen={this.state.showApproveModal}
                            onClose={this.closeApproveModal}>
                            <div className='modalForm'>
                                <div className='panel'>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>审核预警信息</span>
                                    </div>
                                    <div className='modalFormErr'>{this.state.form.err}</div>
                                    <div className='modalFormPanel'>
                                        <div className='modalFormItemStatic'>
                                            <div className='modalFormLabel'>预警模型：</div>
                                            <span className='modalFormText'>{editingAlarm.PREDICT_MODEL_NAME}</span>
                                        </div>
                                        <div className='modalFormItemStatic'>
                                            <div className='modalFormLabel'>预警编号：</div>
                                            <span className='modalFormText'>{editingAlarm.ID}</span>
                                        </div>
                                        <div className='modalFormItemStatic'>
                                            <div className='modalFormLabel'>区域：</div>
                                            <span className='modalFormText'>{editingAlarm.AREA_NAME}</span>
                                        </div>
                                        <div className='modalFormItemStatic'>
                                            <div className='modalFormLabel'>风场：</div>
                                            <span className='modalFormText'>{editingAlarm.PROJECT_NAME}</span>
                                        </div>
                                        <div className='modalFormItemStatic'>
                                            <div className='modalFormLabel'>风机：</div>
                                            <span className='modalFormText'>{editingAlarm.LOCATION_CODE}</span>
                                        </div>
                                        <div className='modalFormItemStatic'>
                                            <div className='modalFormLabel'>关联部件：</div>
                                            <span className='modalFormText'>{editingAlarm.COMP_RELATED_NAME}</span>
                                        </div>
                                        <div className={'modalFormItemStatic modalFormItemLarge ' + style.worker}>
                                            <div className='modalFormLabel'>审核意见：</div>
                                            {approveNodes}
                                        </div>
                                    </div>
                                    <div className='modalFormPanel'>
                                        <div className='modalFormItemStatic'>
                                            <div className='modalFormLabel'>预警状态：</div>
                                            <span className='modalFormText'>{editingAlarm.STATUS_NAME}</span>
                                        </div>
                                        <div className='modalFormItemStatic'>
                                            <div className='modalFormLabel'>预警来源：</div>
                                            <span className='modalFormText'>{'' || '无'}</span>
                                        </div>
                                        <div className='modalFormItemStatic'>
                                            <div className='modalFormLabel'>创建人：</div>
                                            <span className='modalFormText'>{editingAlarm.CREATE_USER}</span>
                                        </div>
                                        <div className='modalFormItemStatic'>
                                            <div className='modalFormLabel'>预警时间：</div>
                                            <span className='modalFormText modalFormTextLarge'>{Moment(editingAlarm.PREDICT_DATE).locale('zh-cn').format('YYYY年MM月DD日 HH:mm:ss')}</span>
                                        </div>
                                        <div className='modalFormItemStatic'>
                                            <div className='modalFormLabel'>预警等级：</div>
                                            <span className='modalFormText'>{editingAlarm.LEVEL_NAME}</span>
                                        </div>
                                        <div className='modalFormItemStatic'>
                                            <div className='modalFormLabel'>备注信息：</div>
                                            <span className='modalFormText'>{editingAlarm.CONTENT}</span>
                                        </div>
                                        <div className={showWorkerInput ? 'modalFormItemStatic' : 'none'}>
                                            <div className='modalFormLabel'>工单编号：</div>
                                            <input type='text' tabIndex='1' className='modalFormInput' value={editingAlarmTicketId} onChange={this.handleWorkorderChange} onFocus={this.cleanErr} />
                                        </div>
                                    </div>
                                    <div className='modalFormItemBlock'>
                                        <textarea rows='3' tabIndex='2' placeholder='请输入审核意见' className='modalFormTextArea' value={this.state.approveStatus.content} onChange={this.handleApproveContentChange}></textarea>
                                    </div>
                                    <div className='modalFormBtns'>
                                        <a href='javascript:;' className='modalFormConfirmBtn' onClick={this.approveAlarm}>确认</a>
                                        <a href='javascript:;' className='modalFormCancelBtn' onClick={this.closeApproveModal}>取消</a>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                        {this.state.showConfirm ?
                        <Confirm
                            onCancel={this.hideConfirm}
                            onConfirm={this.deleteAlarm} /> : null}
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        areaList: state.area.areaList || [],
        workbenchOverview: state.alarms.workbenchOverview || {},
        workbenchLevel: state.alarms.workbenchLevel || {},
        modelList: state.models.modelList || [],
        workbenchSearch: state.alarms.workbenchSearch || {}
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getParamTypeList: function({ data, before, after, success, fail }) {
            dispatch(actions.getParamTypeList({ data, before, after, success, fail }));
        },
        getParameterByTypeCode: function({ data, before, after, success, fail }) {
            dispatch(actions.getParameterByTypeCode({ data, before, after, success, fail }));
        },
        getWorkbenchOverview: function({ data, before, after, success, fail }) {
            dispatch(actions.getWorkbenchOverview({ data, before, after, success, fail }));
        },
        getWorkbenchLevel: function({ data, before, after, success, fail }) {
            dispatch(actions.getWorkbenchLevel({ data, before, after, success, fail }));
        },
        getWorkbenchApprove: function({ data, before, after, success, fail }) {
            dispatch(actions.getWorkbenchApprove({ data, before, after, success, fail }));
        },
        getOnlineProjectListByArea: function({ data, before, after, success, fail }) {
            dispatch(actions.getOnlineProjectListByArea({ data, before, after, success, fail }));
        },
        getTurbineListByProject: function({ data, before, after, success, fail }) {
            dispatch(actions.getTurbineListByProject({ data, before, after, success, fail }));
        },
        getModelList: function({ data, before, after, success, fail }) {
            dispatch(actions.getModelList({ data, before, after, success, fail }));
        },
        getWorkbenchSearch: function({ data, before, after, success, fail }) {
            dispatch(actions.getWorkbenchSearch({ data, before, after, success, fail }));
        },
        createPredict: function({ data, before, after, success, fail }) {
            dispatch(actions.createPredict({ data, before, after, success, fail }));
        },
        modifyPredict: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyPredict({ data, before, after, success, fail }));
        },
        removePredict: function({ data, before, after, success, fail }) {
            dispatch(actions.removePredict({ data, before, after, success, fail }));
        },
        getStaticByTurbineModel: function({ data, before, after, success, fail }) {
            dispatch(actions.getStaticByTurbineModel({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Workbench);
