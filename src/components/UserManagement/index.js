// 用户管理
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

class UserManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 展示创建、编辑弹框
            showModal: false,
            // 正在保存
            saving: false,
            // 是否创建用户
            isCreate: true,
            // 是否修改密码
            modifyPassword: false,
            // 编辑中的用户
            editingUser: {},
            // 用户信息表单
            form: {
                // 错误提示
                err: '',
                // 工号
                userName: '',
                // 密码
                password: '',
                // 确认密码
                confirmPassword: '',
                // 姓名
                name: '',
                // 性别
                gender: {},
                // 手机
                phone: '',
                // 邮箱
                email: '',
                // 角色
                role: {},
                // 部门
                department: {},
                // 状态
                status: {},
                // 地址
                address: '',
                // 等级
                grade: {},
                // 用户类型
                type: {},
                // 区域
                area: {},
                // 风场
                projects: [],
                // 肤色
                theme: {},
                // 公司
                company: {}
            },
            // 搜索
            searchValue: '',
            // 分页
            pager: {
                total: 0,
                pageSize: 10,
                currPage: 1
            },
            // 状态
            userStatus: [],
            // 性别
            gender: [],
            // 等级
            userGrade: [],
            // 用户类型
            userType: [],
            // 颜色
            theme: [],
            // 角色
            role: [],
            // 区域
            area: [],
            // 风场
            project: [],
            // 公司
            company: [],
            // 部门
            department: []
        };

        // 搜索
        this.search = this.search.bind(this);
        // 搜索用户列表
        this.getSearchUserList = this.getSearchUserList.bind(this);
        // 处理分页
        this.handlePageChange = this.handlePageChange.bind(this);

        // 展示添加弹框
        this.showModal = this.showModal.bind(this);
        // 展示修改弹框
        this.showModifyModal = this.showModifyModal.bind(this);
        // 展示修改弹框(修改密码)
        this.showModifypasswordModal = this.showModifypasswordModal.bind(this);
        // 关闭
        this.closeModal = this.closeModal.bind(this);

        // 创建用户
        this.createUser = this.createUser.bind(this);
        // 修改窗口
        this.modifyUser = this.modifyUser.bind(this);
        // 修改密码
        this.modifyPassword = this.modifyPassword.bind(this);
        // 删除用户
        this.removeUser = this.removeUser.bind(this);
        // 获取公共请求参数
        this.getPostData = this.getPostData.bind(this);

        // 清除错误
        this.cleanErr = this.cleanErr.bind(this);
        // 工号
        this.handleCreateUserChange = this.handleCreateUserChange.bind(this);
        // 姓名
        this.handleNameChange = this.handleNameChange.bind(this);
        // 性别
        this.handleGenderChange = this.handleGenderChange.bind(this);
        // 手机
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        // 邮箱
        this.handleEmailChange = this.handleEmailChange.bind(this);
        // 角色
        this.handleRoleChange = this.handleRoleChange.bind(this);
        // 部门
        this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
        // 状态
        this.handleStatusChange = this.handleStatusChange.bind(this);
        // 地址
        this.handleAddressChange = this.handleAddressChange.bind(this);
        // 等级
        this.handleGradeChange = this.handleGradeChange.bind(this);
        // 用户类型
        this.handleTypeChange = this.handleTypeChange.bind(this);
        // 区域
        this.handleAreaChange = this.handleAreaChange.bind(this);
        // 风场
        this.handleProjectChange = this.handleProjectChange.bind(this);
        // 肤色
        this.handleThemeChange = this.handleThemeChange.bind(this);
        // 密码
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        // 确认密码
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
        // 公司
        this.handleCompanyChange = this.handleCompanyChange.bind(this);
        // 表单验证
        this.canSubmit = this.canSubmit.bind(this);

        // 导出
        this.exportFile = this.exportFile.bind(this);
    }
    componentWillMount() {
        this.getSearchUserList();
        // 状态
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'userStatus'
            },
            success: function(res) {
                this.setState({
                    userStatus: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
        // 性别
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'gender'
            },
            success: function(res) {
                this.setState({
                    gender: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)

        });
        // 等级
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'userGrade'
            },
            success: function(res) {
                this.setState({
                    userGrade: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
        // 用户类型
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'userType'
            },
            success: function(res) {
                this.setState({
                    userType: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
        // 肤色
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'theme'
            },
            success: function(res) {
                this.setState({
                    theme: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
        // 区域
        this.props.getAreaList({
            success: function(res) {
                this.setState({
                    area: res.body.map((item) => {
                        return {
                            key: item.CODE,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
        // 风场
        this.props.getWindsiteListOnline({
            success: function(res) {
                this.setState({
                    project: !!res.body ? res.body.map((item) => {
                        return {
                            key: item.CODE_,
                            value: item.NAME_
                        };
                    }) : []
                });
            }.bind(this)
        });
        // 部门
        this.props.getDepartmentList({
            success: function(res) {
                this.setState({
                    department: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
        // 角色
        this.props.getRoleList({
            success: function(res) {
                this.setState({
                    role: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
        // 公司
        this.props.getCompanyList({
            success: function(res) {
                this.setState({
                    company: res.body.map((item) => {
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
            this.getSearchUserList(1, keyword);
        }.bind(this));
    }
    getSearchUserList(currPage, keyword) {
        let hasAuth = User.hasAuth('user__query');
        if (!hasAuth) {
            return false;
        }
        let searchValue = !!keyword ? keyword : this.state.searchValue;
        this.props.getSearchUserList({
            data: {
                currentPage: currPage || this.state.pager.currPage,
                showCount: this.state.pager.pageSize,
                KEYWORD: searchValue
            },
            success: function() {
                $(document.body).removeClass('btnLoading');
                let pager = this.state.pager;
                pager.total = this.props.pageUserListObj.totalResult;
                pager.currPage = currPage || 1;
                this.setState({
                    pager: pager
                });
            }.bind(this)
        })
    }
    handlePageChange(currPage) {
        let pager = this.state.pager;
        pager.currPage = currPage;
        this.setState({
            pager: pager
        }, function() {
            this.getSearchUserList(currPage);
        }.bind(this));
    }
    showModal() {
        let hasAuth = User.hasAuth('user__add');
        if (!hasAuth) {
            return false;
        }
        this.setState({
            showModal: true,
            isCreate: true
        });
    }
    showModifypasswordModal(user) {
        let hasAuth = User.hasAuth('user__edit');
        if (!hasAuth) {
            return false;
        }
        let form = this.state.form;
        this.setState({
            modifyPassword: true,
            editingUser: user,
            form: form
        })
    }
    showModifyModal(user) {
        let hasAuth = User.hasAuth('user__edit');
        if (!hasAuth) {
            return false;
        }
        let form = this.state.form;
        let targetArea = this.props.areaList.find((item) => item.CODE == user.AREA);
        // 姓名
        form.name = user.NAME;
        // 工号
        form.userName = user.USER_NAME;
        // 性别
        form.gender = {
            id: user.GENDER,
            name: user.GENDER_NAME
        };
        // 手机
        form.phone = user.PHONE;
        // 邮箱
        form.email = user.EMAIL;
        // 角色
        form.role = {
            id: user.ROLE,
            name: user.ROLE_NAME
        };
        // 公司
        form.company = {
            id: user.COMPANY,
            name: user.COMPANY_NAME
        };
        // 部门
        form.department = {
            id: user.DEPARTMENT,
            name: user.DEPARTMENT_NAME
        };
        // 状态
        form.status = {
            id: user.STATUS,
            name: user.STATUS_NAME
        };
        // 等级
        form.grade = {
            id: user.LEVEL,
            name: user.LEVEL_NAME
        };
        // 区域
        form.area = {
            code: !!targetArea ? targetArea.CODE : '',
            name: !!targetArea ? targetArea.NAME : (user.AREA_NAME || '')
        };
        // 风场
        form.projects = !!user.PROJECTS ? user.PROJECTS.split(',') : [];
        // 用戶類型
        form.type = {
            id: user.USER_TYPE,
            name: user.USER_TYPE_NAME
        };
        // 地址
        form.address = user.ADDRESS;
        // 肤色
        form.theme = {
            id: user.THEME,
            name: user.THEME_NAME
        };
        this.setState({
            editingUser: user,
            isCreate: false,
            showModal: true,
            form: form
        });
    }
    closeModal() {
        this.setState({
            showModal: false,
            modifyPassword: false,
            form: {
                // 错误提示
                err: '',
                // 工号
                userName: '',
                // 密码
                password: '',
                // 确认密码
                confirmPassword: '',
                // 姓名
                name: '',
                // 性别
                gender: {},
                // 手机
                phone: '',
                // 邮箱
                email: '',
                // 角色
                role: {},
                // 部门
                department: {},
                // 状态
                status: {},
                // 地址
                address: '',
                // 等级
                grade: {},
                // 用户类型
                type: {},
                // 区域
                area: {},
                // 风场
                projects: [],
                // 肤色
                theme: {},
                // 公司
                company: {}
            },
            editingUser: {}
        });
    }
    createUser() {
        let form = this.state.form;
        let data = '添加';
        let canSubmit = this.canSubmit(form,data);
        if (!canSubmit) {
            return false;
        }
        let postData = this.getPostData(form);
        if (!!postData.AREA) {
            delete postData.PROJECTS;
        }
        if (!!postData.PROJECTS) {
            delete postData.AREA;
        }

        this.props.createUser({
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
                this.getSearchUserList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('添加失败');
            }.bind(this)
        });
    }
    modifyUser() {
        let user = this.state.editingUser;
        let form = this.state.form;
        let canSubmit = this.canSubmit(form);
        if (!canSubmit) {
            return false;
        }
        let postData = this.getPostData(form);
        delete postData.PASSWORD;
        if (postData.USER_TYPE == 10) {
            delete postData.AREA;
            delete postData.PROJECTS;
        }
        if (postData.USER_TYPE == 11) {
            delete postData.PROJECTS;
        }
        if (postData.USER_TYPE == 124) {
            delete postData.AREA;
        }

        postData = Object.assign({}, postData, {
            ID: user.ID
        });
        this.props.modifyUser({
            data: postData,
            success: function() {
                Utils.tooltip('修改成功');
                this.closeModal();
                this.getSearchUserList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('修改失败');
            }
        });
    }
    modifyPassword() {
        let user = this.state.editingUser;
        let form = this.state.form;
        if (!form.password) {
            form.err = '请输入密码';
            this.setState({
                form: form
            });
            return false;
        }
        if (form.password != form.confirmPassword) {
            form.err = '两次密码输入不正确';
            this.setState({
                form: form
            });
            return false;
        }
        this.props.modifyPassword({
            data: {
                ID: user.ID,
                PASSWORD: form.password
            },
            success: function() {
                Utils.tooltip('修改成功');
                this.closeModal();
                this.getSearchUserList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('修改失败');
            }
        });
    }
    removeUser(user) {
        let hasAuth = User.hasAuth('user__delete');
        if (!hasAuth) {
            return false;
        }
        this.props.removeUser({
            data: {
                ID: user.ID
            },
            success: function() {
                Utils.tooltip('删除成功');
                this.getSearchUserList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('删除失败');
            }
        });
    }
    getPostData(form) {
        let postData = {
            NAME: form.name,
            USER_NAME: form.userName,
            PASSWORD: form.password,
            STATUS: form.status.id,
            GENDER: form.gender.id,
            EMAIL: form.email,
            PHONE: form.phone,
            ADDRESS: form.address,
            LEVEL: form.grade.id,
            AREA: form.area.code,
            PROJECTS: form.projects.join(','),
            DEPARTMENT: form.department.id,
            COMPANY: form.company.id,
            ROLE: form.role.id,
            THEME: form.theme.id,
            USER_TYPE: form.type.id
        };
        return postData;
    }
    cleanErr() {
        let form = this.state.form;
        form.err = '';
        this.setState({
            form: form
        });
    }
    handleCreateUserChange(event) {
        let form = this.state.form;
        form.userName = event.target.value;
        this.setState({
            form: form
        });
    }
    handlePasswordChange(event) {
        let form = this.state.form;
        form.password = event.target.value;
        this.setState({
            form: form
        });
    }
    handleConfirmPasswordChange(event) {
        let form = this.state.form;
        form.confirmPassword = event.target.value;
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
    handleNameChange(event) {
        let form = this.state.form;
        form.name = event.target.value;
        this.setState({
            form: form
        });
    }
    handleGenderChange(option) {
        let form = this.state.form;
        form.gender = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    handlePhoneChange(event) {
        let form = this.state.form;
        form.phone = event.target.value;
        this.setState({
            form: form
        });
    }
    handleEmailChange(event) {
        let form = this.state.form;
        form.email = event.target.value;
        this.setState({
            form: form
        });
    }
    handleRoleChange(option) {
        let form = this.state.form;
        form.role = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    handleDepartmentChange(option) {
        let form = this.state.form;
        form.department = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    handleStatusChange(option) {
        let form = this.state.form;
        form.status = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    handleAddressChange(event) {
        let form = this.state.form;
        form.address = event.target.value;
        this.setState({
            form: form
        });
    }
    handleGradeChange(option) {
        let form = this.state.form;
        form.grade = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    handleTypeChange(option) {
        let form = this.state.form;
        form.area = {};
        form.projects = [];
        form.type = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    handleAreaChange(option) {
        let form = this.state.form;
        form.area = {
            code: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    handleProjectChange(project) {
        let form = this.state.form;
        if (form.projects.indexOf(project.key) == -1) {
            form.projects.push(project.key);
        } else {
            form.projects = form.projects.filter((item) => item != project.key);
        }
        this.setState({
            form: form
        });
    }
    handleThemeChange(option) {
        let form = this.state.form;
        form.theme = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    canSubmit(form,data) {
        let canSubmit = true;
        if (this.state.saving) {
            return false;
        }
        if (!form.userName) {
            form.err = '请输入工号';
            this.setState({
                form: form
            });
            return false;
        }
        if (!!data && !form.password) {
            form.err = '请输入密码';
            this.setState({
                form: form
            });
            return false;
        }
        if (!!data && form.password != form.confirmPassword) {
            form.err = '两次密码输入不正确';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.name) {
            form.err = '请输入姓名';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.company.id) {
            form.company = {
                id: 1,
                name: '明阳智慧能源集团股份公司'
            };
            this.setState({
                form: form
            });
        }
        if (!form.phone) {
            form.err = '请输入手机号码';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.email) {
            form.err = '请输入邮箱';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.gender.id) {
            form.gender = {
                id: 4,
                name: '男'
            };
            this.setState({
                form: form
            });
        }
        if (!form.role.id) {
            form.role = {
                id: 5,
                name: '普通用户'
            }
            this.setState({
                form: form
            });
        }
        if (!form.department.id) {
            form.err = '请选择部门';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.status.id) {
            form.status = {
                id: 1,
                name: '正常'
            };
            this.setState({
                form: form
            });
        }
        if (!form.grade.id) {
            form.err = '请选择等级';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.type.id) {
            form.type = {
                id: 10,
                name: '总部用户'
            };
            this.setState({
                form: form
            });
        }
        if (!form.theme.id) {
            form.theme = {
                id: 8,
                name: '暗色'
            };
            this.setState({
                form: form
            });
        }
        return canSubmit;
    }
    exportFile() {
        let hasAuth = User.hasAuth('user__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportUser');
        form.submit();
    }
    render() {
        let userInfo = User.get();
        let form = this.state.form;
        let searchUserList = this.props.searchUserList || [];
        let selectedGender = {
            key: 4,
            value: '男'
        };
        let selectedRole = {
            key: 5,
            value: '普通用户'
        };
        let selectedDepartment = {};
        let selectedUserStatus = {
            key: 1,
            value: '正常'
        };
        let selectedUserGrade = {};
        let selectedUserType = {
            key: 10,
            value: '总部用户'
        };
        let selectedUserArea = {};
        let selectedUserProject = form.projects || [];
        let selectedUserTheme = {
            key: 8,
            value: '暗色'
        };
        let selectedCompany = {
            key: 1,
            value: '明阳智慧能源集团股份公司'
        };
        if (!!this.state.editingUser && !this.state.isCreate) {
            selectedGender = {
                key: form.gender.id,
                value: form.gender.name
            };
            selectedRole = {
                key: form.role.id,
                value: form.role.name
            };
            selectedDepartment = {
                key: form.department.id,
                value: form.department.name
            };
            selectedUserStatus = {
                key: form.status.id,
                value: form.status.name
            };
            selectedUserGrade = {
                key: form.grade.id,
                value: form.grade.name
            };
            selectedUserType = {
                key: form.type.id,
                value: form.type.name
            };
            selectedUserArea = {
                key: form.area.code,
                value: form.area.name
            };
            selectedUserTheme = {
                key: form.theme.id,
                value: form.theme.name
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
                            <span className='panelTitle'>用户管理</span>
                            <form id='exportUser' action={Constant.API_ROOT + '/user/user/exportExcel'} method='POST' target=''>
                                <input type='hidden' id='token' name='token' value={userInfo.token} />
                                <input type='hidden' id='KEYWORD' name='KEYWORD' value={this.state.searchValue} />
                                <span className='panelExport' onClick={this.exportFile}></span>
                            </form>
                            <span className='panelAdd' onClick={this.showModal}></span>
                        </div>
                        <div className='panelBody'>
                            <Search
                                onSearch={this.search} />
                            <div className={style.tab}>
                                {searchUserList.length > 0 ?
                                <TableOperation
                                    tableId='workbench'
                                    table={searchUserList}
                                    ths={['用户ID','工号', '姓名', '性别', '手机号', '邮箱', '角色','部门','操作']}
                                    keys={['ID', 'USER_NAME', 'NAME', 'GENDER_NAME','PHONE', 'EMAIL', 'ROLE_NAME','DEPARTMENT_NAME']}
                                    hasOrder={false}
                                    pageShow={true}
                                    totalRow={10}
                                    pager={this.state.pager}
                                    onPageChange={this.handlePageChange}
                                    onModify={this.showModifyModal}
                                    onModifypassword={this.showModifypasswordModal}
                                    onDelete={this.removeUser}
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
                                <div className='modalFormPanel'>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>工号：</label>
                                        <input type='text' value={this.state.form.userName} className='modalFormInput' onChange={this.handleCreateUserChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className={this.state.isCreate ? 'modalFormItem' : 'none'}>
                                        <label className='modalFormLabel'>密码：</label>
                                        <input type='password' value={this.state.form.password} className='modalFormInput' onChange={this.handlePasswordChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>姓名：</label>
                                        <input type='text' value={this.state.form.name} className='modalFormInput' onChange={this.handleNameChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>性别：</label>
                                        <div className={style.companySelect}>
                                            <Dropdown
                                                overlayCls={style.overlayCls}
                                                selectedItem={selectedGender}
                                                options={this.state.gender}
                                                onSelect={this.handleGenderChange} />
                                        </div>
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>手机号：</label>
                                        <input type='text' value={this.state.form.phone} className='modalFormInput' onChange={this.handlePhoneChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>邮箱：</label>
                                        <input type='text' value={this.state.form.email} className='modalFormInput' onChange={this.handleEmailChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>角色：</label>
                                        <div className={style.companySelect}>
                                            <Dropdown
                                                overlayCls={style.overlayCls}
                                                selectedItem={selectedRole}
                                                options={this.state.role}
                                                onSelect={this.handleRoleChange} />
                                        </div>
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>部门：</label>
                                        <div className={style.companySelect}>
                                            <Dropdown
                                                overlayCls={style.overlayCls}
                                                selectedItem={selectedDepartment}
                                                options={this.state.department}
                                                onSelect={this.handleDepartmentChange} />
                                        </div>
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>肤色：</label>
                                        <div className={style.companySelect}>
                                            <Dropdown
                                                overlayCls={style.overlayCls}
                                                selectedItem={selectedUserTheme}
                                                options={this.state.theme}
                                                onSelect={this.handleThemeChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className='modalFormPanel'>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>状态：</label>
                                        <div className={style.companySelect}>
                                            <Dropdown
                                                overlayCls={style.overlayCls}
                                                selectedItem={selectedUserStatus}
                                                options={this.state.userStatus}
                                                onSelect={this.handleStatusChange} />
                                        </div>
                                    </div>
                                    <div className={this.state.isCreate ? 'modalFormItem' : 'none'}>
                                        <label className='modalFormLabel'>确认密码：</label>
                                        <input type='password' value={this.state.form.confirmPassword} className='modalFormInput' onChange={this.handleConfirmPasswordChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>地址：</label>
                                        <input type='text' value={this.state.form.address} className='modalFormInput' onChange={this.handleAddressChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>公司名称：</label>
                                        <div className={style.companySelect}>
                                            <Dropdown
                                                overlayCls={style.overlayCls}
                                                selectedItem={selectedCompany}
                                                options={this.state.company}
                                                onSelect={this.handleCompanyChange} />
                                        </div>
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>等级：</label>
                                        <div className={style.companySelect}>
                                            <Dropdown
                                                overlayCls={style.overlayCls}
                                                selectedItem={selectedUserGrade}
                                                options={this.state.userGrade}
                                                onSelect={this.handleGradeChange} />
                                        </div>
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>用户类型：</label>
                                        <div className={style.companySelect}>
                                            <Dropdown
                                                overlayCls={style.overlayCls}
                                                selectedItem={selectedUserType}
                                                options={this.state.userType}
                                                onSelect={this.handleTypeChange} />
                                        </div>
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>区域：</label>
                                        <div className={style.companySelect}>
                                            <Dropdown
                                                isDisabled={form.type.name != '区域用户'}
                                                overlayCls={style.overlayCls}
                                                selectedItem={selectedUserArea}
                                                options={this.state.area}
                                                onSelect={this.handleAreaChange} />
                                        </div>
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>风场：</label>
                                        <div className={style.companySelect}>
                                            <Dropdown
                                                isDisabled={form.type.name != '风场用户'}
                                                isMultiple={true}
                                                overlayCls={style.overlayCls}
                                                selectedKeys={selectedUserProject}
                                                options={this.state.project}
                                                onSelect={this.handleProjectChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className='modalFormBtns'>
                                    <div className='modalFormConfirmBtn' onClick={this.state.isCreate ? this.createUser : this.modifyUser}>确认</div>
                                    <div className='modalFormCancelBtn' onClick={this.closeModal}>取消</div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={this.state.modifyPassword}
                        onClose={this.closeModal}>
                        <div className='modalForm'>
                            <div className='panel'>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>{'修改密码'}</span>
                                </div>
                                <div className='modalFormErr'>{this.state.form.err}</div>
                                <div className='modalFormPanel'>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>密码：</label>
                                        <input type='password' value={this.state.form.password} className='modalFormInput' onChange={this.handlePasswordChange} onFocus={this.cleanErr} />
                                    </div>
                                </div>
                                <div className='modalFormPanel'>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>确认密码：</label>
                                        <input type='password' value={this.state.form.confirmPassword} className='modalFormInput' onChange={this.handleConfirmPasswordChange} onFocus={this.cleanErr} />
                                    </div>
                                </div>
                                <div className='modalFormBtns'>
                                    <div className='modalFormConfirmBtn' onClick={this.modifyPassword}>确认</div>
                                    <div className='modalFormCancelBtn' onClick={this.closeModal}>取消</div>
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
        pageUserListObj: state.user.pageUserListObj || {},
        createUser: state.user.createUser,
        // 状态
        parameter: state.parameter.parameter || {},
        // 区域
        areaList: state.area.areaList || [],
        // 部门
        departmentList: state.departments.departmentList || [],
        // 角色
        roleList: state.role.roleList || [],
        // 搜索
        searchUserList: state.user.searchUserList || [],
        // 公司列表
        companyList: state.company.companyList || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        createUser: function({ data, before, after, success, fail }) {
            dispatch(actions.createUser({ data, before, after, success, fail }));
        },
        removeUser: function({ data, before, after, success, fail }) {
            dispatch(actions.removeUser({ data, before, after, success, fail }));
        },
        modifyUser: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyUser({ data, before, after, success, fail }));
        },
        modifyPassword: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyPassword({ data, before, after, success, fail }));
        },
        getParameterByTypeCode: function({ data, before, after, success, fail }) {
            dispatch(actions.getParameterByTypeCode({ data, before, after, success, fail }));
        },
        getAreaList: function({ data, before, after, success, fail }) {
            dispatch(actions.getAreaList({ data, before, after, success, fail }));
        },
        getWindsiteListOnline: function({ data, before, after, success, fail }) {
            dispatch(actions.getWindsiteListOnline({ data, before, after, success, fail }));
        },
        getDepartmentList: function({ data, before, after, success, fail }) {
            dispatch(actions.getDepartmentList({ data, before, after, success, fail }));
        },
        getRoleList: function({ data, before, after, success, fail }) {
            dispatch(actions.getRoleList({ data, before, after, success, fail }));
        },
        getSearchUserList: function({ data, before, after, success, fail }) {
            dispatch(actions.getSearchUserList({ data, before, after, success, fail }));
        },
        getCompanyList: function({ data, before, after, success, fail }) {
            dispatch(actions.getCompanyList({ data, before, after, success, fail }));
        }
    }
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(UserManagement);
