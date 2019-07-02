// 日志管理
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

import Constant from 'constant/index';
import Navbar from 'subComponents/Navbar';
import Search from 'subComponents/Search';
import TableOperation from 'subComponents/TableOperation';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class LogManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 日志列表
            logList: [],
            // 日志分页
            pager: {
                total: 1,
                pageSize: 10,
                currPage: 1
            },
            searchValue: ''
        };

        // 搜索日志列表
        this.searchLogList = this.searchLogList.bind(this);
        // 处理翻页
        this.handlePageChange = this.handlePageChange.bind(this);

        // 搜索
        this.search = this.search.bind(this);
        // 导出日志
        this.exportLog = this.exportLog.bind(this);
    }
    componentWillMount() {
        this.searchLogList();
    }
    searchLogList(currPage) {
        let hasAuth = User.hasAuth('log__query');
        if (!hasAuth) {
            return false;
        }
        this.props.searchLogListPage({
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
                    logList: res.body.pageData || []
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
            this.searchLogList(currPage);
        }.bind(this));
    }
    search(keyword) {
        this.setState({
            searchValue: keyword
        }, function() {
            this.searchLogList(1);
        }.bind(this));
    }
    exportLog() {
        let hasAuth = User.hasAuth('log__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportLog');
        form.submit();
    }
    render() {
        let userInfo = User.get();
        let logList = this.state.logList || [];
        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                 <div className='boxInner'>
                     <div className='panel'>
                        <div className='panelHeader'>
                            <span className='panelTitle'>日志管理</span>
                            <form id='exportLog' action={Constant.API_ROOT + '/system/log/log/exportExcel'} method='POST' target='_blank'>
                                <input type='hidden' id='token' name='token' value={userInfo.token} />
                                <input type='hidden' id='KEYWORD' name='KEYWORD' value={this.state.searchValue} />
                                <span className='panelExport' onClick={this.exportLog}></span>
                            </form>
                        </div>
                        <div className='panelBody'>
                            <Search
                                onSearch={this.search} />
                            <div className={style.tab}>
                                {logList.length > 0 ?
                                <TableOperation
                                    tableId='workbench'
                                    table={logList}
                                    ths={['模块名称', '操作名称', '事件类型', '用户名称', '请求地址', '日志']}
                                    keys={['USER_NAME', 'ACTION_TYPE_NAME', 'EVENT_TYPE', 'USER_NAME', 'REQUEST_IP', 'EVENT_LOG']}
                                    pageShow={true}
                                    hasOrder={false}
                                    pager={this.state.pager}
                                    totalRow={10}
                                    onPageChange={this.handlePageChange}
                                    trAspectRatio={0.0222} /> : null}
                            </div>
                        </div>
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
        searchLogListPage: function({ data, before, after, success, fail }) {
            dispatch(actions.searchLogListPage({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LogManagement);
