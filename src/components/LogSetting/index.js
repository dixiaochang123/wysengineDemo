// 日志配置管理
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

import Constant from 'constant/index';
import Modal from 'subComponents/Modal';
import Navbar from 'subComponents/Navbar';
import Search from 'subComponents/Search';
import Dropdown from 'subComponents/Dropdown';
import TableOperation from 'subComponents/TableOperation';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class LogSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否是添加日志配置
            isCreate: true,
            // 展示添加/编辑日志配置框
            showModal: false,
            // 正在编辑的日志配置
            editingLogSetting: {},
            // 正在添加日志配置
            saving: false,
            // 搜索关键字
            searchKey: '',
            // 添加日志配置表单
            form: {
                err: '',
                module: {},
                action: {},
                msg: '',
                request: '',
                active: {}
            },
            // 日志配置列表分页
            pager: {
                total: 1,
                currPage: 1,
                pageSize: 10
            },
            // 可选模块
            availableModules: [],
            // 可选操作
            availableActions: [],
            // 日志配置列表
            logSettingList: [],
            // 当前页日志配置列表
            pageLogSettingList: [],
            // 激活的日志配置列表
            activeLogSettingList: [],
            // 可选激活状态
            activeOptions: [{
                key: 1,
                value: '激活'
            }, {
                key: 0,
                value: '不激活'
            }]
        };

        // 获取当前页日志配置列表
        this.getPageLogSettingList = this.getPageLogSettingList.bind(this);
        // 搜索
        this.search = this.search.bind(this);
        // 导出
        this.exportFile = this.exportFile.bind(this);

        // 展示添加日志配置框
        this.showModal = this.showModal.bind(this);
        // 展示修改日志配置框
        this.showModifyModal = this.showModifyModal.bind(this);
        // 关闭添加日志配置弹框
        this.closeModal = this.closeModal.bind(this);

        // 创建日志配置
        this.registLogSetting = this.registLogSetting.bind(this);
        // 修改日志配置
        this.modifyLogSetting = this.modifyLogSetting.bind(this);
        // 删除日志配置
        this.removeLogSetting = this.removeLogSetting.bind(this);
        // 表单验证
        this.canSubmit = this.canSubmit.bind(this);

        // 日志配置列表翻页回调
        this.handlePageChange = this.handlePageChange.bind(this);
        // 处理日志配置操作模块变化
        this.handleModuleChange = this.handleModuleChange.bind(this);
        // 处理日志配置操作类型变化
        this.handleActionChange = this.handleActionChange.bind(this);
        // 处理日志配置操作激活状态变化
        this.handleActiveChange = this.handleActiveChange.bind(this);
        // 处理日志配置操作信息变化
        this.handleMsgChange = this.handleMsgChange.bind(this);
        // 处理日志配置请求地址变化
        this.handleRequestChange = this.handleRequestChange.bind(this);
        // 清除日志配置表单
        this.cleanForm = this.cleanForm.bind(this);
        // 清除日志配置表单错误
        this.cleanErr = this.cleanErr.bind(this);
    }
    componentWillMount() {
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'module'
            },
            success: function(res) {
                this.setState({
                    availableModules: res.body || []
                });
            }.bind(this)
        });
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'action'
            },
            success: function(res) {
                this.setState({
                    availableActions: res.body || []
                });
            }.bind(this)
        });
        this.getPageLogSettingList();
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
    }
    getPageLogSettingList(currPage) {
        let hasAuth = User.hasAuth('logSetting__query');
        if (!hasAuth) {
            return false;
        }
        let pager = this.state.pager;
        this.props.getPageLogSettingList({
            data: {
                currentPage: currPage || pager.currPage,
                showCount: pager.pageSize || 10
            },
            success: function(res) {
                $(document.body).removeClass('btnLoading');
                pager.total = res.body.totalResult;
                this.setState({
                    pageLogSettingList: res.body.pageData || [],
                    pager: pager
                });
            }.bind(this)
        });
    }
    search(searchKey) {
        let hasAuth = User.hasAuth('logSetting__query');
        if (!hasAuth) {
            return false;
        }
        let pager = this.state.pager;
        this.props.searchLogSettingListPage({
            data: {
                currentPage: 1,
                showCount: pager.pageSize,
                KEYWORD: searchKey
            },
            success: function(res) {
                pager.currPage = 1;
                pager.total = res.body.totalResult;
                this.setState({
                    searchKey: searchKey,
                    pageLogSettingList: res.body.pageData || [],
                    pager: pager
                });
            }.bind(this)
        });
    }
    exportFile() {
        let hasAuth = User.hasAuth('logSetting__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportLogSetting');
        form.submit();
    }
    showModal() {
        let hasAuth = User.hasAuth('logSetting__add');
        if (!hasAuth) {
            return false;
        }
        this.setState({
            isCreate: true,
            showModal: true
        });
    }
    showModifyModal(logSettingItem) {
        let hasAuth = User.hasAuth('logSetting__edit');
        if (!hasAuth) {
            return false;
        }
        let form = this.state.form;
        form.err = '';
        form.module = {
            id: logSettingItem.MODULE,
            name: logSettingItem.MODULE_NAME
        };
        form.action = {
            id: logSettingItem.ACTION,
            name: logSettingItem.ACTION_NAME
        };
        form.msg = logSettingItem.MESSAGE;
        form.request = logSettingItem.REQUEST;

        let targetActive = this.state.activeOptions.find((item) => {
            return item.value == logSettingItem.ACTIVE;
        });
        form.active = Object.assign({}, targetActive);

        this.setState({
            editingLogSetting: logSettingItem,
            form: form,
            isCreate: false,
            showModal: true
        });
    }
    closeModal() {
        this.setState({
            showModal: false,
            editingLogSetting: {},
            form: {
                err: '',
                module: {},
                action: {},
                msg: '',
                request: '',
                active: {}
            }
        });
    }
    registLogSetting() {
        let form = this.state.form;
        let canSubmit = this.canSubmit(form);
        if (!canSubmit) {
            return false;
        }
        let postData = {
            MODULE: form.module.id,
            ACTION: form.action.id,
            MESSAGE: form.msg,
            REQUEST: form.request,
            ACTIVE: form.active.key
        };
        this.props.registLogSetting({
            data: postData,
            before: function() {
                this.setState({
                    saving: true
                });
            }.bind(this),
            after: function() {
                this.setState({
                    saving: false
                });
            }.bind(this),
            success: function() {
                Utils.tooltip('添加成功');
                this.cleanForm();
                this.setState({
                    showModal: false
                });
                this.getPageLogSettingList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('添加失败');
            }
        });
    }
    modifyLogSetting() {
        let form = this.state.form;
        let canSubmit = this.canSubmit(form);
        if (!canSubmit) {
            return false;
        }
        let postData = {
            ID: this.state.editingLogSetting.ID,
            MODULE: form.module.id,
            ACTION: form.action.id,
            MESSAGE: form.msg,
            REQUEST: form.request,
            ACTIVE: form.active.key
        };
        this.props.modifyLogSetting({
            data: postData,
            before: function() {
                this.setState({
                    saving: true
                });
            }.bind(this),
            after: function() {
                this.setState({
                    saving: false
                });
            }.bind(this),
            success: function() {
                this.cleanForm();
                this.setState({
                    isCreate: true,
                    editingLogSetting: {},
                    showModal: false
                }, function() {
                    Utils.tooltip('修改成功');
                });
                this.getPageLogSettingList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('修改失败');
            }
        });
    }
    removeLogSetting(logSettingItem) {
        let hasAuth = User.hasAuth('logSetting__delete');
        if (!hasAuth) {
            return false;
        }
        this.props.removeLogSetting({
            data: {
                ID: logSettingItem.ID
            },
            success: function() {
                Utils.tooltip('删除成功');
                this.getPageLogSettingList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('删除失败');
            }
        });
    }
    canSubmit(form) {
        let canSubmit = true;
        if (this.state.saving) {
            return false;
        }
        if (!form.module.id) {
            form.err = '请选择操作模块';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.action.id) {
            form.err = '请选择操作类型';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.msg) {
            form.err = '请输入操作信息';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.request) {
            form.err = '请输入请求地址';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.active.value) {
            form.err = '请选择激活状态';
            this.setState({
                form: form
            });
            return false;
        }
        return canSubmit;
    }
    handlePageChange(currPage) {
        let pager = this.state.pager;
        pager.currPage = currPage;
        this.setState({
            pager: pager
        });
        this.getPageLogSettingList(currPage);
    }
    handleModuleChange(moduleItem) {
        let form = this.state.form;
        form.module = {
            id: moduleItem.key,
            name: moduleItem.value
        };
        this.setState({
            form: form
        });
    }
    handleActionChange(actionItem) {
        let form = this.state.form;
        form.action = {
            id: actionItem.key,
            name: actionItem.value
        };
        this.setState({
            form: form
        });
    }
    handleActiveChange(activeItem) {
        let form = this.state.form;
        form.active = Object.assign({}, activeItem);
        this.setState({
            form: form
        });
    }
    handleMsgChange(event) {
        let form = this.state.form;
        form.msg = event.target.value;
        this.setState({
            form: form
        });
    }
    handleRequestChange(event) {
        let form = this.state.form;
        form.request = event.target.value;
        this.setState({
            form: form
        });
    }
    cleanForm() {
        this.setState({
            form: {
                err: '',
                module: {
                    id: '',
                    name: ''
                },
                action: {
                    id: '',
                    name: ''
                },
                msg: '',
                request: '',
                active: {
                    key: '',
                    value: ''
                }
            }
        });
    }
    cleanErr() {
        let form = this.state.form;
        form.err = '';
        this.setState({
            form: form
        });
    }
    render() {
        let userInfo = User.get();
        let pageLogSettingList = this.state.pageLogSettingList;
        let moduleOptions = !Utils.isEmpty(this.state.availableModules) ? this.state.availableModules.map((item) => {
            return {
                key: item.ID,
                value: item.NAME
            };
        }) : [];
        let actionOptions = !Utils.isEmpty(this.state.availableActions) ? this.state.availableActions.map((item) => {
            return {
                key: item.ID,
                value: item.NAME
            };
        }) : [];

        let selectedModule = {};
        let selectedAction = {};
        let selectedActive = {};
        if (!!this.state.editingLogSetting & !this.state.isCreate) {
            let form = this.state.form;
            selectedModule = {
                key: form.module.id,
                value: form.module.name
            };
            selectedAction = {
                key: form.action.id,
                value: form.action.name
            };
            selectedActive = Object.assign({}, form.active);
        }

        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                 <div className='boxInner'>
                    <div className='panel'>
                        <div className='panelHeader'>
                            <span className='panelTitle'>日志配置管理</span>
                            <form id='exportLogSetting' action={Constant.API_ROOT + '/system/log/logsetting/exportExcel'} method='POST' target='_blank'>
                                <input type='hidden' id='token' name='token' value={userInfo.token} />
                                <input type='hidden' id='KEYWORD' name='KEYWORD' value={this.state.searchKey} />
                                <span className='panelExport' onClick={this.exportFile}></span>
                            </form>
                            <span className='panelAdd' onClick={this.showModal}></span>
                        </div>
                        <div className='panelBody'>
                            <Search
                                onSearch={this.search} />
                            <div className={style.tab}>
                                {pageLogSettingList.length > 0 ?
                                <TableOperation
                                    tableId='tableLogSetting'
                                    table={pageLogSettingList}
                                    ths={['序号', '操作模块', '操作类型', '操作信息', '请求地址', '激活状态', '操作']}
                                    keys={['MODULE_NAME', 'ACTION_NAME', 'MESSAGE', 'REQUEST', 'ACTIVE']}
                                    hasHeader={false}
                                    hasOrder={true}
                                    hasCheckbox={false}
                                    pageShow={true}
                                    totalRow={10}
                                    pager={this.state.pager}
                                    onPageChange={this.handlePageChange}
                                    onModify={this.showModifyModal}
                                    onDelete={this.removeLogSetting}
                                    trAspectRatio={0.0222} /> : null}
                            </div>
                        </div>
                    </div>
                    <Modal
                        isOpen={this.state.showModal}
                        onClose={this.closeModal}>
                        <div className='modalForm'>
                            <div className='panel'>
                                <div className='panelHeader'>
                                    <div className='panelTitle'>
                                        {this.state.isCreate ? '添加日志配置' : '编辑日志配置'}
                                    </div>
                                </div>
                                <div className='modalFormErr'>{this.state.form.err}</div>
                                <div className='modalFormPanel'>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>操作模块：</label>
                                        <div className={style.dropdownWrapper}>
                                            <Dropdown
                                                tableIndex='1'
                                                options={moduleOptions}
                                                onSelect={this.handleModuleChange}
                                                overlayCls={style.dropdown}
                                                selectedItem={selectedModule} />
                                        </div>
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>操作信息：</label>
                                        <input tabIndex='3' type='text' value={this.state.form.msg} className='modalFormInput' onChange={this.handleMsgChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>激活状态：</label>
                                        <div className={style.dropdownWrapper}>
                                            <Dropdown
                                                tableIndex='5'
                                                options={this.state.activeOptions}
                                                onSelect={this.handleActiveChange}
                                                overlayCls={style.dropdown}
                                                selectedItem={selectedActive} />
                                        </div>
                                    </div>
                                </div>
                                <div className='modalFormPanel'>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>操作类型：</label>
                                        <div className={style.dropdownWrapper}>
                                            <Dropdown
                                                tableIndex='2'
                                                options={actionOptions}
                                                onSelect={this.handleActionChange}
                                                overlayCls={style.dropdown}
                                                selectedItem={selectedAction} />
                                        </div>
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>请求地址：</label>
                                        <input tabIndex='4' type='text' value={this.state.form.request} className='modalFormInput' onChange={this.handleRequestChange} onFocus={this.cleanErr} />
                                    </div>
                                </div>
                                <div className='modalFormBtns'>
                                    <div tabIndex='6' className='modalFormConfirmBtn' onClick={this.state.isCreate ? this.registLogSetting : this.modifyLogSetting}>确认</div>
                                    <div tabIndex='7' className='modalFormCancelBtn' onClick={this.closeModal}>取消</div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        pageLogSettingList: state.logsetting.pageLogSettingList || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getParameterByTypeCode: function({ data, before, after, success, fail }) {
            dispatch(actions.getParameterByTypeCode({ data, before, after, success, fail }));
        },
        getPageLogSettingList: function({ data, before, after, success, fail }) {
            dispatch(actions.getPageLogSettingList({ data, before, after, success, fail }));
        },
        searchLogSettingListPage: function({ data, before, after, success, fail }) {
            dispatch(actions.searchLogSettingListPage({ data, before, after, success, fail }));
        },
        registLogSetting: function({ data, before, after, success, fail }) {
            dispatch(actions.registLogSetting({ data, before, after, success, fail }));
        },
        modifyLogSetting: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyLogSetting({ data, before, after, success, fail }));
        },
        removeLogSetting: function({ data, before, after, success, fail }) {
            dispatch(actions.removeLogSetting({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LogSetting);
