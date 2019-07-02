// 参数类型管理
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

class ParameterConfigurationManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否新建
            isCreate: true,
            // 正在编辑的角色
            editingRole: {},
            // 是否展示分页
            pageShow: true,
            // 是否展示弹框
            showModal: false,
            // 是否正在保存
            saving: false,
            // 表单
            form: {
                err: '',
                code: '',
                name: '',
                description: ''
            },
            // 分页
            pager: {
                total: 1,
                pageSize: 10,
                currPage: 1
            },
            // 参数类型列表
            paramtypeList: [],
            // 搜索条件
            searchKey: ''
        };

        // 搜索
        this.search = this.search.bind(this);
        // 导出文件
        this.exportFile = this.exportFile.bind(this);
        // 处理分页变化
        this.handlePageChange = this.handlePageChange.bind(this);
        // 添加弹出浮层
        this.addParameteType = this.addParameteType.bind(this);
        // 关闭弹框
        this.closeModal = this.closeModal.bind(this);
        // 清除错误
        this.cleanErr = this.cleanErr.bind(this);
        // 处理名称变化
        this.handleNameChange = this.handleNameChange.bind(this);
        // 处理编码变化
        this.handleCodeChange = this.handleCodeChange.bind(this);
        // 处理描述变化
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        // 参数类型列表
        this.getPageParamTypeList = this.getPageParamTypeList.bind(this);
        // 创建
        this.createParamType = this.createParamType.bind(this);
        // 修改
        this.modifyParamType = this.modifyParamType.bind(this);
        // 展示修改弹框
        this.showmodifyParamType = this.showmodifyParamType.bind(this);
        // 删除
        this.removeParamType = this.removeParamType.bind(this);
    }
    componentWillMount(currPage) {
        this.getPageParamTypeList(currPage);
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
    }
    handlePageChange(currPage) {
        let pager = this.state.pager;
        pager.currPage = currPage;
        this.setState({
            pager: pager
        });
        this.getPageParamTypeList(currPage);
    }
    getPageParamTypeList(currPage) {
        let hasAuth = User.hasAuth('paramType__query');
        if (!hasAuth) {
            return false;
        }
        this.props.getPageParamTypeList({
            data: {
                currentPage: currPage || this.state.pager.currPage,
                showCount: this.state.pager.pageSize
            },
            success: function(res) {
                $(document.body).removeClass('btnLoading');
                let pager = this.state.pager;
                pager.total = this.props.pageParamTypeListObj.totalResult;
                this.setState({
                    pager: pager,
                    paramtypeList: res.body.pageData || []
                });
            }.bind(this)
        });
    }
    addParameteType() {
        let hasAuth = User.hasAuth('paramType__add');
        if (!hasAuth) {
            return false;
        }
        this.setState({
            showModal: true,
            isCreate: true
        });
    }
    closeModal() {
        this.setState({
            showModal: false
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
    cleanErr() {
        let form = this.state.form;
        form.err = '';
        this.setState({
            form: form
        });
    }
    createParamType() {
        let form = this.state.form;
        if (this.state.saving) {
            return false;
        }
        if (!form.name) {
            form.err = '请输入参数名称';
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
        if (!form.description) {
            form.err = '请输入参数描述';
            this.setState({
                form: form
            });
            return false;
        }
        this.props.createParamType({
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
                this.getPageParamTypeList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('添加失败');
            }
        });
    }
    modifyParamType() {
        let parameTeye = this.state.editingRole;
        let form = this.state.form;
        if (!form.name) {
            form.err = '请输入参数名称';
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
        if (!form.description) {
            form.err = '请输入参数描述';
            this.setState({
                form: form
            });
            return false;
        }
        this.props.modifyParamType({
            data: {
                ID: parameTeye.ID,
                NAME: form.name,
                CODE: form.code,
                DESCRIPTION: form.description
            },
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
                this.getPageParamTypeList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('修改失败');
            }
        });
    }
    removeParamType(parameTeye) {
        let hasAuth = User.hasAuth('paramType__delete');
        if (!hasAuth) {
            return false;
        }
        this.props.removeParamType({
            data: {
                ID: parameTeye.ID
            },
            success: function() {
                Utils.tooltip('删除成功');
                this.getPageParamTypeList();
            }.bind(this),
            fail: function() {
                Utils.tooltip('删除失败');
            }
        });
    }
    showmodifyParamType(parameTeye) {
        let hasAuth = User.hasAuth('paramType__edit');
        if (!hasAuth) {
            return false;
        }
        let form = this.state.form;
        form.name = parameTeye.NAME;
        form.code = parameTeye.CODE;
        form.description = parameTeye.DESCRIPTION;
        this.setState({
            editingRole: parameTeye,
            isCreate: false,
            showModal: true,
            form: form
        });
    }
    search(searchKey) {
        let hasAuth = User.hasAuth('paramType__query');
        if (!hasAuth) {
            return false;
        }
        let pager = this.state.pager;
        this.props.searchParamTypeList({
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
                    paramtypeList: res.body.pageData || []
                });
            }.bind(this)
        });
    }
    exportFile() {
        let hasAuth = User.hasAuth('paramType__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportParamtypes');
        form.submit();
    }
    render() {
        let userInfo = User.get();
        let pageParamTypeList = this.state.paramtypeList || [];
        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                 <div className='boxInner'>
                    <div className='panel'>
                        <div className='panelHeader'>
                            <span className='panelTitle'>参数类型管理</span>
                            <form id='exportParamtypes' action={Constant.API_ROOT + '/system/paramtype/exportExcel'} method='POST' target='_blank'>
                                <input type='hidden' id='token' name='token' value={userInfo.token} />
                                <input type='hidden' id='KEYWORD' name='KEYWORD' value={this.state.searchKey} />
                                <span className='panelExport' onClick={this.exportFile}></span>
                            </form>
                            <span className='panelAdd' onClick={this.addParameteType}></span>
                        </div>
                        <div className='panelBody'>
                            <Search
                                onSearch={this.search} />
                            <div className={style.tab}>
                                {pageParamTypeList.length > 0 ?
                                <TableOperation
                                    tableId='workbench'
                                    table={pageParamTypeList}
                                    ths={['序号', '参数编号', '', '参数名称', '描述', '操作']}
                                    keys={['CODE', '', 'NAME', 'DESCRIPTION']}
                                    pageShow={this.state.pageShow}
                                    hasOrder={true}
                                    pager={this.state.pager}
                                    totalRow={10}
                                    onPageChange={this.handlePageChange}
                                    onSelected={this.selectItem}
                                    onModify={this.showmodifyParamType}
                                    onDelete={this.removeParamType}
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
                                    <span className='panelTitle'>{this.state.isCreate ? '添加参数类型' : '编辑参数类型'}</span>
                                </div>
                                <div className='modalFormErr'>{this.state.form.err}</div>
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
                                    <div className='modalFormConfirmBtn' onClick={this.state.isCreate ? this.createParamType : this.modifyParamType}>确认</div>
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
        pageParameterList:state.parameter.pageParameterList || [],
        pageParameterListObj:state.parameter.pageParameterListObj || {},
        createParamType:state.parameter.createParamType,
        pageParamTypeList:state.paramtype.pageParamTypeList || [],
        pageParamTypeListObj:state.paramtype.pageParamTypeListObj || {}
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        createParamType: function({ data, before, after, success, fail }) {
            dispatch(actions.createParamType({ data, before, after, success, fail }));
        },
        removeParamType: function({ data, before, after, success, fail }) {
            dispatch(actions.removeParamType({ data, before, after, success, fail }));
        },
        modifyParamType: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyParamType({ data, before, after, success, fail }));
        },
        searchParamTypeList:function({ data, before, after, success, fail }) {
            dispatch(actions.searchParamTypeList({ data, before, after, success, fail }));
        },
        getPageParamTypeList:function({ data, before, after, success, fail }) {
            dispatch(actions.getPageParamTypeList({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ParameterConfigurationManagement);
