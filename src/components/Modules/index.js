// 模块管理
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';
import Constant from 'constant/index';

import Modal from 'subComponents/Modal';
import Navbar from 'subComponents/Navbar';
import Search from 'subComponents/Search';
import TableOperation from 'subComponents/TableOperation';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class Modules extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否是添加模块
            isCreate: true,
            // 展示添加/编辑模块框
            showModal: false,
            // 正在编辑的模块
            editingModule: {},
            // 正在添加模块
            saving: false,
            // 搜索关键字
            searchKey: '',
            // 添加模块表单
            form: {
                err: '',
                code: '',
                name: '',
                description: ''
            },
            // 模块列表分页
            pager: {
                total: 1,
                currPage: 1,
                pageSize: 10
            },
            // 模块列表
            moduleList: []
        };

        // 搜索
        this.search = this.search.bind(this);
        // 导出
        this.exportFile = this.exportFile.bind(this);
        // 获取当前页模块列表
        this.getPageModuleList = this.getPageModuleList.bind(this);
        // 模块列表翻页回调
        this.handlePageChange = this.handlePageChange.bind(this);

        // 展示添加模块框
        this.showModal = this.showModal.bind(this);
        // 展示修改模块框
        this.showModifyModal = this.showModifyModal.bind(this);
        // 关闭添加模块弹框
        this.closeModal = this.closeModal.bind(this);

        // 创建模块
        this.createModule = this.createModule.bind(this);
        // 修改模块
        this.modifyModule = this.modifyModule.bind(this);
        // 删除模块
        this.removeModule = this.removeModule.bind(this);
        // 表单验证
        this.canSubmit = this.canSubmit.bind(this);

        // 清除模块表单错误
        this.cleanErr = this.cleanErr.bind(this);
        // 处理模块代码变化
        this.handleCodeChange = this.handleCodeChange.bind(this);
        // 处理模块名称变化
        this.handleNameChange = this.handleNameChange.bind(this);
        // 处理模块描述变化
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    }
    componentWillMount() {
        this.getPageModuleList();
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
    }
    search(searchKey) {
        let hasAuth = User.hasAuth('module__query');
        if (!hasAuth) {
            return false;
        }
        let pager = this.state.pager;
        this.props.searchModuleList({
            data: {
                currentPage: 1,
                showCount: pager.pageSize,
                KEYWORD: searchKey
            },
            success: function(res) {
                pager.currPage = 1;
                pager.total = res.body.totalResult;
                this.setState({
                    pager: pager,
                    searchKey: searchKey,
                    moduleList: res.body.pageData || []
                });
            }.bind(this)
        });
    }
    exportFile() {
        let hasAuth = User.hasAuth('module__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportModules');
        form.submit();
    }
    getPageModuleList(currPage) {
        let hasAuth = User.hasAuth('module__query');
        if (!hasAuth) {
            return false;
        }
        let pager = this.state.pager;
        this.props.getPageModuleList({
            data: {
                currentPage: currPage || pager.currPage,
                showCount: pager.pageSize || 10
            },
            success: function(res) {
                $(document.body).removeClass('btnLoading');
                pager.total = res.body.totalResult;
                this.setState({
                    pager: pager,
                    moduleList: this.props.pageModuleList
                });
            }.bind(this)
        });
    }
    handlePageChange(currPage) {
        let pager = this.state.pager;
        pager.currPage = currPage;
        this.setState({
            pager: pager
        });
        this.getPageModuleList(currPage);
    }
    showModal() {
        let hasAuth = User.hasAuth('module__add');
        if (!hasAuth) {
            return false;
        }
        this.setState({
            isCreate: true,
            showModal: true
        });
    }
    showModifyModal(moduleItem) {
        let hasAuth = User.hasAuth('module__edit');
        if (!hasAuth) {
            return false;
        }
        let form = this.state.form;
        form.err = '';
        form.code = moduleItem.CODE;
        form.name = moduleItem.NAME;
        form.description = moduleItem.DESCRIPTION;
        this.setState({
            editingModule: moduleItem,
            form: form,
            isCreate: false,
            showModal: true
        });
    }
    closeModal() {
        this.setState({
            showModal: false,
            editingModule: {},
            form: {
                err: '',
                name: '',
                description: ''
            }
        });
    }
    createModule() {
        let form = this.state.form;
        let canSubmit = this.canSubmit(form);
        if (!canSubmit) {
            return false;
        }
        this.props.createModule({
            data: {
                CODE: form.code,
                NAME: form.name,
                DESCRIPTION: form.description
            },
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
                this.setState({
                    showModal: false,
                    form: {
                        err: '',
                        code: '',
                        name: '',
                        description: ''
                    }
                });
                this.getPageModuleList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('添加失败');
            }
        });
    }
    modifyModule() {
        let form = this.state.form;
        let canSubmit = this.canSubmit(form);
        if (!canSubmit) {
            return false;
        }
        let postData = {
            ID: this.state.editingModule.ID,
            CODE: form.code,
            NAME: form.name,
            DESCRIPTION: form.description
        };
        this.props.modifyModule({
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
                Utils.tooltip('修改成功');
                this.setState({
                    showModal: false,
                    form: {
                        err: '',
                        code: '',
                        name: '',
                        description: ''
                    }
                });
                this.getPageModuleList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('修改失败');
            }
        });
    }
    removeModule(moduleItem) {
        let hasAuth = User.hasAuth('module__delete');
        if (!hasAuth) {
            return false;
        }
        this.props.removeModule({
            data: {
                ID: moduleItem.ID
            },
            success: function() {
                Utils.tooltip('删除成功');
                this.getPageModuleList();
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
        if (!form.code) {
            form.err = '请输入模块代码';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.name) {
            form.err = '请输入模块名称';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.description) {
            form.err = '请输入模块描述';
            this.setState({
                form: form
            });
            return false;
        }
        return canSubmit;
    }
    cleanErr() {
        let form = this.state.form;
        form.err = '';
        this.setState({
            form: form
        });
    }
    handleCodeChange(event) {
        let form = this.state.form;
        form.code = event.target.value;
        this.setState({
            form: form
        });
    }
    handleNameChange(event) {
        let form = this.state.form;
        form.name = event.target.value;
        this.setState({
            form: form
        });
    }
    handleDescriptionChange(event) {
        let form = this.state.form;
        form.description = event.target.value;
        this.setState({
            form: form
        });
    }
    render() {
        let userInfo = User.get();
        let modules = this.state.moduleList || [];
        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                 <div className='boxInner'>
                     <div className='panel'>
                        <div className='panelHeader'>
                            <span className='panelTitle'>模块管理</span>
                            <form id='exportModules' action={Constant.API_ROOT + '/system/module/exportExcel'} method='POST' target='_blank'>
                                <input type='hidden' id='token' name='token' value={userInfo.token} />
                                <input type='hidden' id='KEYWORD' name='KEYWORD' value={this.state.searchKey} />
                                <span title='全部导出' className='panelExport'  onClick={this.exportFile}></span>
                            </form>
                            <span title='添加' className='panelAdd' onClick={this.showModal}></span>
                        </div>
                        <div className='panelBody'>
                            <Search
                                onSearch={this.search} />
                            <div className={style.tab}>
                                <TableOperation
                                    tableId='tableModules'
                                    table={modules}
                                    ths={['序号', '名称', '描述','操作']}
                                    keys={['NAME', 'DESCRIPTION']}
                                    hasHeader={false}
                                    hasOrder={true}
                                    hasCheckbox={false}
                                    pageShow={true}
                                    totalRow={10}
                                    pager={this.state.pager}
                                    onPageChange={this.handlePageChange}
                                    onModify={this.showModifyModal}
                                    onDelete={this.removeModule}
                                    trAspectRatio={0.0222} />
                            </div>
                        </div>
                    </div>
                    <Modal
                        isOpen={this.state.showModal}
                        onClose={this.closeModal}>
                        <div className='modalForm'>
                            <div className='panel'>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>{this.state.isCreate ? '添加用户' : '编辑用户'}</span>
                                </div>
                                <div className='modalFormErr'>{this.state.form.err}</div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>模块代码：</label>
                                    <input type='text' value={this.state.form.code} className='modalFormInput' onChange={this.handleCodeChange} onFocus={this.cleanErr} />
                                </div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>模块名称：</label>
                                    <input type='text' value={this.state.form.name} className='modalFormInput' onChange={this.handleNameChange} onFocus={this.cleanErr} />
                                </div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>模块描述：</label>
                                    <input type='text' value={this.state.form.description} className='modalFormInput' onChange={this.handleDescriptionChange} onFocus={this.cleanErr} />
                                </div>
                                <div className='modalFormBtns'>
                                    <div className='modalFormConfirmBtn' onClick={this.state.isCreate ? this.createModule : this.modifyModule}>提交</div>
                                    <div className='modalFormCancelBtn' onClick={this.closeModal}>关闭</div>
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
        pageModuleList: state.modules.pageModuleList || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        searchModuleList: function({ data, before, after, success, fail }) {
            dispatch(actions.searchModuleList({ data, before, after, success, fail }));
        },
        getPageModuleList: function({ data, before, after, success, fail }) {
            dispatch(actions.getPageModuleList({ data, before, after, success, fail }));
        },
        createModule: function({ data, before, after, success, fail }) {
            dispatch(actions.createModule({ data, before, after, success, fail }));
        },
        modifyModule: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyModule({ data, before, after, success, fail }));
        },
        removeModule: function({ data, before, after, success, fail }) {
            dispatch(actions.removeModule({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Modules);
