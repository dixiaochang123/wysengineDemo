// 通用点表
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

class UniversalTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 展示创建、编辑弹窗
            showModal: false,
            // 正在保存创建的点位
            saving: false,
            // 是否创建
            isCreate: true,
            // 编辑中的点位
            editingConfig: {},
            // 表单
            form: {
                // 错误提示
                err: '',
                // 原始名称
                tagName: '',
                // 标准名称
                tagNameCom: '',
                // 描述
                description: '',
                // 机型
                turbineModel: {},
                // 排序
                orderIndex: ''
            },
            //搜索
            searchValue: '',
            // 分页
            pager: {
                total: 1,
                pageSize: 10,
                currPage: 1
            },
            // 机型列表
            turbineModelList: []
        }

        // 获取点位列表
        this.getTurbineConfigListPage = this.getTurbineConfigListPage.bind(this);
        // 翻页
        this.handlePageChange = this.handlePageChange.bind(this);

        // 搜索
        this.search = this.search.bind(this);
        // 导出
        this.exportSelect = this.exportSelect.bind(this);

        // 展示添加弹窗
        this.showModal = this.showModal.bind(this);
        // 展示编辑弹窗
        this.showModifyModal = this.showModifyModal.bind(this);
        // 关闭弹窗
        this.closeModal = this.closeModal.bind(this);

        // 创建点位
        this.createTurbineConfig = this.createTurbineConfig.bind(this);
        // 修改点位
        this.modifyTurbineConfig = this.modifyTurbineConfig.bind(this);
        // 移除点位
        this.removeTurbineConfig = this.removeTurbineConfig.bind(this);
        // 验证表单可以提交
        this.canSubmit = this.canSubmit.bind(this);

        // 清除错误
        this.cleanErr = this.cleanErr.bind(this);
        // 原始名称
        this.handleTagNameChange = this.handleTagNameChange.bind(this);
        // 标准名称
        this.handleTagNameComChange = this.handleTagNameComChange.bind(this);
        // 描述
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        // 机型
        this.handleturbineModelChange = this.handleturbineModelChange.bind(this);
        // 排序号
        this.handleOrderIndexChange = this.handleOrderIndexChange.bind(this);
    }
    componentWillMount() {
        this.getTurbineConfigListPage(1);
        // 机型
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'turbineModel'
            },
            success: function(res) {
                this.setState({
                    turbineModelList: res.body.map(function(item) {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
    }
    getTurbineConfigListPage(currPage) {
        let hasAuth = User.hasAuth('turbineConfig__query');
        if (!hasAuth) {
            return false;
        }
        let searchValue = this.state.searchValue;
        this.props.getTurbineConfigListPage({
            data: {
                currentPage: currPage || this.state.pager.currPage || 1,
                showCount: this.state.pager.pageSize,
                TAG_NAME: searchValue
            },
            success: function() {
                $(document.body).removeClass('btnLoading');
                let pager = this.state.pager;
                pager.total = this.props.turibineConfigListPage[0].totalResult;
                pager.currPage = currPage || this.state.pager.currPage || 1;
                this.setState({
                    pager: pager
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
        this.getTurbineConfigListPage(currPage);
    }
    search(keyword) {
        this.setState({
            searchValue: keyword
        }, function() {
            this.getTurbineConfigListPage(1);
        }.bind(this));
    }
    exportSelect() {
        let hasAuth = User.hasAuth('turbineConfig__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportUniversalTable');
        form.submit();
    }
    showModal() {
        let hasAuth = User.hasAuth('turbineConfig__add');
        if (!hasAuth) {
            return false;
        }
        this.setState({
            showModal: true,
            isCreate: true
        });
    }
    showModifyModal(user) {
        let hasAuth = User.hasAuth('turbineConfig__edit');
        if (!hasAuth) {
            return false;
        }
        let form = this.state.form;
        form.tagName = user.TAG_NAME;
        form.tagNameCom = user.TAG_NAME_COM;
        form.description = user.DESCRIPTION;
        form.turbineModel = {
            id: user.TURBINE_MODEL,
            name: user.TURBINE_MODEL_NAME
        };
        form.orderIndex = user.ORDER_INDEX;
        this.setState({
            editingConfig: user,
            isCreate: false,
            showModal: true,
            form: form
        });
    }
    closeModal() {
        this.setState({
            showModal: false,
            editingConfig: {},
            form: {
                err: '',
                tagName: '',
                tagNameCom: '',
                description: '',
                turbineModel: '',
                orderIndex: ''
            }
        });
    }
    createTurbineConfig() {
        let form = this.state.form;
        let canSubmit = this.canSubmit(form);
        if (!canSubmit) {
            return false;
        }

        let postData = {
            // 原始名称
            TAG_NAME: form.tagName,
            // 标准名称
            TAG_NAME_COM: form.tagNameCom,
            // 描述
            DESCRIPTION: form.description,
            // 机型
            TURBINE_MODEL: form.turbineModel.id,
            // 排序
            ORDER_INDEX: form.orderIndex
        };

        this.props.createTurbineConfig({
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
                this.getTurbineConfigListPage();
            }.bind(this),
            fail: function() {
                Utils.tooltip('添加失败');
            }.bind(this)
        });
    }
    modifyTurbineConfig() {
        let user = this.state.editingConfig;
        let form = this.state.form;
        let canSubmit = this.canSubmit(form);
        if (!canSubmit) {
            return false;
        }

        this.props.modifyTurbineConfig({
            data: {
                ID: user.ID,
                // 原始名称
                TAG_NAME: form.tagName,
                // 标准名称
                TAG_NAME_COM: form.tagNameCom,
                // 描述
                DESCRIPTION: form.description,
                // 机型
                TURBINE_MODEL: form.turbineModel.id,
                // 排序
                ORDER_INDEX: form.orderIndex
            },
            success: function() {
                Utils.tooltip('修改成功');
                this.closeModal();
                this.getTurbineConfigListPage();
            }.bind(this),
            fail: function() {
                Utils.tooltip('修改失败');
            }
        });
    }
    removeTurbineConfig(user) {
        let hasAuth = User.hasAuth('turbineConfig__delete');
        if (!hasAuth) {
            return false;
        }
        this.props.removeTurbineConfig({
            data: {
                ID: user.ID
            },
            success: function() {
                Utils.tooltip('删除成功');
                this.getTurbineConfigListPage();
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
        if (!form.tagName) {
            form.err = '请输入原始名称';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.turbineModel) {
            form.err = '请选择机型';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.tagNameCom) {
            form.err = '请输入标准名称';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.orderIndex) {
            form.err = '请输入排序';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.description) {
            form.err = '请输入描述';
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
    handleTagNameChange(event) {
        let form = this.state.form;
        form.tagName = event.target.value;
        this.setState({
            form: form
        });
    }
    handleTagNameComChange(event) {
        let form = this.state.form;
        form.tagNameCom = event.target.value;
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
    handleturbineModelChange(option) {
        let form = this.state.form;
        form.turbineModel = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    handleOrderIndexChange(event) {
        let form = this.state.form;
        form.orderIndex = event.target.value;
        this.setState({
            form: form
        });
    }
    render() {
        let userInfo = User.get();
        let turibineConfigListPageDate = this.props.turibineConfigListPageDate || [];
        let selectedUserTurbineModel = {};
        if (!!this.state.editingConfig && !this.state.isCreate) {
            let form = this.state.form;
            selectedUserTurbineModel = {
                key: form.turbineModel.id,
                value: form.turbineModel.name
            };
        }

        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                 <div className='boxInner'>
                     <div className='panel'>
                        <div className='panelHeader'>
                            <span className='panelTitle'>通用点表</span>
                            <form id='exportUniversalTable' action={Constant.API_ROOT + '/masterdata/turbineConfig/exportExcel'} method='POST' target='_blank'>
                                <input type='hidden' id='token' name='token' value={userInfo.token} />
                                <input type='hidden' id='KEYWORD' name='KEYWORD' value={this.state.searchValue} />
                                <span className='panelExport' onClick={this.exportSelect}></span>
                            </form>
                            <span className='panelAdd' onClick={this.showModal}></span>
                        </div>
                        <div className='panelBody'>
                            <Search
                                onSearch={this.search} />
                            <div className={style.tab}>
                                <TableOperation
                                    tableId='workbench'
                                    table={turibineConfigListPageDate}
                                    ths={['序号', '', '点位原始名称', '点位标准名称', '描述', '机型', '排序（文件中的位置）', '操作']}
                                    keys={['nobers', 'TAG_NAME', 'TAG_NAME_COM', 'DESCRIPTION', 'TURBINE_MODEL', 'ORDER_INDEX']}
                                    hasOrder={true}
                                    pageShow={true}
                                    totalRow={10}
                                    pager={this.state.pager}
                                    onPageChange={this.handlePageChange}
                                    onModify={this.showModifyModal}
                                    onDelete={this.removeTurbineConfig}
                                    trAspectRatio={0.0222} />
                            </div>
                        </div>
                        <Modal
                            isOpen={this.state.showModal}
                            onClose={this.closeModal}>
                            <div className='modalForm'>
                                <div className='panel'>
                                    <div className='panelHeader'>
                                        <div className='panelTitle'>
                                            {this.state.isCreate ? '添加点位' : '编辑点位'}
                                        </div>
                                    </div>
                                    <div className='modalFormErr'>{this.state.form.err}</div>
                                    <div className='modalFormPanel'>
                                        <div className='modalFormItem'>
                                            <label className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>原始名称：</span>
                                            </label>
                                            <input type='text' value={this.state.form.tagName} className='modalFormInput' onChange={this.handleTagNameChange} onFocus={this.cleanErr} />
                                        </div>
                                        <div className='modalFormItem'>
                                            <label className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>标准名称：</span>
                                            </label>
                                            <input type='text' value={this.state.form.tagNameCom} className='modalFormInput' onChange={this.handleTagNameComChange} onFocus={this.cleanErr} />
                                        </div>
                                        <div className='modalFormItem'>
                                            <label className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>描述：</span>
                                            </label>
                                            <input type='text' value={this.state.form.description} className='modalFormInput' onChange={this.handleDescriptionChange} onFocus={this.cleanErr} />
                                        </div>
                                    </div>
                                    <div className='modalFormPanel'>
                                        <div className='modalFormItem'>
                                            <label className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>机型：</span>
                                            </label>
                                            <div className={style.companySelect}>
                                                <Dropdown
                                                    overlayCls={style.overlayCls}
                                                    selectedItem={selectedUserTurbineModel}
                                                    options={this.state.turbineModelList}
                                                    onSelect={this.handleturbineModelChange}/>
                                            </div>
                                        </div>
                                        <div className='modalFormItem'>
                                            <label className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>排序：</span>
                                            </label>
                                            <input type='number' min='0' value={this.state.form.orderIndex} className='modalFormInput' onChange={this.handleOrderIndexChange} onFocus={this.cleanErr} />
                                        </div>
                                    </div>
                                    <div className='modalFormBtns'>
                                        <div className='modalFormConfirmBtn' onClick={this.state.isCreate ? this.createTurbineConfig : this.modifyTurbineConfig}>确认</div>
                                        <div className='modalFormCancelBtn' onClick={this.closeModal}>取消</div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        turibineConfigListPage: state.turibineconfig.turibineConfigListPage || [],
        turibineConfigListPageDate: state.turibineconfig.turibineConfigListPageDate || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        // 通用点表接口
        getTurbineConfigListPage: function({ data, before, after, success, fail }) {
            dispatch(actions.getTurbineConfigListPage({ data, before, after, success, fail }));
        },
        getParameterByTypeCode: function({ data, before, after, success, fail }) {
            dispatch(actions.getParameterByTypeCode({ data, before, after, success, fail }));
        },
        createTurbineConfig: function({ data, before, after, success, fail }) {
            dispatch(actions.createTurbineConfig({ data, before, after, success, fail }));
        },
        modifyTurbineConfig: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyTurbineConfig({ data, before, after, success, fail }));
        },
        removeTurbineConfig: function({ data, before, after, success, fail }) {
            dispatch(actions.removeTurbineConfig({ data, before, after, success, fail }));
        }
    }
};
module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(UniversalTable);
