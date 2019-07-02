// 部门管理
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

class DepartmentManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否展示添加、编辑弹框
            showModal: false,
            // 是否创建部门
            isCreate: true,
            // 是否正在保存新创建的部门
            saving: false,
            // 部门表单
            form: {
                // 表单错误
                err: '',
                // 部门ID
                id: '',
                // 所属公司
                company: {},
                // 部门名称
                name: '',
                // 上级部门
                parent: {},
                // 部门编号
                code: '',
                // 部门描述
                description: '',
                // 部门等级
                level: ''
            },
            // 部门分页
            pager: {
                // 总数据条数
                total: 1,
                // 单页数据条数
                pageSize: 10,
                // 当前页
                currPage: 1
            },
            // 可选公司列表
            companyList: [],
            // 可选部门列表
            departmentList: [],
            // 搜索关键字
            searchValue: '',
            // 搜索获得的部门列表
            searchedDepList: []
        };

        // 搜索
        this.search = this.search.bind(this);
        // 导出
        this.exportFile = this.exportFile.bind(this);

        // 获取部门列表
        this.searchDepartmentList = this.searchDepartmentList.bind(this);
        // 翻页
        this.handlePageChange = this.handlePageChange.bind(this);

        // 展示添加弹框
        this.showModal = this.showModal.bind(this);
        // 展示修改弹框
        this.showModifyModal = this.showModifyModal.bind(this);
        // 关闭弹窗
        this.closeModal = this.closeModal.bind(this);

        // 创建部门
        this.createDepartment = this.createDepartment.bind(this);
        // 修改部门
        this.modifyDepartment = this.modifyDepartment.bind(this);
        // 删除部门
        this.removeDepartment = this.removeDepartment.bind(this);

        // 表单有错误
        this.hasErr = this.hasErr.bind(this);
        // 清除错误
        this.cleanErr = this.cleanErr.bind(this);
        // 公司名称变化
        this.handleCompanyChange = this.handleCompanyChange.bind(this);
        // 部门名称变化
        this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
        // 上级部门名称变化
        this.handleParentChange = this.handleParentChange.bind(this);
        // 部门编号变化
        this.handleCodeChange = this.handleCodeChange.bind(this);
        // 部门描述变化
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    }
    componentWillMount() {
        this.searchDepartmentList(1);
        // 获取可选公司列表
        this.props.getCompanyList({
            success: function(res) {
                this.setState({
                    companyList: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
        // 获取可选部门列表
        this.props.getDepartmentList({
            success: function(res) {
                this.setState({
                    departmentList: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
    }
    search(keyword) {
        this.setState({
            searchValue: keyword
        }, function() {
            this.searchDepartmentList(1, keyword);
        }.bind(this));
    }
    exportFile() {
        let hasAuth = User.hasAuth('department__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportDeps');
        form.submit();
    }
    searchDepartmentList(currPage, keyword) {
        let hasAuth = User.hasAuth('department__query');
        if (!hasAuth) {
            return false;
        }
        this.props.searchDepartmentList({
            data: {
                currentPage: currPage || this.state.pager.currPage,
                showCount: this.state.pager.pageSize,
                KEYWORD: keyword || this.state.searchValue
            },
            success: function(res) {
                $(document.body).removeClass('btnLoading');
                let pager = this.state.pager;
                pager.currPage = currPage;
                pager.total = res.body.totalResult;
                this.setState({
                    pager: pager,
                    searchedDepList: res.body.pageData || []
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
        this.searchDepartmentList(currPage);
    }
    showModal() {
        let hasAuth = User.hasAuth('department__add');
        if (!hasAuth) {
            return false;
        }
        this.setState({
            showModal: true,
            isCreate: true
        });
    }
    showModifyModal(departmemnt) {
        let hasAuth = User.hasAuth('department__edit');
        if (!hasAuth) {
            return false;
        }
        let form = this.state.form;
        form.id = departmemnt.ID;
        form.name = departmemnt.NAME;
        form.description = departmemnt.DESCRIPTION;
        form.code = departmemnt.CODE;
        form.parent = {
            id: departmemnt.PARENT,
            name: departmemnt.PARENT_NAME
        };
        form.company = {
            id: departmemnt.COMPANY,
            name: departmemnt.COMPANY_NAME
        };
        form.level = departmemnt.LEVEL;
        this.setState({
            isCreate: false,
            showModal: true,
            form: form
        });
    }
    closeModal() {
        this.setState({
            showModal: false,
            form: {
                err: '',
                id: '',
                company: {},
                name: '',
                parent: {},
                code: '',
                level: '',
                description: ''
            }
        });
    }
    createDepartment() {
        if (this.state.saving) {
            return false;
        }

        let form = this.state.form;
        let hasErr = this.hasErr(form);
        if (hasErr) {
            return false;
        }

        let postData = {
            CODE: form.code,
            NAME: form.name,
            DESCRIPTION: form.description,
            PARENT: form.parent.id,
            // LEVEL: 1,
            COMPANY: form.company.id
        };
        this.props.createDepartment({
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
                this.closeModal();
                this.searchDepartmentList(1);
            }.bind(this),
            fail: function() {
                Utils.tooltip('添加失败');
            }
        });
    }
    modifyDepartment() {
        let form = this.state.form;
        let hasErr = this.hasErr(form);
        if (hasErr) {
            return false;
        }

        this.props.modifyDepartment({
            data: {
                ID: form.id,
                CODE: form.code,
                NAME: form.name,
                DESCRIPTION: form.description,
                PARENT: form.parent.id,
                LEVEL: form.level,
                COMPANY: form.company.id
            },
            success: function() {
                Utils.tooltip('修改成功');
                this.closeModal();
                this.searchDepartmentList(1);
            }.bind(this),
            fail: function() {
                Utils.tooltip('修改失败');
            }
        });
    }
    removeDepartment(departmemnt) {
        let hasAuth = User.hasAuth('department__delete');
        if (!hasAuth) {
            return false;
        }
        this.props.removeDepartment({
            data: {
                ID: departmemnt.ID
            },
            success: function() {
                Utils.tooltip('删除成功');
                this.searchDepartmentList(1);
            }.bind(this),
            fail: function() {
                Utils.tooltip('删除失败');
            }
        });
    }
    hasErr(form) {
        if (!form.description) {
            form.err = '请输入部门描述';
        }
        if (!form.code) {
            form.err = '请输入部门编号';
        }
        if (!form.parent.id) {
            form.err = '请选择上级部门';
        }
        if (!form.name) {
            form.err = '请输入部门名称';
        }
        if (!form.company.id) {
            form.err = '请选择所属公司';
        }

        if (!!form.err) {
            this.setState({
                form: form
            });
        }

        return form.err != '';
    }
    cleanErr() {
        let form = this.state.form;
        form.err = '';
        this.setState({
            form: form
        });
    }
    handleCompanyChange(option) {
        let form = this.state.form;
        form.company = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    handleDepartmentChange(event) {
        let form = this.state.form;
        form.name = event.target.value;
        this.setState({
            form: form
        });
    }
    handleParentChange(option) {
        let form = this.state.form;
        form.parent = {
            id: option.key,
            name: option.value
        };
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
    handleDescriptionChange(event) {
        let form = this.state.form;
        form.description = event.target.value;
        this.setState({
            form: form
        });
    }
    render() {
        let userInfo = User.get();
        let departmentList = this.state.searchedDepList || [];
        let selectedParent = {};
        let selectedCompany = {};
        if (!!this.state.form.id && !this.state.isCreate) {
            let form = this.state.form;
            selectedParent = {
                key: form.parent.id,
                value: form.parent.name
            };
            selectedCompany = {
                key: form.company.id,
                value: form.company.name
            };
        }
        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                 <div className='boxInner'>
                     <div className='panel'>
                        <div className='panelHeader'>
                            <span className='panelTitle'>部门管理</span>
                            <form id='exportDeps' action={Constant.API_ROOT + '/user/department/exportExcel'} method='POST' target='_blank'>
                                <input type='hidden' id='token' name='token' value={userInfo.token} />
                                <input type='hidden' id='KEYWORD' name='KEYWORD' value={this.state.searchValue} />
                                <span title='全部导出' className='panelExport' onClick={this.exportFile}></span>
                            </form>
                            <span title='添加' className='panelAdd' onClick={this.showModal}></span>
                        </div>
                        <div className='panelBody'>
                            <Search
                                onSearch={this.search} />
                            <div className={style.tab}>
                                {departmentList.length > 0 ?
                                <TableOperation
                                    tableId='workbench'
                                    table={departmentList}
                                    ths={['序号', '', '公司', '部门', '上级部门', '编号', '描述', '创建人', '操作']}
                                    keys={['nobers', 'COMPANY_NAME', 'NAME', 'PARENT_NAME', 'CODE', 'DESCRIPTION', 'CREATE_USER_NAME']}
                                    hasHeader={false}
                                    hasOrder={true}
                                    hasCheckbox={false}
                                    pageShow={true}
                                    pager={this.state.pager}
                                    totalRow={10}
                                    onPageChange={this.handlePageChange}
                                    onModify={this.showModifyModal}
                                    onDelete={this.removeDepartment}
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
                                    <label className='modalFormLabel'>所属公司：</label>
                                    <div className={style.companySelect}>
                                        <Dropdown
                                            overlayCls={style.overlayCls}
                                            selectedItem={selectedCompany}
                                            options={this.state.companyList}
                                            onSelect={this.handleCompanyChange} />
                                    </div>
                                </div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>部门名称：</label>
                                    <input type='text' value={this.state.form.name} className='modalFormInput' onChange={this.handleDepartmentChange} onFocus={this.cleanErr} />
                                </div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>上级部门：</label>
                                    <div className={style.companySelect}>
                                        <Dropdown
                                            overlayCls={style.overlayCls}
                                            selectedItem={selectedParent}
                                            options={this.state.departmentList}
                                            onSelect={this.handleParentChange} />
                                    </div>
                                </div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>部门编号：</label>
                                    <input type='text' value={this.state.form.code} className='modalFormInput' onChange={this.handleCodeChange} onFocus={this.cleanErr} />
                                </div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>部门描述：</label>
                                    <input type='text' value={this.state.form.description} className='modalFormInput' onChange={this.handleDescriptionChange} onFocus={this.cleanErr} />
                                </div>
                                <div className='modalFormBtns'>
                                    <div className='modalFormConfirmBtn' onClick={this.state.isCreate ? this.createDepartment : this.modifyDepartment}>提交</div>
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
        companyList: state.company.companyList || [],
        departmentList: state.departments.departmentList || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        searchDepartmentList: function({ data, before, after, success, fail }) {
            dispatch(actions.searchDepartmentList({ data, before, after, success, fail }));
        },
        createDepartment: function({ data, before, after, success, fail }) {
            dispatch(actions.createDepartment({ data, before, after, success, fail }));
        },
        removeDepartment: function({ data, before, after, success, fail }) {
            dispatch(actions.removeDepartment({ data, before, after, success, fail }));
        },
        modifyDepartment: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyDepartment({ data, before, after, success, fail }));
        },
        getCompanyList: function({ data, before, after, success, fail }) {
            dispatch(actions.getCompanyList({ data, before, after, success, fail }));
        },
        getDepartmentList: function({ data, before, after, success, fail }) {
            dispatch(actions.getDepartmentList({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(DepartmentManagement);
