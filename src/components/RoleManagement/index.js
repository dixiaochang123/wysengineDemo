// 角色管理
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

import Constant from 'constant/index';
import Modal from 'subComponents/Modal';
import Navbar from 'subComponents/Navbar';
import Search from 'subComponents/Search';
import TableRoleAuth from 'subComponents/TableRoleAuth';
import TableOperation from 'subComponents/TableOperation';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class RoleManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 正在修改角色权限
            isModifying: false,
            // 展示添加角色框
            showModal: false,
            // 展示修改角色框
            showModifyModal: false,
            // 正在编辑的角色
            editingRole: {},
            // 正在添加角色
            saving: false,
            // 添加角色表单
            form: {
                err: '',
                name: '',
                description: ''
            },
            // 角色列表分页
            pager: {
                total: 0,
                currPage: 1,
                pageSize: 10
            },
            // 角色列表
            roleList: []
        };

        // 搜索
        this.search = this.search.bind(this);
        // 导出
        this.exportFile = this.exportFile.bind(this);

        // 获取角色列表
        this.getPageRoleList = this.getPageRoleList.bind(this);
        // 角色列表翻页回调
        this.handlePageChange = this.handlePageChange.bind(this);

        // 展示添加角色框
        this.showModal = this.showModal.bind(this);
        // 关闭添加角色弹框
        this.closeModal = this.closeModal.bind(this);
        // 展示修改角色框
        this.showModifyModal = this.showModifyModal.bind(this);
        // 关闭修改角色框
        this.closeModifyModal = this.closeModifyModal.bind(this);

        // 创建角色
        this.createRole = this.createRole.bind(this);
        // 删除角色
        this.removeRole = this.removeRole.bind(this);

        // 清除角色表单错误
        this.cleanErr = this.cleanErr.bind(this);
        // 处理角色名称变化
        this.handleNameChange = this.handleNameChange.bind(this);
        // 处理角色描述变化
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);

        // 改变角色权限
        this.toggleRoleAuth = this.toggleRoleAuth.bind(this);
    }
    componentWillMount() {
        this.getPageRoleList({});
        this.props.getAuthList({});
    }
    search(searchKey) {
        let hasAuth = User.hasAuth('role__query');
        if (!hasAuth) {
            return false;
        }
        let pager = this.state.pager;
        this.props.searchRoleList({
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
                    roleList: res.body.pageData || []
                });
            }.bind(this)
        });
    }
    exportFile() {
        let hasAuth = User.hasAuth('role__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportRoleList');
        form.submit();
    }
    getPageRoleList(currPage) {
        let hasAuth = User.hasAuth('role__query');
        if (!hasAuth) {
            return false;
        }
        this.props.getPageRoleList({
            data: {
                currentPage: currPage || this.state.pager.currPage,
                showCount: this.state.pager.pageSize
            },
            success: function(res) {
                $(document.body).removeClass('btnLoading');
                let pager = this.state.pager;
                pager.total = res.body.totalResult || 1;
                pager.currPage = res.body.currentPage;
                this.setState({
                    pager: pager,
                    roleList: res.body.pageData || []
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
        this.getPageRoleList(currPage);
    }
    showModal() {
        let hasAuth = User.hasAuth('role__add');
        if (!hasAuth) {
            return false;
        }
        this.setState({
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
            }
        });
    }
    showModifyModal(role) {
        let hasAuth = User.hasAuth('role__delete');
        if (!hasAuth) {
            return false;
        }
        this.props.getRoleAuthListByRole({
            data: {
                ROLE: role.ID
            },
            success: function() {
                this.setState({
                    editingRole: role,
                    showModifyModal: true
                });
            }.bind(this)
        });
    }
    closeModifyModal() {
        this.setState({
            editingRole: {},
            showModifyModal: false
        });
    }
    createRole() {
        let form = this.state.form;
        if (this.state.saving) {
            return false;
        }
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
        this.props.createRole({
            data: {
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
                        name: '',
                        description: ''
                    }
                });
                this.getPageRoleList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('添加失败');
            }
        });
    }
    removeRole(role) {
        let hasAuth = User.hasAuth('role__delete');
        if (!hasAuth) {
            return false;
        }
        this.props.removeRole({
            data: {
                ID: role.ID
            },
            success: function() {
                Utils.tooltip('删除成功');
                this.getPageRoleList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('删除失败');
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
    toggleRoleAuth(auth) {
        if (this.state.isModifying) {
            Utils.tooltip('权限修改中...');
            return false;
        }
        this.setState({
            isModifying: true
        }, function() {
            let hasRight = auth.HAS_RIGHT == 0 ? 1 : 0;
            this.props.modifyRoleAuth({
                data: {
                    ID: auth.ID,
                    HAS_RIGHT: hasRight
                },
                success: function() {
                    let role = this.state.editingRole;
                    this.props.getRoleAuthListByRole({
                        data: {
                            ROLE: role.ID
                        },
                        success: function() {
                            this.setState({
                                isModifying: false
                            }, function() {
                                Utils.tooltip('修改成功，重新登录后生效');
                            });
                        }.bind(this)
                    });
                }.bind(this)
            });
        }.bind(this));
    }
    render() {
        let userInfo = User.get();
        let roles = this.state.roleList || [];
        let staticThs = ['模块'];
        let ths = this.props.authList && this.props.authList.length > 0 ? this.props.authList.map(function(auth) {
            return auth.DESCRIPTION;
        }) : null;
        let roleAuthListGroup = !!this.props.roleAuthList ? Utils.groupBy(this.props.roleAuthList, 'MODULE_NAME') : {};
        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                 <div className='boxInner'>
                    <div className='panel'>
                        <div className='panelHeader'>
                            <div className='panelTitle'>角色管理</div>
                            <form id='exportRoleList' action={Constant.API_ROOT + '/user/role/exportExcel'} method='POST' target='_blank'>
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
                                <TableOperation
                                    tableId='tableRoleManagement'
                                    table={roles}
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
                                    onDelete={this.removeRole}
                                    trAspectRatio={0.0222}/>
                            </div>
                        </div>
                    </div>
                    <Modal
                        isOpen={this.state.showModal}
                        onClose={this.closeModal}>
                        <div className='modalForm'>
                            <div className='panel'>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>{'添加角色'}</span>
                                </div>
                                <div className='modalFormErr'>{this.state.form.err}</div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>角色名称：</label>
                                    <input type='text' value={this.state.form.name} className='modalFormInput' onChange={this.handleNameChange} onFocus={this.cleanErr} />
                                </div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>角色描述：</label>
                                    <input type='text' value={this.state.form.description} className='modalFormInput' onChange={this.handleDescriptionChange} onFocus={this.cleanErr} />
                                </div>
                                <div className='modalFormBtns'>
                                    <div className='modalFormConfirmBtn' onClick={this.createRole}>提交</div>
                                    <div className='modalFormCancelBtn' onClick={this.closeModal}>关闭</div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={this.state.showModifyModal}
                        onClose={this.closeModifyModal}>
                        <TableRoleAuth
                            tableId='tableRoleAuth'
                            ths={staticThs.concat(ths)}
                            table={roleAuthListGroup}
                            onRoleAuthChange={this.toggleRoleAuth} />
                    </Modal>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        authList: state.auth.authList || [],
        pageRoleList: state.role.pageRoleList || [],
        roleAuthList: state.role.roleAuthList || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getAuthList: function({ data, before, after, success, fail }) {
            dispatch(actions.getAuthList({ data, before, after, success, fail }));
        },
        searchRoleList: function({ data, before, after, success, fail }) {
            dispatch(actions.searchRoleList({ data, before, after, success, fail }));
        },
        getPageRoleList: function({ data, before, after, success, fail }) {
            dispatch(actions.getPageRoleList({ data, before, after, success, fail }));
        },
        getRoleAuthListByRole: function({ data, before, after, success, fail }) {
            dispatch(actions.getRoleAuthListByRole({ data, before, after, success, fail }));
        },
        modifyRoleAuth: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyRoleAuth({ data, before, after, success, fail }));
        },
        createRole: function({ data, before, after, success, fail }) {
            dispatch(actions.createRole({ data, before, after, success, fail }));
        },
        removeRole: function({ data, before, after, success, fail }) {
            dispatch(actions.removeRole({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(RoleManagement);
