// 公司管理
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

class CompanyManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否展示弹框
            showModal: false,
            // 是否为创建公司
            isCreate: true,
            // 是否正在保存创建的公司
            saving: false,
            // 公司信息表单
            form: {
                // 表单错误
                err: '',
                // 公司ID
                id: '',
                // 公司名称
                name: '',
                // 公司编号
                code: '',
                // 公司描述
                description: ''
            },
            // 公司列表分页对象
            pager: {
                // 总数据条数
                total: 1,
                // 单页数据条数
                pageSize: 10,
                // 当前页
                currPage: 1
            },
            // 搜索值
            searchValue: '',
            // 搜索取得的公司列表
            searchedCompanyList: []
        };

        // 搜索
        this.search = this.search.bind(this);
        // 导出
        this.exportFile = this.exportFile.bind(this);

        // 公司列表
        this.searchCompanyListPage = this.searchCompanyListPage.bind(this);
        // 翻页
        this.handlePageChange = this.handlePageChange.bind(this);

        // 显示创建弹框
        this.showModal = this.showModal.bind(this);
        // 显示修改弹框
        this.showModifyModal = this.showModifyModal.bind(this);
        // 关闭弹框
        this.closeModal = this.closeModal.bind(this);

        // 创建
        this.createCompany = this.createCompany.bind(this);
        // 修改
        this.modifyCompany = this.modifyCompany.bind(this);
        // 删除
        this.removeCompany = this.removeCompany.bind(this);

        // 表单有错误
        this.hasErr = this.hasErr.bind(this);
        // 清除错误
        this.cleanErr = this.cleanErr.bind(this);
        // 编号
        this.handleCodeChange = this.handleCodeChange.bind(this);
        // 公司名称
        this.handleCompanyChange = this.handleCompanyChange.bind(this);
        // 描述
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    }
    componentWillMount() {
        this.searchCompanyListPage(1);
    }
    search(keyword) {
        this.setState({
            searchValue: keyword
        }, function() {
            this.searchCompanyListPage(1, keyword);
        }.bind(this));
    }
    exportFile() {
        let hasAuth = User.hasAuth('company__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportCompanies');
        form.submit();
    }
    searchCompanyListPage(currPage, keyword) {
        let hasAuth = User.hasAuth('company__query');
        if (!hasAuth) {
            return false;
        }
        this.props.searchCompanyListPage({
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
                    searchedCompanyList: res.body.pageData || []
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
        this.searchCompanyListPage(currPage);
    }
    showModal() {
        let hasAuth = User.hasAuth('company__add');
        if (!hasAuth) {
            return false;
        }
        this.setState({
            showModal: true,
            isCreate: true
        });
    }
    showModifyModal(company) {
        let hasAuth = User.hasAuth('company__edit');
        if (!hasAuth) {
            return false;
        }
        let form = this.state.form;
        form.id = company.ID;
        form.name = company.NAME;
        form.description = company.DESCRIPTION;
        form.code = company.CODE;
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
                name: '',
                code: '',
                description: ''
            }
        });
    }
    createCompany() {
        if (this.state.saving) {
            return false;
        }

        let form = this.state.form;
        let hasErr = this.hasErr(form);
        if (hasErr) {
            return false;
        }

        let postData = {
            NAME: form.name,
            CODE: form.code,
            DESCRIPTION: form.description
        };
        this.props.createCompany({
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
                this.searchCompanyListPage(1);
            }.bind(this),
            fail: function() {
                Utils.tooltip('添加失败');
            }
        });
    }
    modifyCompany() {
        let form = this.state.form;
        let hasErr = this.hasErr(form);
        if (hasErr) {
            return false;
        }

        this.props.modifyCompany({
            data: {
                ID: form.id,
                CODE: form.code,
                NAME: form.name,
                DESCRIPTION: form.description
            },
            success: function() {
                Utils.tooltip('修改成功');
                this.closeModal();
                this.searchCompanyListPage(1);
            }.bind(this),
            fail: function() {
                Utils.tooltip('修改失败');
            }
        });
    }
    removeCompany(company) {
        let hasAuth = User.hasAuth('company__delete');
        if (!hasAuth) {
            return false;
        }
        this.props.removeCompany({
            data: {
                ID: company.ID
            },
            success: function() {
                Utils.tooltip('删除成功');
                this.searchCompanyListPage(1);
            }.bind(this),
            fail: function() {
                Utils.tooltip('删除失败');
            }
        });
    }
    hasErr(form) {
        if (!form.description) {
            form.err = '请输入公司描述';
        }
        if (!form.code) {
            form.err = '请输入公司编号';
        }
        if (!form.name) {
            form.err = '请输入公司名称';
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
    handleCodeChange(event) {
        let form = this.state.form;
        form.code = event.target.value;
        this.setState({
            form: form
        });
    }
    handleCompanyChange(event) {
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
        let pageCompanyList = this.state.searchedCompanyList || [];
        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                 <div className='boxInner'>
                     <div className='panel'>
                        <div className='panelHeader'>
                            <span className='panelTitle'>公司管理</span>
                            <div className={style.boxInnerRight}>
                                <form id='exportCompanies' action={Constant.API_ROOT + '/user/company/exportExcel'} method='POST' target='_blank'>
                                    <input type='hidden' id='token' name='token' value={userInfo.token} />
                                    <input type='hidden' id='KEYWORD' name='KEYWORD' value={this.state.searchValue} />
                                    <span title='全部导出' className='panelExport' onClick={this.exportFile}></span>
                                </form>
                                <span title='添加' className='panelAdd' onClick={this.showModal}></span>
                            </div>
                        </div>
                        <div className='panelBody'>
                            <Search
                                onSearch={this.search} />
                            <div className={style.tab}>
                                {pageCompanyList.length > 0 ?
                                <TableOperation
                                    tableId='workbench'
                                    table={pageCompanyList}
                                    ths={['序号', '', '公司', '编号', '描述', '创建人', '操作']}
                                    keys={['nobers', 'NAME', 'CODE', 'DESCRIPTION', 'CREATE_USER_NAME']}
                                    hasHeader={false}
                                    hasOrder={true}
                                    hasCheckbox={false}
                                    pageShow={true}
                                    pager={this.state.pager}
                                    totalRow={10}
                                    onPageChange={this.handlePageChange}
                                    onModify={this.showModifyModal}
                                    onDelete={this.removeCompany}
                                    trAspectRatio={0.0222} /> : null}
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
                                        <label className='modalFormLabel'>公司名称：</label>
                                        <input type='text' value={this.state.form.name} className='modalFormInput' onChange={this.handleCompanyChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>公司编号：</label>
                                        <input type='text' value={this.state.form.code} className='modalFormInput' onChange={this.handleCodeChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormItem'>
                                        <label className='modalFormLabel'>公司描述：</label>
                                        <input type='text' value={this.state.form.description} className='modalFormInput' onChange={this.handleDescriptionChange} onFocus={this.cleanErr} />
                                    </div>
                                    <div className='modalFormBtns'>
                                        <div className='modalFormConfirmBtn' onClick={this.state.isCreate ? this.createCompany : this.modifyCompany}>提交</div>
                                        <div className='modalFormCancelBtn' onClick={this.closeModal}>关闭</div>
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

let mapStateToProps = function() {
    return {};
};

let mapDispatchToProps = function(dispatch) {
    return {
        searchCompanyListPage: function({ data, before, after, success, fail }) {
            dispatch(actions.searchCompanyListPage({ data, before, after, success, fail }));
        },
        createCompany: function({ data, before, after, success, fail }) {
            dispatch(actions.createCompany({ data, before, after, success, fail }));
        },
        modifyCompany: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyCompany({ data, before, after, success, fail }));
        },
        removeCompany: function({ data, before, after, success, fail }) {
            dispatch(actions.removeCompany({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CompanyManagement);
