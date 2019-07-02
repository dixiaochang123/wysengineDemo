// 参数管理
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

class ParameterManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否创建参数
            isCreate: true,
            // 编辑中的参数
            editingParameter: {},
            // 展示创建、编辑弹窗
            showModal: false,
            // 表单
            form: {
                err: '',
                code: '',
                name: '',
                paramType: {},
                description: ''
            },
            // 分页
            pager: {
                total: 1,
                pageSize: 10,
                currPage: 1
            },
            // 参数类型
            paramTypes: [],
            // 参数列表
            parameterList: [],
            // 搜索值
            searchValue: ''
        };

        // 搜索参数列表
        this.searchParameterList = this.searchParameterList.bind(this);
        // 翻页
        this.handlePageChange = this.handlePageChange.bind(this);

        // 搜索
        this.search = this.search.bind(this);
        // 导出
        this.exportParameter = this.exportParameter.bind(this);

        // 添加弹出浮层
        this.showModal = this.showModal.bind(this);
        // 显示修改弹窗
        this.showModifyModal = this.showModifyModal.bind(this);
        // 关闭弹窗
        this.closeModal = this.closeModal.bind(this);

        // 创建参数
        this.createParameter = this.createParameter.bind(this);
        // 修改参数
        this.modifyParameter = this.modifyParameter.bind(this);
        // 删除参数
        this.removeParameter = this.removeParameter.bind(this);
        // 验证表单是否可提交
        this.canSubmit = this.canSubmit.bind(this);

        // 清除错误
        this.cleanErr = this.cleanErr.bind(this);
        // 参数名变化
        this.handleNameChange = this.handleNameChange.bind(this);
        // 参数类型变化
        this.handleParamTypeChange = this.handleParamTypeChange.bind(this);
        // 参数编码变化
        this.handleCodeChange = this.handleCodeChange.bind(this);
        // 参数描述变化
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    }
    componentWillMount() {
        this.searchParameterList(1);
        this.props.getParamTypeList({
            success: function(res) {
                this.setState({
                    paramTypes: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
    }
    searchParameterList(currPage) {
        let hasAuth = User.hasAuth('param__query');
        if (!hasAuth) {
            return false;
        }
        this.props.searchParameterListPage({
            data: {
                currentPage: currPage || this.state.pager.currPage || 1,
                showCount: this.state.pager.pageSize,
                KEYWORD: this.state.searchValue
            },
            success: function(res) {
                $(document.body).removeClass('btnLoading');
                let pager = this.state.pager;
                pager.currPage = currPage || this.state.pager.currPage || 1;
                pager.total = res.body.totalResult;
                this.setState({
                    pager: pager,
                    parameterList: res.body.pageData || []
                });
            }.bind(this)
        });
    }
    handlePageChange(currPage) {
        let pager = this.state.pager;
        pager.currPage = currPage;
        this.setState({
            pager: pager
        }, function() {
            this.searchParameterList(currPage);
        }.bind(this));
    }
    search(keyword) {
        this.setState({
            searchValue: keyword
        }, function() {
            this.searchParameterList(1);
        });
    }
    exportParameter() {
        let hasAuth = User.hasAuth('param__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportParameter');
        form.submit();
    }
    showModal() {
        let hasAuth = User.hasAuth('param__add');
        if (!hasAuth) {
            return false;
        }
        this.setState({
            showModal: true,
            isCreate: true
        });
    }
    showModifyModal(parameter) {
        let hasAuth = User.hasAuth('param__edit');
        if (!hasAuth) {
            return false;
        }
        let form = this.state.form;
        form.name = parameter.NAME;
        form.code = parameter.CODE;
        form.description = parameter.DESCRIPTION;
        form.paramType = {
            id: parameter.PARAM_TYPE,
            name: parameter.PARAM_TYPE_NAME
        };
        this.setState({
            editingParameter: parameter,
            isCreate: false,
            showModal: true,
            form: form
        });
    }
    closeModal() {
        this.setState({
            showModal: false,
            editingParameter: {},
            form: {
                err: '',
                code: '',
                name: '',
                paramType: {},
                description: ''
            }
        });
    }
    createParameter() {
        let form = this.state.form;
        let canSubmit = this.canSubmit(form);
        if (!canSubmit) {
            return false;
        }

        this.props.createParameter({
            data: {
                CODE: form.code,
                NAME: form.name,
                DESCRIPTION: form.description,
                PARAM_TYPE: form.paramType.id
            },
            success: function() {
                Utils.tooltip('添加成功');
                this.closeModal();
                this.searchParameterList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('添加失败');
            }
        });
    }
    modifyParameter() {
        let parameter = this.state.editingParameter;
        let form = this.state.form;

        let canSubmit = this.canSubmit(form);
        if (!canSubmit) {
            return false;
        }

        this.props.modifyParameter({
            data: {
                ID: parameter.ID,
                NAME: form.name,
                CODE: form.code,
                DESCRIPTION: form.description,
                PARAM_TYPE: form.paramType.id
            },
            success: function() {
                Utils.tooltip('修改成功');
                this.closeModal();
                this.searchParameterList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('修改失败');
            }
        });
    }
    removeParameter(parameter) {
        let hasAuth = User.hasAuth('param__delete');
        if (!hasAuth) {
            return false;
        }
        this.props.removeParameter({
            data: {
                ID: parameter.ID
            },
            success: function() {
                Utils.tooltip('删除成功');
                this.searchParameterList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('删除失败');
            }
        });
    }
    canSubmit(form) {
        if (this.state.saving) {
            return false;
        }

        let canSubmit = true;
        if (!form.paramType.id) {
            form.err = '请选择参数类型';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.code) {
            form.err = '请输入参数编码';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.name) {
            form.err = '请输入参数名称';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.description) {
            form.err = '请输入参数描述';
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
    handleCodeChange(event) {
        let form = this.state.form;
        form.code = event.target.value;
        this.setState({
            form: form
        });
    }
    handleParamTypeChange(option) {
        let form = this.state.form;
        form.paramType = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    render() {
        let userInfo = User.get();
        let pageParameterList = this.state.parameterList || [];
        let selectedUserParamType = {};
        if (!!this.state.editingParameter && !this.state.isCreate) {
            let form = this.state.form;
            selectedUserParamType = {
                key: form.paramType.id,
                value: form.paramType.name
            };
        }

        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                 <div className='boxInner'>
                    <div className='panel'>
                        <div className='panelHeader'>
                            <span className='panelTitle'>参数管理</span>
                            <form id='exportParameter' action={Constant.API_ROOT + '/system/parameter/exportExcel'} method='POST' target='_blank'>
                                <input type='hidden' id='token' name='token' value={userInfo.token} />
                                <input type='hidden' id='KEYWORD' name='KEYWORD' value={this.state.searchValue} />
                                <span className='panelExport' onClick={this.exportParameter}></span>
                            </form>
                            <span className='panelAdd' onClick={this.showModal}></span>
                        </div>
                        <div className='panelBody'>
                            <Search
                                onSearch={this.search} />
                            <div className={style.tab}>
                                {pageParameterList.length > 0 ?
                                <TableOperation
                                    tableId='workbench'
                                    table={pageParameterList}
                                    ths={['序号','参数类型','','参数编号','参数名称','描述','操作']}
                                    keys={['PARAM_TYPE_NAME','','CODE','NAME','DESCRIPTION']}
                                    pageShow={true}
                                    hasOrder={true}
                                    pager={this.state.pager}
                                    totalRow={10}
                                    onPageChange={this.handlePageChange}
                                    onModify={this.showModifyModal}
                                    onDelete={this.removeParameter}
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
                                    <span className='panelTitle'>{this.state.isCreate ? '添加参数' : '编辑参数'}</span>
                                </div>
                                <div className='modalFormErr'>{this.state.form.err}</div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>参数类型：</label>
                                    <div className={style.companySelect}>
                                        <Dropdown
                                            overlayCls={style.overlayCls}
                                            selectedItem={selectedUserParamType}
                                            options={this.state.paramTypes}
                                            onSelect={this.handleParamTypeChange}/>
                                    </div>
                                </div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>参数编码：</label>
                                    <input type='text' value={this.state.form.code} className='modalFormInput' onChange={this.handleCodeChange} onFocus={this.cleanErr} />
                                </div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>参数名称：</label>
                                    <input type='text' value={this.state.form.name} className='modalFormInput' onChange={this.handleNameChange} onFocus={this.cleanErr} />
                                </div>
                                <div className='modalFormItem'>
                                    <label className='modalFormLabel'>参数描述：</label>
                                    <input type='text' value={this.state.form.description} className='modalFormInput' onChange={this.handleDescriptionChange} onFocus={this.cleanErr} />
                                </div>
                                <div className='modalFormBtns'>
                                    <div className='modalFormConfirmBtn' onClick={this.state.isCreate ? this.createParameter : this.modifyParameter}>确认</div>
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

let mapStateToProps = function() {
    return {};
};

let mapDispatchToProps = function(dispatch) {
    return {
        createParameter: function({ data, before, after, success, fail }) {
            dispatch(actions.createParameter({ data, before, after, success, fail }));
        },
        removeParameter: function({ data, before, after, success, fail }) {
            dispatch(actions.removeParameter({ data, before, after, success, fail }));
        },
        modifyParameter: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyParameter({ data, before, after, success, fail }));
        },
        searchParameterListPage:function({ data, before, after, success, fail }) {
            dispatch(actions.searchParameterListPage({ data, before, after, success, fail }));
        },
        getParamTypeList:function({ data, before, after, success, fail }) {
            dispatch(actions.getParamTypeList({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ParameterManagement);
