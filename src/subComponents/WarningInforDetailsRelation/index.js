import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import Utils from 'utils/utils';
import Table from 'subComponents/Table';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class WarningInforDetailsRelation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 当前tab
            // 0: 全部预警
            // 1: 同风机预警
            // 2: 同模型预警
            currTab: 0,
            // 全部table数据
            pagerAllData: [],
            // 全部
            pagerAll: {
                total: 1,
                pageSize: 15,
                currPage: 1
            },
            // 同风机
            pagerFan: {
                total: 1,
                pageSize: 15,
                currPage: 1
            },
            // 同模型
            pagerModel: {
                total: 1,
                pageSize: 15,
                currPage: 1
            }
        };

        // 全部
        this.tableAll = this.tableAll.bind(this);
        // 同风机预警
        this.tableFan = this.tableFan.bind(this);
        // 通预警风机
        this.tableWan = this.tableWan.bind(this);

        // 全部
        this.getAssociatedPredictAll = this.getAssociatedPredictAll.bind(this);
        // 同风机
        this.getAssociatedPredictTurbine = this.getAssociatedPredictTurbine.bind(this);
        // 同模型
        this.getAssociatedPredictModel = this.getAssociatedPredictModel.bind(this);

        // 公共翻页事件
        this.handlePageChangeAll = this.handlePageChangeAll.bind(this);
        // 查看单条预警详情
        this.viewAlarmDetail = this.viewAlarmDetail.bind(this);
    }
    componentWillUpdate(nextProps) {
        if (this.props.project != nextProps.project) {
            this.getAssociatedPredictAll(1, nextProps.project);
        }
    }
    tableAll() {
        this.getAssociatedPredictAll(1, this.props.project);
        this.setState({
            currTab: 0
        });
    }
    tableFan() {
        this.getAssociatedPredictTurbine(1, this.props.turbine);
        this.setState({
            currTab: 1
        });
    }
    tableWan() {
        this.getAssociatedPredictModel(1, this.props.project, this.props.predictModel);
        this.setState({
            currTab: 2
        });
    }
    getAssociatedPredictAll(currPage, project) {
        this.props.getAssociatedPredictAll({
            data: {
                currentPage: currPage || this.state.pagerAll.currPage,
                showCount: this.state.pagerAll.pageSize,
                PROJECT: project
            },
            success: function(res) {
                let pager = this.state.pagerAll;
                pager.total = res.body.totalResult;
                pager.currPage = res.body.currentPage;
                this.setState({
                    pagerAll: pager,
                    pagerAllData: res.body.pageData
                });
            }.bind(this)
        });
    }
    getAssociatedPredictModel(currPage, project, predictModel) {
        this.props.getAssociatedPredictModel({
            data: {
                currentPage: currPage || this.state.pagerModel.currPage,
                showCount: this.state.pagerModel.pageSize,
                PROJECT: project,
                PREDICT_MODEL: predictModel
            },
            success: function(res) {
                let pager = this.state.pagerModel;
                pager.total = res.body.totalResult;
                pager.currPage = res.body.currentPage;
                this.setState({
                    pagerAll: pager,
                    pagerAllData: res.body.pageData
                });
            }.bind(this)
        })
    }
    getAssociatedPredictTurbine(currPage, turbine) {
        this.props.getAssociatedPredictTurbine({
            data: {
                currentPage: currPage || this.state.pagerFan.currPage,
                showCount: this.state.pagerFan.pageSize,
                TURBINE: turbine
            },
            success: function(res) {
                let pager = this.state.pagerFan;
                pager.total = res.body.totalResult;
                pager.currPage = res.body.currentPage;
                this.setState({
                    pagerAll: pager,
                    pagerAllData: res.body.pageData
                });
            }.bind(this)
        })
    }
    handlePageChangeAll(currPage) {
        let currTab = this.state.currTab;
        let pager = this.state.pagerAll;
        pager.currPage = currPage;
        if (currTab == 0) {
            this.getAssociatedPredictAll(currPage, this.props.project);
        } else if (currTab == 1) {
            this.getAssociatedPredictTurbine(currPage, this.props.turbine);
        } else if (currTab == 2) {
            this.getAssociatedPredictModel(currPage, this.props.project, this.props.predictModel);
        }
    }
    viewAlarmDetail(alarm) {
        !!this.props.onItemClick && this.props.onItemClick(alarm);
    }
    render() {
        return (
            <div className={style.box}>
                <p className={style.tabs}>
                    <span onClick={this.tableAll} className={this.state.currTab == 0 ? style.tabActive : ''}>全部</span>
                    <span onClick={this.tableFan} className={this.state.currTab == 1 ? style.tabActive : ''}>同风机预警</span>
                    <span onClick={this.tableWan} className={this.state.currTab == 2 ? style.tabActive : ''}>同模型预警</span>
                </p>
                <Table
                    tableId='associatedPredictTable'
                    table={this.state.pagerAllData}
                    ths={['预警ID', '区域', '风场', '风机', '模型名称', '预警时间', '预警信息', '类型', '等级', '关联部件', '状态']}
                    keys={['ID', 'AREA_NAME', 'PROJECT_NAME', 'LOCATION_CODE', 'PREDICT_MODEL_NAME', 'PREDICT_DATE', 'CONTENT', 'MODEL_TYPE', 'LEVEL_NAME', 'COMP_RELATED_NAME', 'STATUS_NAME']}
                    hasHeader={false}
                    hasOrder={false}
                    totalRow={15}
                    pager={this.state.pagerAll}
                    onPageChange={this.handlePageChangeAll}
                    onItemClick={this.viewAlarmDetail} />
            </div>
        );
    }
}

let mapStateToProps = function() {
    return {};
};

let mapDispatchToProps = function(dispatch) {
    return {
        // 全部
        getAssociatedPredictAll: function({ data, before, after, success, fail }) {
            dispatch(actions.getAssociatedPredictAll({ data, before, after, success, fail }));
        },
        // 同风机
        getAssociatedPredictTurbine: function({ data, before, after, success, fail }) {
            dispatch(actions.getAssociatedPredictTurbine({ data, before, after, success, fail }));
        },
        // 同模型
        getAssociatedPredictModel: function({ data, before, after, success, fail }) {
            dispatch(actions.getAssociatedPredictModel({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(WarningInforDetailsRelation);
