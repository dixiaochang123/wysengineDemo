// 预警操作(编辑、审核)
import React from 'react';
import Moment from 'moment';
const ReactRedux = require('react-redux');

import actions from 'actions';
import Utils from 'utils/utils';

import Constant from 'constant/index';
import Modal from 'subComponents/Modal';
import Confirm from 'subComponents/Confirm';
import Datebox from 'subComponents/Datebox';
import Dropdown from 'subComponents/Dropdown';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class PredictOperation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 当前编辑的预警信息
            editingAlarm: {},
            // 是否展示添加、编辑弹框
            showModal: false,
            // 是否展示审核弹框
            showApproveModal: false,
            // 获取正在修改的预警信息，加载事件太长防止多次点击
            isLoading: false,
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
                // 预警日期
                date: '',
                // 预警时间
                time: '',
                // 工单号
                workorder: ''
            },
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
            }
        };

        // 显示编辑弹框
        this.showEditModal = this.showEditModal.bind(this);
        // 关闭弹框
        this.closeModal = this.closeModal.bind(this);

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

        // 编辑预警
        this.modifyAlarm = this.modifyAlarm.bind(this);
        // 表单验证，返回表单数据是否可提交
        this.canSubmit = this.canSubmit.bind(this);

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
    }
    componentWillMount() {
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
                            });
                        }.bind(this)
                    });
                }.bind(this));
            }.bind(this)
        });

        // 获取预警模型列表
        this.props.getModelList({});
    }
    handleModify() {
        if (this.state.isLoading) {
            return false;
        }
        let predict = this.props.predict;
        let formDate = Moment(predict.PREDICT_DATE).format('YYYY-MM-DD');
        let formTime = Moment(predict.PREDICT_DATE).format('HH:mm:ss');
        let form = {
            err: '',
            area: {
                key: predict.AREA,
                value: predict.AREA_NAME
            },
            windsite: {
                key: predict.PROJECT,
                value: predict.PROJECT_NAME
            },
            turbine: {
                key: predict.TURBINE,
                value: predict.LOCATION_CODE
            },
            model: {
                key: predict.PREDICT_MODEL,
                value: predict.PREDICT_MODEL_NAME
            },
            info: predict.CONTENT,
            unit: {
                key: predict.COMP_RELATED,
                value: predict.COMP_RELATED_NAME
            },
            status: {
                key: predict.STATUS,
                value: predict.STATUS_NAME
            },
            date: formDate,
            time: formTime,
            workorder: predict.TICKET_ID
        };
        $('#predictDatebox input').val(formDate);
        $('#predictTimebox input').val(formTime);

        let targetArea = this.props.areaList.find((areaItem) => areaItem.CODE == form.area.key);
        form.area = Object.assign({}, targetArea, form.area);

        // 获取区域风场
        this.handleAreaChange(form.area, function() {
            this.setState({
                isLoading: true
            });
            let targetWindsite = this.state.windsites.find((windsiteItem) => windsiteItem.CODE_ == form.windsite.key);
            form.windsite = Object.assign({}, targetWindsite, form.windsite);
            // 获取风场风机
            this.handleWindsiteChange(form.windsite, function() {
                let targetTurbine = this.state.turbines.find((turbineItem) => turbineItem.CODE_ == form.turbine.key);
                form.turbine = Object.assign({}, targetTurbine, form.turbine);
                this.setState({
                    form: form,
                    editingAlarm: predict
                }, function() {
                    this.setState({
                        isLoading: false
                    });
                    this.showEditModal();
                }.bind(this));
            }.bind(this));
        }.bind(this));
    }
    handleApprove() {
        let predict = this.props.predict;
        let alarmApproveList = this.state.alarmApproveList;
        let targetStatus = alarmApproveList.find((status) => status.NAME == predict.APPROVE_CODE_NAME);
        this.setState({
            editingAlarm: predict,
            approveStatus: {
                status: !!targetStatus ? targetStatus.CODE : '',
                content: !!targetStatus ? targetStatus.NAME : ''
            },
            showApproveModal: true
        });
    }
    handleDelete() {
        let predict = this.props.predict;
        this.setState({
            showConfirm: true,
            editingAlarm: predict
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
            }.bind(this)
        });
    }
    showEditModal() {
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
            STATUS: !!targetStatus ? targetStatus.CODE : '',
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
                    !!this.props.onPredictChange && this.props.onPredictChange();
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
    modifyAlarm() {
        let form = this.state.form;
        let canSubmit = this.canSubmit();

        if (!canSubmit) {
            return false;
        }
        let date = $('#predictDatebox > div:nth-child(2)').text();
        let time = $('#predictTimebox > div:nth-child(2)').text();
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
                    !!this.props.onPredictChange && this.props.onPredictChange();
                }.bind(this), 1000);
            }.bind(this),
            fail: function() {
                Utils.tooltip('编辑失败');
            }
        });
    }
    canSubmit() {
        let form = this.state.form;
        let canSubmit = true;
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
        if (!form.info) {
            form.err = '请输入预警信息';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.date || !form.time) {
            form.err = '请选择预警日期';
            this.setState({
                form: form
            });
            return false;
        }
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
        $('#predictDatebox input').val('');
        $('#predictTimebox input').val('');
        this.setState({
            form: form,
            editingAlarm: {}
        });
    }
    render() {
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

        let isMsBigScreen = $(document.body).attr('bigscreenmicrosoft') == 'true';
        let isMiniscreen = $(document.body).attr('miniscreen') == 'true';

        let date = !!this.state.form && !!this.state.form.date ? this.state.form.date: '';
        let time = !!this.state.form && !!this.state.form.time ? this.state.form.time: '';

        let isPredictApproved = !!this.props.predict && Constant.STATUS_IMG_MAP[this.props.predict.STATUS_NAME];

        return (
            <div className='right'>
                {isPredictApproved ?
                <span className={style.panelApprove + ' ' + style.active} title='已审核' onClick={this.handleApprove}></span> :
                <span className={style.panelApprove} title='未审核' onClick={this.handleApprove}></span>}
                <span className={style.panelEdit} title='编辑' onClick={this.handleModify}></span>
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
                                    <div className='modalFormLabel'>预警时间：</div>
                                    {canEdit ?
                                    <div className={style.dateboxWrapper}>
                                        <div className={style.dateboxDom}>
                                            <Datebox
                                                id='predictDatebox'
                                                onSelect={this.handleDateChange}
                                                boxStyle={{width: isMsBigScreen ? '8rem' : (isMiniscreen ? '7rem': '5rem'), display: 'inline-block'}}
                                                isActive={true}
                                                isInModal={true} />
                                            <Datebox
                                                id='predictTimebox'
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
                            <div className='modalFormItemLarge'>
                                <div className='modalFormLabel'>备注信息：</div>
                                {canEdit ?
                                <textarea rows='3' tabIndex='6' placeholder='请输入备注信息' className='modalFormTextArea' value={this.state.form.info} onChange={this.handleInfoChange} onFocus={this.cleanErr}></textarea> :
                                <textarea rows='3' tabIndex='6' placeholder='请输入备注信息' className='modalFormTextArea' value={this.state.form.info} disabled></textarea>}
                            </div>
                            <div className='modalFormBtns'>
                                <div href='javascript:;' className='modalFormConfirmBtn' onClick={this.modifyAlarm}>确认</div>
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
        );
    }
}

let mapStateToProps = function(state) {
    return {
        areaList: state.area.areaList || [],
        workbenchLevel: state.alarms.workbenchLevel || {},
        modelList: state.models.modelList || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getParameterByTypeCode: function({ data, before, after, success, fail }) {
            dispatch(actions.getParameterByTypeCode({ data, before, after, success, fail }));
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
        modifyPredict: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyPredict({ data, before, after, success, fail }));
        },
        removePredict: function({ data, before, after, success, fail }) {
            dispatch(actions.removePredict({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PredictOperation);
