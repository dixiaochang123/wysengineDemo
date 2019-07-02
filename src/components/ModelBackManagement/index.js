// 模型后台管理
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

class ModelBackManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 展示创建、编辑弹窗
            showModal: false,
            // 是否正在保存
            saving: false,
            // 是否是创建模型
            isCreate: true,
            // 编辑中的模型
            editingModel: {},
            form: {
                // 错误提示
                err: '',
                // 模型代码
                modelCode: '',
                // 模型名称
                modelName: '',
                // 模型类型
                modelType: {},
                // 模型等级
                modelLevel: {},
                // 预警信息
                contentInfo: '',
                // 预警类型
                predictType: {},
                // 关联部件
                compRelated: {},
                // 是否激活
                active: '',
                // 描述
                description: ''
            },
            // 搜索值
            searchValue: '',
            // 分页
            pager: {
                total: 1,
                pageSize: 10,
                currPage: 1
            },
            // 模型类型列表
            modelTypeList: [],
            // 模型等级列表
            modelLevelList: [],
            // 预警类型列表
            predictTypeList: [],
            // 关联部件列表
            compRelatedList: []
        };

        // 模型后台管理接口
        this.getModelListPage = this.getModelListPage.bind(this);
        // 分页
        this.handlePageChange = this.handlePageChange.bind(this);

        // 搜索
        this.search = this.search.bind(this);
        // 导出后台模型
        this.exportModelBack = this.exportModelBack.bind(this);

        // 展示创建弹窗
        this.showModal = this.showModal.bind(this);
        // 展示编辑弹窗
        this.showModifyModal = this.showModifyModal.bind(this);
        // 关闭弹窗
        this.closeModal = this.closeModal.bind(this);

        // 创建模型
        this.createModel = this.createModel.bind(this);
        // 修改模型
        this.modifyModel = this.modifyModel.bind(this);
        // 删除弹窗
        this.removeModel = this.removeModel.bind(this);
        // 表单验证
        this.canSubmit = this.canSubmit.bind(this);

        // 清除表单错误
        this.cleanErr = this.cleanErr.bind(this);
        // 模型代码
        this.handleCodeChange = this.handleCodeChange.bind(this);
        // 模型名称
        this.handleNameChange = this.handleNameChange.bind(this);
        // 描述
        this.handleDesChange = this.handleDesChange.bind(this);
        // 是否激活
        this.handleActiveChange = this.handleActiveChange.bind(this);
        // 预警信息
        this.handleInfoChange = this.handleInfoChange.bind(this);
        // 预警类型
        this.handlePredictTypeChange = this.handlePredictTypeChange.bind(this);
        // 关联部件
        this.handleCompRelatedChange = this.handleCompRelatedChange.bind(this);
        // 模型类型
        this.handleTypeChange = this.handleTypeChange.bind(this);
        // 模型等级
        this.handleLevelChange = this.handleLevelChange.bind(this);
    }
    componentWillMount() {
        this.getModelListPage();
        // 模型类型
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'modelType'
            },
            success: function(res) {
                this.setState({
                    modelTypeList: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
        // 模型等级
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'predictLevel'
            },
            success: function(res) {
                this.setState({
                    modelLevelList: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
        // 预警类型
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'modelType2'
            },
            success: function(res) {
                this.setState({
                    predictTypeList: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
        // 关联部件
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'turbineComp'
            },
            success: function(res) {
                this.setState({
                    compRelatedList: res.body.map((item) => {
                        return {
                            key: item.ID,
                            value: item.NAME
                        };
                    }) || []
                });
            }.bind(this)
        });
    }
    getModelListPage(currPage) {
        let hasAuth = User.hasAuth('modelBackground__query');
        if (!hasAuth) {
            return false;
        }
        let searchValue = this.state.searchValue;
        this.props.getModelListPage({
            data: {
                currentPage: currPage || this.state.pager.currPage || 1,
                showCount: this.state.pager.pageSize,
                CODE: searchValue
            },
            success: function() {
                $(document.body).removeClass('btnLoading');
                let pager = this.state.pager;
                pager.total = this.props.modelListPage.totalResult;
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
        }, function() {
            this.getModelListPage(currPage);
        }.bind(this));
    }
    search(keyword) {
        this.setState({
            searchValue: keyword
        }, function() {
            this.getModelListPage(1);
        }.bind(this));
    }
    exportModelBack() {
        let hasAuth = User.hasAuth('modelBackground__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportModelBack');
        form.submit();
    }
    showModal() {
        let hasAuth = User.hasAuth('modelBackground__add');
        if (!hasAuth) {
            return false;
        }
        this.setState({
            showModal: true,
            isCreate: true
        });
    }
    showModifyModal(model) {
        let hasAuth = User.hasAuth('modelBackground__edit');
        if (!hasAuth) {
            return false;
        }
        let form = this.state.form;
        // 模型代码
        form.modelCode = model.CODE;
        // 模型名称
        form.modelName = model.NAME;
        // 模型类型
        form.modelType = {
            id: model.TYPE,
            name: model.TYPE_NAME
        };
        // 等级
        form.modelLevel = {
            id: model.LEVEL,
            name: model.LEVEL_NAME
        };
        // 预警信息
        form.contentInfo = model.MESSAGE;
        // 预警类型
        form.predictType = {
            id: model.MODEL_TYPE,
            name: model.MODEL_TYPE_NAME
        };
        // 关联部件
        form.compRelated = {
            id: model.COMP_RELATED,
            name: model.COMP_RELATED_NAME
        };
        // 描述
        form.description = model.DESCRIPTION;
        // 激活
        form.active = model.ACTIVE;
        this.setState({
            editingModel: Object.assign({}, model),
            isCreate: false,
            showModal: true,
            form: form
        });
    }
    closeModal() {
        this.setState({
            showModal: false,
            editingModel: {},
            form: {
                err: '',
                modelCode: '',
                modelName: '',
                modelType: {},
                modelLevel: {},
                contentInfo: '',
                predictType: {},
                compRelated: {},
                active: '',
                description: ''
            }
        });
    }
    createModel() {
        let form = this.state.form;
        let canSubmit = this.canSubmit(form);
        if (!canSubmit) {
            return false;
        }
        let postData = {
            CODE: form.modelCode,
            NAME: form.modelName,
            TYPE: form.modelType.id,
            LEVEL: form.modelLevel.id,
            // ACCURACY: form.modelLevel,
            MESSAGE: form.contentInfo,
            MODEL_TYPE: form.predictType.id,
            COMP_RELATED: form.compRelated.id,
            ACTIVE: form.active,
            DESCRIPTION: form.description
        };
        this.props.createModel({
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
                this.getModelListPage();
            }.bind(this),
            fail: function() {
                Utils.tooltip('添加失败');
            }.bind(this)
        });
    }
    modifyModel() {
        let model = this.state.editingModel;
        let form = this.state.form;
        let canSubmit = this.canSubmit(form);
        if (!canSubmit) {
            return false;
        }
        this.props.modifyModel({
            data: {
                ID: model.ID,
                CODE: form.modelCode,
                NAME: form.modelName,
                TYPE: form.modelType.id,
                LEVEL: form.modelLevel.id,
                // ACCURACY: form.modelLevel',
                MESSAGE: form.contentInfo,
                MODEL_TYPE: form.predictType.id,
                COMP_RELATED: form.compRelated.id,
                ACTIVE: form.active,
                DESCRIPTION: form.description
            },
            success: function() {
                Utils.tooltip('修改成功');
                this.closeModal();
                this.getModelListPage(1);
            }.bind(this),
            fail: function() {
                Utils.tooltip('修改失败');
            }
        });
    }
    removeModel(user) {
        let hasAuth = User.hasAuth('modelBackground__delete');
        if (!hasAuth) {
            return false;
        }
        this.props.removeModel({
            data: {
                ID: user.ID
            },
            success: function() {
                Utils.tooltip('删除成功');
                this.getModelListPage();
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
        if (!form.modelCode) {
            form.err = '请输入模型代码';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.modelName) {
            form.err = '请输入模型名称';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.modelType.id) {
            form.err = '请选择模型类型';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.modelLevel.id) {
            form.err = '请选择模型等级';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.contentInfo) {
            form.err = '请输入预警信息';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.predictType.id) {
            form.err = '请选择预警类型';
            this.setState({
                form: form
            });
            return false;
        }
        if (!form.compRelated.id) {
            form.err = '请选择关联部件';
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
        if (!form.active) {
            form.active = 1;
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
        form.modelCode = event.target.value;
        this.setState({
            form: form
        });
    }
    handleNameChange(event) {
        let form = this.state.form;
        form.modelName = event.target.value;
        this.setState({
            form: form
        });
    }
    handleInfoChange(event) {
        let form = this.state.form;
        form.contentInfo = event.target.value;
        this.setState({
            form: form
        });
    }
    handleDesChange(event) {
        let form = this.state.form;
        form.description = event.target.value;
        this.setState({
            form: form
        });
    }
    handleTypeChange(option) {
        let form = this.state.form;
        form.modelType = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    handleLevelChange(option) {
        let form = this.state.form;
        form.modelLevel = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    handlePredictTypeChange(option) {
        let form = this.state.form;
        form.predictType = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    handleCompRelatedChange(option) {
        let form = this.state.form;
        form.compRelated = {
            id: option.key,
            name: option.value
        };
        this.setState({
            form: form
        });
    }
    handleActiveChange(event) {
        let form = this.state.form;
        form.active = event.target.value;
        this.setState({
            form: form
        });
    }
    render() {
        let userInfo = User.get();
        let modelListPageData = this.props.modelListPageData || [];
        let selectedLevel = {};
        let selectedType = {};
        let selectedPredictType = {};
        let selectedCompRelated = {};
        let form = this.state.form;
        if (!!this.state.editingModel && !this.state.isCreate) {
            selectedLevel = {
                key: form.modelLevel.id,
                value: form.modelLevel.name
            };
            selectedType = {
                key: form.modelType.id,
                value: form.modelType.name
            };
            selectedPredictType = {
                key: form.predictType.id,
                value: form.predictType.name
            };
            selectedCompRelated = {
                key: form.compRelated.id,
                value: form.compRelated.name
            };
        }
        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                 <div className='boxInner'>
                     <div className='panel'>
                        <div className='panelHeader'>
                            <span className='panelTitle'>模型后台管理</span>
                            <form id='exportModelBack' action={Constant.API_ROOT + '/predict/model/exportExcel'} method='POST' target='_blank'>
                                <input type='hidden' id='token' name='token' value={userInfo.token} />
                                <input type='hidden' id='KEYWORD' name='KEYWORD' value={this.state.searchValue} />
                                <span className='panelExport' onClick={this.exportModelBack}></span>
                            </form>
                            <span className='panelAdd' onClick={this.showModal}></span>
                        </div>
                        <div className='panelBody'>
                            <Search
                                onSearch={this.search} />
                            <div className={style.tab}>
                                {modelListPageData.length > 0 ?
                                <TableOperation
                                    tableId='TableModelBack'
                                    table={modelListPageData}
                                    ths={['序号', '', '模型代码', '模型名称', '模型类型', '模型等级', '预警信息', '关联部件', '是否激活', '描述', '操作']}
                                    keys={['nobers', 'CODE', 'NAME', 'TYPE_NAME', 'LEVEL_NAME', 'MESSAGE', 'COMP_RELATED_NAME', 'ACTIVE', 'DESCRIPTION']}
                                    hasOrder={true}
                                    pageShow={true}
                                    pager={this.state.pager}
                                    onPageChange={this.handlePageChange}
                                    onModify={this.showModifyModal}
                                    onDelete={this.removeModel}
                                    trAspectRatio={0.0222} /> : null}
                            </div>
                        </div>
                        <Modal
                            isOpen={this.state.showModal}
                            onClose={this.closeModal}>
                            <div className='modalForm'>
                                <div className='panel'>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>{this.state.isCreate ? '添加模型' : '编辑模型'}</span>
                                    </div>
                                    <div className='modalFormErr'>{this.state.form.err}</div>
                                    <div className='modalFormPanel'>
                                        <div className='modalFormItem'>
                                            <label className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>模型代码：</span>
                                            </label>
                                            <input
                                                type='text'
                                                value={this.state.form.modelCode}
                                                className='modalFormInput'
                                                onChange={this.handleCodeChange}
                                                onFocus={this.cleanErr} />
                                        </div>
                                        <div className='modalFormItem'>
                                            <label className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>模型名称：</span>
                                            </label>
                                            <input
                                                type='text'
                                                value={this.state.form.modelName}
                                                className='modalFormInput'
                                                onChange={this.handleNameChange}
                                                onFocus={this.cleanErr} />
                                        </div>
                                        <div className='modalFormItem'>
                                            <label className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>模型类型：</span>
                                            </label>
                                            <div className={style.companySelect}>
                                                <Dropdown
                                                    overlayCls={style.overlayCls}
                                                    selectedItem={selectedType}
                                                    options={this.state.modelTypeList}
                                                    onSelect={this.handleTypeChange} />
                                            </div>
                                        </div>
                                        <div className='modalFormItem'>
                                            <label className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>模型等级：</span>
                                            </label>
                                            <div className={style.companySelect}>
                                                <Dropdown
                                                    overlayCls={style.overlayCls}
                                                    selectedItem={selectedLevel}
                                                    options={this.state.modelLevelList}
                                                    onSelect={this.handleLevelChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='modalFormPanel'>
                                        <div className='modalFormItem'>
                                            <label className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>预警信息：</span>
                                            </label>
                                            <input
                                                type='text'
                                                value={this.state.form.contentInfo}
                                                className='modalFormInput'
                                                onChange={this.handleInfoChange}
                                                onFocus={this.cleanErr} />
                                        </div>
                                        <div className='modalFormItem'>
                                            <label className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>预警类型：</span>
                                            </label>
                                            <div className={style.companySelect}>
                                                <Dropdown
                                                    overlayCls={style.overlayCls}
                                                    selectedItem={selectedPredictType}
                                                    options={this.state.predictTypeList}
                                                    onSelect={this.handlePredictTypeChange} />
                                            </div>
                                        </div>
                                        <div className='modalFormItem'>
                                            <label className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>关联部件：</span>
                                            </label>
                                            <div className={style.companySelect}>
                                                <Dropdown
                                                    overlayCls={style.overlayCls}
                                                    selectedItem={selectedCompRelated}
                                                    options={this.state.compRelatedList}
                                                    onSelect={this.handleCompRelatedChange} />
                                            </div>
                                        </div>
                                        <div className={style.modal1 +' modalFormItem'}>
                                            <label className='modalFormLabel'>
                                                <span className='modalFormStar'></span>
                                                <span>是否激活：</span>
                                            </label>
                                            <input
                                                type='radio'
                                                name='yesAndNo'
                                                value='1'
                                                checked={form.active == 1}
                                                onChange={function() {}}
                                                onClick={this.handleActiveChange}
                                                onFocus={this.cleanErr} />
                                            <span>激活</span>
                                            <input
                                                type='radio'
                                                name='yesAndNo'
                                                value='0'
                                                checked={form.active == 0}
                                                onChange={function() {}}
                                                onClick={this.handleActiveChange}
                                                onFocus={this.cleanErr} />
                                            <span>不激活</span>
                                        </div>
                                    </div>
                                    <div className={style.modalFormBtns1 + ' modalFormBtns'}>
                                        <label className='modalFormLabel'>
                                            <span className='modalFormStar'></span>
                                            <span style={{textIndent: '2em', display: 'inline-block'}}>描述：</span>
                                        </label>
                                        <textarea
                                            cols='67.5'
                                            rows='2'
                                            style={{resize: 'none', borderColor: '#7fbae0'}}
                                            value={this.state.form.description}
                                            onChange={this.handleDesChange}
                                            onFocus={this.cleanErr}></textarea>
                                    </div>
                                    <div className='modalFormBtns'>
                                        <div className='modalFormConfirmBtn' onClick={this.state.isCreate ? this.createModel : this.modifyModel}>确认</div>
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
        // 模型后台管理接口数据
        modelListPage: state.models.modelListPage || {},
        // 模型后台管理接口表格数据
        modelListPageData: state.models.modelListPageData || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        createModel: function({ data, before, after, success, fail }) {
            dispatch(actions.createModel({ data, before, after, success, fail }));
        },
        removeModel: function({ data, before, after, success, fail }) {
            dispatch(actions.removeModel({ data, before, after, success, fail }));
        },
        modifyModel: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyModel({ data, before, after, success, fail }));
        },
        // 模型后台管理接口
        getModelListPage: function({ data, before, after, success, fail }) {
            dispatch(actions.getModelListPage({ data, before, after, success, fail }));
        },
        // 模型后台管理接口
        getParameterByTypeCode: function({ data, before, after, success, fail }) {
            dispatch(actions.getParameterByTypeCode({ data, before, after, success, fail }));
        }
    }
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ModelBackManagement);
