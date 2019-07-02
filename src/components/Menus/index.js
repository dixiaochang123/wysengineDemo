// 菜单管理
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

class Menus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否是添加菜单
            isCreate: true,
            // 展示添加/编辑菜单框
            showModal: false,
            // 正在编辑的菜单
            editingMenu: {},
            // 正在添加菜单
            saving: false,
            // 添加菜单表单
            form: {
                err: '',
                code: '',
                name: '',
                url: '',
                parent: {},
                level: '',
                sequence: '',
                module: {},
                description: ''
            },
            // 菜单列表分页
            pager: {
                total: 1,
                currPage: 1,
                pageSize: 10
            },
            // 搜索关键字
            searchKey: '',
            // 搜索到的菜单列表
            menus: []
        };

        // 搜索
        this.search = this.search.bind(this);
        // 导出
        this.exportFile = this.exportFile.bind(this);
        // 获取当前页菜单列表
        this.getPageMenuList = this.getPageMenuList.bind(this);
        // 菜单列表翻页回调
        this.handlePageChange = this.handlePageChange.bind(this);

        // 展示添加菜单框
        this.showModal = this.showModal.bind(this);
        // 展示修改菜单框
        this.showModifyModal = this.showModifyModal.bind(this);
        // 关闭添加菜单弹框
        this.closeModal = this.closeModal.bind(this);

        // 创建菜单
        this.createMenu = this.createMenu.bind(this);
        // 修改菜单
        this.modifyMenu = this.modifyMenu.bind(this);
        // 删除菜单
        this.removeMenu = this.removeMenu.bind(this);
        // 表单验证
        this.canSubmit = this.canSubmit.bind(this);
        // 清除菜单表单
        this.cleanForm = this.cleanForm.bind(this);
        // 清除菜单表单错误
        this.cleanErr = this.cleanErr.bind(this);

        // 处理菜单代码变化
        this.handleCodeChange = this.handleCodeChange.bind(this);
        // 处理菜单名称变化
        this.handleNameChange = this.handleNameChange.bind(this);
        // 处理菜单url变化
        this.handleUrlChange = this.handleUrlChange.bind(this);
        // 处理菜单父级菜单变化
        this.handleParentChange = this.handleParentChange.bind(this);
        // 处理菜单等级变化
        this.handleLevelChange = this.handleLevelChange.bind(this);
        // 处理菜单序号变化
        this.handleSequenceChange = this.handleSequenceChange.bind(this);
        // 处理菜单所属模块变化
        this.handleModuleChange = this.handleModuleChange.bind(this);
        // 处理菜单描述变化
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    }
    componentWillMount() {
        this.props.getModuleList({});
        this.props.getMenuList({});
        this.getPageMenuList();
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
    }
    search(searchKey) {
        let hasAuth = User.hasAuth('menu__query');
        if (!hasAuth) {
            return false;
        }
        let pager = this.state.pager;
        this.props.searchMenuList({
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
                    menus: !!res.body ? res.body.pageData : []
                });
            }.bind(this)
        });
    }
    exportFile() {
        let hasAuth = User.hasAuth('menu__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportMenus');
        form.submit();
    }
    getPageMenuList(currPage) {
        let hasAuth = User.hasAuth('menu__query');
        if (!hasAuth) {
            return false;
        }
        let pager = this.state.pager;
        this.props.getPageMenuList({
            data: {
                currentPage: currPage || pager.currPage,
                showCount: pager.pageSize || 10
            },
            success: function(res) {
                $(document.body).removeClass('btnLoading');
                pager.total = res.body.totalResult;
                this.setState({
                    pager: pager,
                    menus: !!res.body ? res.body.pageData : []
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
        this.getPageMenuList(currPage);
    }
    showModal() {
        let hasAuth = User.hasAuth('menu__add');
        if (!hasAuth) {
            return false;
        }
        this.setState({
            isCreate: true,
            showModal: true
        });
    }
    showModifyModal(menuItem) {
        let hasAuth = User.hasAuth('menu__edit');
        if (!hasAuth) {
            return false;
        }
        let form = this.state.form;
        form.err = '';
        form.code = menuItem.CODE;
        form.name = menuItem.NAME;
        form.url = menuItem.URL || '';
        form.parent = {
            id: menuItem.PARENT,
            name: menuItem.PARENT_NAME
        };
        form.level = menuItem.LEVEL;
        form.sequence = menuItem.SEQUENCE;
        form.module = {
            id: menuItem.MODULE,
            name: menuItem.MODULE_NAME
        };
        form.description = menuItem.DESCRIPTION;
        this.setState({
            editingMenu: menuItem,
            form: form,
            isCreate: false,
            showModal: true
        });
    }
    closeModal() {
        this.setState({
            showModal: false,
            editingMenu: {},
            form: {
                err: '',
                name: '',
                description: ''
            }
        });
    }
    createMenu() {
        let form = this.state.form;
        let canSubmit = this.canSubmit(form);
        if (!canSubmit) {
            return false;
        }
        let postData = {
            CODE: form.code,
            NAME: form.name,
            URL: form.url,
            PARENT: form.parent.id,
            LEVEL: form.level,
            SEQUENCE: form.sequence,
            MODULE: form.module.id,
            DESCRIPTION: form.description
        };
        this.props.createMenu({
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
                this.getPageMenuList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('添加失败');
            }
        });
    }
    modifyMenu() {
        let form = this.state.form;
        let canSubmit = this.canSubmit(form);
        if (!canSubmit) {
            return false;
        }
        let postData = {
            ID: this.state.editingMenu.ID,
            CODE: form.code,
            NAME: form.name,
            URL: form.url,
            PARENT: form.parent.id,
            LEVEL: form.level,
            SEQUENCE: form.sequence,
            MODULE: form.module.id,
            DESCRIPTION: form.description
        };
        this.props.modifyMenu({
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
                this.cleanForm();
                this.setState({
                    showModal: false
                });
                this.getPageMenuList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('修改失败');
            }
        });
    }
    removeMenu(menuItem) {
        let hasAuth = User.hasAuth('menu__delete');
        if (!hasAuth) {
            return false;
        }
        this.props.removeMenu({
            data: {
                ID: menuItem.ID
            },
            success: function() {
                Utils.tooltip('删除成功');
                this.getPageMenuList();
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
            form.err = '请输入菜单代码';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.name) {
            form.err = '请输入菜单名称';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.url) {
            form.err = '请输入菜单路径';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.parent.id) {
            form.err = '请选择父级菜单';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.level) {
            form.err = '请输入菜单级别';
            this.setState({
                form: form
            });
            return false;
        }
        if (isNaN(form.level)) {
            form.err = '菜单级别只能为数字';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.sequence) {
            form.err = '请输入菜单序号';
            this.setState({
                form: form
            });
            return false;
        }
        if (isNaN(form.sequence) || form.sequence >= 2147483647 || form.sequence <= -2147483647) {
            form.err = '菜单序号只能为-2147483647至2147483647间的数字';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.module.id) {
            form.err = '请选择菜单所属模块';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.description) {
            form.err = '请输入菜单描述';
            this.setState({
                form: form
            });
            return false;
        }
        return canSubmit;
    }
    cleanForm() {
        this.setState({
            form: {
                err: '',
                code: '',
                name: '',
                url: '',
                parent: {
                    id: '',
                    name: ''
                },
                level: '',
                sequence: '',
                module: {
                    id: '',
                    name: ''
                },
                description: ''
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
    handleUrlChange(event) {
        let form = this.state.form;
        form.url = event.target.value;
        this.setState({
            form: form
        });
    }
    handleParentChange(parent) {
        let form = this.state.form;
        form.parent = {
            id: parent.key,
            name: parent.value
        };
        this.setState({
            form: form
        });
    }
    handleLevelChange(event) {
        let form = this.state.form;
        form.level = event.target.value;
        this.setState({
            form: form
        });
    }
    handleSequenceChange(event) {
        let form = this.state.form;
        let val = event.target.value;
        if (isNaN(val)) {
            return false;
        }
        form.sequence = val;
        this.setState({
            form: form
        });
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
    handleDescriptionChange(event) {
        let form = this.state.form;
        form.description = event.target.value;
        this.setState({
            form: form
        });
    }
    render() {
        let userInfo = User.get();
        let form = this.state.form;
        let currentModule = {
            key: !!form.module ? form.module.id : '',
            value: !!form.module ? form.module.name : ''
        };
        let currentParent = {
            key: !!form.parent ? form.parent.id : '',
            value: !!form.parent ? form.parent.name : ''
        };
        let menus = this.state.menus.length > 0 ? this.state.menus : [];
        let menuOptions = !Utils.isEmpty(this.props.menuList) ? this.props.menuList.map((item) => {
            return {
                key: item.ID,
                value: item.NAME
            };
        }) : [];
        let moduleOptions = !Utils.isEmpty(this.props.moduleList) ? this.props.moduleList.map((item) => {
            return {
                key: item.ID,
                value: item.NAME
            };
        }) : [];
        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                 <div className={'boxInner '}>
                    <div className='panel'>
                        <div className='panelHeader'>
                            <span className='panelTitle'>菜单管理</span>
                            <form id='exportMenus' action={Constant.API_ROOT + '/system/menu/exportExcel'} method='POST' target='_blank'>
                                <input type='hidden' id='token' name='token' value={userInfo.token} />
                                <input type='hidden' id='KEYWORD' name='KEYWORD' value={this.state.searchKey} />
                                <span title='全部导出' className='panelExport' onClick={this.exportFile}></span>
                            </form>
                            <span title='添加' className='panelAdd' onClick={this.showModal}></span>
                        </div>
                        <div className='panelBody'>
                            <Search
                                onSearch={this.search} />
                            <div className={style.tab}>
                                <TableOperation
                                    tableId='tableMenus'
                                    table={menus}
                                    ths={['序号', '代码', '名称', '路径', '父级菜单', '等级', '菜单序号', '所属模块', '描述', '操作']}
                                    keys={['CODE', 'NAME', 'URL', 'PARENT_NAME', 'LEVEL', 'SEQUENCE', 'MODULE_NAME', 'DESCRIPTION']}
                                    hasHeader={false}
                                    hasOrder={true}
                                    hasCheckbox={false}
                                    pageShow={true}
                                    totalRow={10}
                                    pager={this.state.pager}
                                    onPageChange={this.handlePageChange}
                                    onModify={this.showModifyModal}
                                    onDelete={this.removeMenu}
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
                                    <span className='panelTitle'>{this.state.isCreate ? '添加菜单' : '编辑菜单'}</span>
                                </div>
                                <div className='modalFormErr'>{this.state.form.err}</div>
                                <div className='modalFormPanel'>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>菜单代码：</label>
                                        <input tabIndex='1' type='text' value={this.state.form.code} className='modalFormInput' onChange={this.handleCodeChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>菜单路径：</label>
                                        <input tabIndex='3' type='text' value={this.state.form.url} className='modalFormInput' onChange={this.handleUrlChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>菜单等级：</label>
                                        <input tabIndex='5' type='text' value={this.state.form.level} className='modalFormInput' onChange={this.handleLevelChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>所属模块：</label>
                                        <div className={style.dropdownWrapper}>
                                            <Dropdown
                                                tableIndex='7'
                                                options={moduleOptions}
                                                onSelect={this.handleModuleChange}
                                                overlayCls={style.dropdown}
                                                selectedItem={currentModule} />
                                        </div>
                                    </div>
                                </div>
                                <div className='modalFormPanel'>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>菜单名称：</label>
                                        <input tabIndex='2' type='text' value={this.state.form.name} className='modalFormInput' onChange={this.handleNameChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>父级菜单：</label>
                                        <div className={style.dropdownWrapper}>
                                            <Dropdown
                                                tableIndex='4'
                                                options={menuOptions}
                                                onSelect={this.handleParentChange}
                                                overlayCls={style.dropdown}
                                                selectedItem={currentParent} />
                                        </div>
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>菜单序号：</label>
                                        <input tabIndex='6' type='text' value={this.state.form.sequence} className='modalFormInput' onChange={this.handleSequenceChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>菜单描述：</label>
                                        <input tabIndex='8' type='text' value={this.state.form.description} className='modalFormInput' onChange={this.handleDescriptionChange} onFocus={this.cleanErr} />
                                    </div>
                                </div>
                                <div className='modalFormBtns'>
                                    <div tabIndex='9' className='modalFormConfirmBtn' onClick={this.state.isCreate ? this.createMenu : this.modifyMenu}>提交</div>
                                    <div tabIndex='10' className='modalFormCancelBtn' onClick={this.closeModal}>关闭</div>
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
        moduleList: state.modules.moduleList || [],
        menuList: state.menu.menuList || [],
        pageMenuList: state.menu.pageMenuList || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getModuleList: function({ data, before, after, success, fail }) {
            dispatch(actions.getModuleList({ data, before, after, success, fail }));
        },
        getMenuList: function({ data, before, after, success, fail }) {
            dispatch(actions.getMenuList({ data, before, after, success, fail }));
        },
        getPageMenuList: function({ data, before, after, success, fail }) {
            dispatch(actions.getPageMenuList({ data, before, after, success, fail }));
        },
        searchMenuList: function({ data, before, after, success, fail }) {
            dispatch(actions.searchMenuList({ data, before, after, success, fail }));
        },
        createMenu: function({ data, before, after, success, fail }) {
            dispatch(actions.createMenu({ data, before, after, success, fail }));
        },
        modifyMenu: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyMenu({ data, before, after, success, fail }));
        },
        removeMenu: function({ data, before, after, success, fail }) {
            dispatch(actions.removeMenu({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Menus);
