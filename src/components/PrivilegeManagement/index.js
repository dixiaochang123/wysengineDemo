// 权限管理
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

class PrivilegeManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否创建
            isCreate: true,
            // 正在编辑的角色
            editingRole: {},
            // 是否展示分页
            pageShow: true,
            // 是否显示弹框
            showModal: false,
            // 表单
            form: {
                err: '',
                name: '',
                description: ''
            },
            // 分页
            pager: {
                total: 1,
                pageSize: 10,
                currPage: 1
            },
            // 权限列表
            authList: [],
            // 搜索关键词
            searchKey: ''
        };

        // 搜索
        this.search = this.search.bind(this);
        // 导出选择
        this.exportSelect = this.exportSelect.bind(this);
        // 处理翻页
        this.handlePageChange = this.handlePageChange.bind(this);
        // 添加角色
        this.addRole = this.addRole.bind(this);
        // 关闭弹框
        this.closeModal = this.closeModal.bind(this);
        // 清除错误
        this.cleanErr = this.cleanErr.bind(this);
        // 处理名称变化
        this.handleNameChange = this.handleNameChange.bind(this);
        //处理描述变化
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        // 获取权限列表
        this.getPageAuthList = this.getPageAuthList.bind(this);
        // 创建权限
        this.createAuth = this.createAuth.bind(this);
        // 修改权限
        this.modifyAuth = this.modifyAuth.bind(this);
        // 修改
        this.showModifyAuth = this.showModifyAuth.bind(this);
        // 删除
        this.removeAuth = this.removeAuth.bind(this);
    }
    componentWillMount() {
        this.getPageAuthList({});
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
    }
    getPageAuthList(currPage) {
        let hasAuth = User.hasAuth('auth__query');
        if (!hasAuth) {
            return false;
        }
        this.props.getPageAuthList({
            data:{
                currentPage:currPage || this.state.pager.currPage,
                showCount:this.state.pager.pageSize
            },
            success: function(res) {
                $(document.body).removeClass('btnLoading');
                let pager = this.state.pager;
                pager.total = this.props.pageAuthListObj.totalResult;
                this.setState({
                    pager: pager,
                    authList: res.body.pageData || []
                });
            }.bind(this)
        });
    }
    addRole() {
        let hasAuth = User.hasAuth('auth__add');
        if (!hasAuth) {
            return false;
        }
        this.setState({
            isCreate: true,
            showModal: true
        });
    }
    closeModal() {
        this.setState({
            showModal: false,
            form: {
                err: '',
                name: '',
                description: ''
            },
            editingRole: {}
        });
    }
    handlePageChange(currPage) {
        let pager = this.state.pager;
        pager.currPage = currPage;
        this.setState({
            pager: pager
        });
        this.getPageAuthList(currPage);
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
    cleanErr() {
        let form = this.state.form;
        form.err = '';
        this.setState({
            form: form
        });
    }
    createAuth() {
        let form = this.state.form;
        if (!form.name) {
            form.err = '请输入角色名称';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.description) {
            form.err = '请输入角色描述';
            this.setState({
                form: form
            });
            return false;
        }
        this.props.createAuth({
            data: {
                NAME: form.name,
                DESCRIPTION: form.description
            },
            success: function() {
                Utils.tooltip('添加成功');
                this.setState({
                    showModal: false,
                    form: {
                        err: '',
                        name: '',
                        description: ''
                    }
                });
                this.getPageAuthList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('添加失败');
            }
        });
    }
    modifyAuth() {
        let auth = this.state.editingRole;
        let form = this.state.form;
        if (!form.name) {
            form.err = '请输入权限名称';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.description) {
            form.err = '请输入权限描述';
            this.setState({
                form: form
            });
            return false;
        }
        this.props.modifyAuth({
            data: {
                ID: auth.ID,
                NAME: form.name,
                DESCRIPTION: form.description
            },
            success: function() {
                this.setState({
                    showModal: false,
                    form: {
                        err: '',
                        name: '',
                        description: ''
                    }
                });
                Utils.tooltip('修改成功');
                this.getPageAuthList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('修改失败');
            }
        });
    }
    removeAuth(auth) {
        let hasAuth = User.hasAuth('auth__delete');
        if (!hasAuth) {
            return false;
        }
        this.props.removeAuth({
            data: {
                ID: auth.ID
            },
            success: function() {
                Utils.tooltip('删除成功');
                this.getPageAuthList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('删除失败');
            }
        });
    }
    showModifyAuth(auth) {
        let hasAuth = User.hasAuth('auth__edit');
        if (!hasAuth) {
            return false;
        }
        let form = this.state.form;
        form.name = auth.NAME;
        form.description = auth.DESCRIPTION;
        this.setState({
            editingRole: auth,
            isCreate: false,
            showModal: true,
            form: form
        });
    }
    search(searchKey) {
        let hasAuth = User.hasAuth('auth__query');
        if (!hasAuth) {
            return false;
        }
        let pager = this.state.pager;
        this.props.searchAuthListPage({
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
                    authList: res.body.pageData
                });
            }.bind(this)
        });
    }
    exportSelect() {
        let hasAuth = User.hasAuth('auth__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportAuthList');
        form.submit();
    }
    render() {
        let userInfo = User.get();
        let pageAuthList = this.state.authList || [];

        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                 <div className='boxInner'>
                    <div className='panel'>
                        <div className='panelHeader'>
                            <span className='panelTitle'>权限管理</span>
                            <form id='exportAuthList' action={Constant.API_ROOT + '/user/auth/exportExcel'} method='POST' target='_blank'>
                                <input type='hidden' id='token' name='token' value={userInfo.token} />
                                <input type='hidden' id='KEYWORD' name='KEYWORD' value={this.state.searchKey} />
                                <span title='全部导出' className='panelExport' onClick={this.exportSelect}></span>
                            </form>
                            <span title='添加' className='panelAdd' onClick={this.addRole}></span>
                        </div>
                        <div className='panelBody'>
                            <Search
                                onSearch={this.search} />
                            <div className={style.tab}>
                                {pageAuthList.length > 0 ?
                                <TableOperation
                                    tableId='workbench'
                                    table={pageAuthList}
                                    ths={['序号','名称','描述','操作']}
                                    keys={['NAME','DESCRIPTION']}
                                    pageShow={this.state.pageShow}
                                    hasHeader={false}
                                    hasOrder={true}
                                    hasCheckbox={false}
                                    pager={this.state.pager}
                                    totalRow={10}
                                    onPageChange={this.handlePageChange}
                                    onSelected={this.selectItem}
                                    onModify={this.showModifyAuth}
                                    onDelete={this.removeAuth}
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
                                    <span className='panelTitle'>{this.state.isCreate ? '添加用户' : '编辑用户'}</span>
                                </div>
                                <div className='modalFormErr'>{this.state.form.err}</div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>权限名称：</label>
                                    <input type='text' value={this.state.form.name} className='modalFormInput' onChange={this.handleNameChange} onFocus={this.cleanErr} />
                                </div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>权限描述：</label>
                                    <input type='text' value={this.state.form.description} className='modalFormInput' onChange={this.handleDescriptionChange} onFocus={this.cleanErr} />
                                </div>
                                <div className='modalFormBtns'>
                                    <div className='modalFormConfirmBtn' onClick={this.state.isCreate ? this.createAuth : this.modifyAuth}>提交</div>
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
        pageAuthList: state.auth.pageAuthList || [],
        pageAuthListObj: state.auth.pageAuthListObj || {}
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getPageAuthList: function({ data, before, after, success, fail }) {
            dispatch(actions.getPageAuthList({ data, before, after, success, fail }));
        },
        searchAuthListPage: function({ data, before, after, success, fail }) {
            dispatch(actions.searchAuthListPage({ data, before, after, success, fail }));
        },
        createAuth: function({ data, before, after, success, fail }) {
            dispatch(actions.createAuth({ data, before, after, success, fail }));
        },
        removeAuth: function({ data, before, after, success, fail }) {
            dispatch(actions.removeAuth({ data, before, after, success, fail }));
        },
        modifyAuth: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyAuth({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PrivilegeManagement);
