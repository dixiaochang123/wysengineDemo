// 模型明细
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

import Constant from 'constant/index';
import Table from 'subComponents/Table';
import Navbar from 'subComponents/Navbar';
import Filter from 'subComponents/Filter';
import ChartModelPrecisionSimple from 'subComponents/ChartModelPrecisionSimple';
import ChartAlarmDistributionModel from 'subComponents/ChartAlarmDistributionModel';
import ChartStateDistributionModel from 'subComponents/ChartStateDistributionModel';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

import IconExport from 'images/models/icon_export.png';
import IconExportDark from 'images/models/icon_export_dark.png';

class ModelDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否展示筛选弹框
            showFilter: false,
            // 筛选弹框尺寸
            filterSize: [902, 290],
            // 筛选条件
            filter: {},
            // 模型列表
            models: [],
            // 表格中模型列表
            tableModels: [],
            // 模型准确率
            modelAccuracy: 0,
            // 表格模型列表分页
            pager: {
                total: 1,
                currPage: 1,
                pageSize: 18
            },
            // 模型类型
            modelTypes: [],
            // 风机部件
            turbineComs: []
        };

        // 通过区域、风场获取数据
        this.initDataByAreaOrWindsite = this.initDataByAreaOrWindsite.bind(this);
        // 导出
        this.exportFile = this.exportFile.bind(this);

        // 获取模型预警列表
        this.getModelAlarms = this.getModelAlarms.bind(this);
        // 按筛选条件搜索预警
        this.searchAlarmsByFilter = this.searchAlarmsByFilter.bind(this);
        // table中翻页事件
        this.handlePageChange = this.handlePageChange.bind(this);

        // 查看预警详情
        this.viewAlarmDetail = this.viewAlarmDetail.bind(this);

        // 设置筛选条件弹框尺寸
        this.setFilterSize = this.setFilterSize.bind(this);
        // 显示、隐藏筛选条件弹框
        this.toggleFilter = this.toggleFilter.bind(this);
    }
    componentWillMount() {
        this.initDataByAreaOrWindsite();

        // 获取模型类型
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'modelType'
            },
            success: function(res) {
                this.setState({
                    modelTypes: !!res.body ? res.body : []
                });
            }.bind(this)
        });

        // 获取风机部件
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'turbineComp'
            },
            success: function(res) {
                this.setState({
                    turbineComs: !!res.body ? res.body : []
                });
            }.bind(this)
        });

        let modelId = this.props.location.state.modelId;
        this.props.getModelById({
            data: {
                ID: modelId
            },
            success: function(res) {
                this.setState({
                    modelAccuracy: !!res.body ? res.body.ACCURACY : 0
                });
            }.bind(this)
        });

        this.props.getModelDetail({
            data: {
                PREDICT_MODEL: modelId
            }
        });
    }
    componentDidMount() {
        this.setFilterSize();
        Utils.handleBigScreenDomHeight();
        Utils.handleScreenZoom(function() {
            Utils.handleBigScreenDomHeight();
        });
    }
    initDataByAreaOrWindsite() {
        this.getModelAlarms(1);
    }
    getModelAlarms(currPage, filter) {
        let hasAuth = User.hasAuth('model__query');
        if (!hasAuth) {
            return false;
        }
        let pager = this.state.pager;
        let currentArea = User.get('currentArea') || '';
        let currentWindsite = User.get('currentWindsite') || '';
        filter = !!filter ? Object.assign({}, filter, this.state.filter) : Object.assign({}, this.state.filter);
        let postData = {
            AREA: !!filter && !!filter.area ? filter.area.CODE : (!!currentArea ? currentArea.CODE : ''),
            PROJECT: !!filter && !!filter.windsite ? filter.windsite.CODE_ : (!!currentWindsite ? currentWindsite.CODE_ : ''),
            currentPage: currPage || pager.currPage,
            showCount: pager.pageSize,
            PREDICT_MODEL: this.props.location.state.modelId
        };
        if (!!filter && !!filter.number) {
            postData['ID'] = filter.number;
        }

        this.props.getModelDetailSearch({
            data: Object.assign({}, {
                TIME: !!filter && !!filter.time ? filter.time : 'year',
                START: !!filter && !!filter.startDate ? filter.startDate : '',
                END: !!filter && !!filter.endDate ? filter.endDate : '',
                STATUS: !!filter && !!filter.status ? filter.status.ID : '',
                LEVEL: !!filter && !!filter.level ? filter.level.ID : '',
                COMP_RELATED: !!filter && !!filter.unit ? filter.unit.ID : '',
                TURBINE_MODEL: !!filter && !!filter.machineType ? filter.machineType.ID : ''
            }, postData),
            success: function(res) {
                $(document.body).removeClass('btnLoading');
                pager.total = res.body.totalResult;
                this.setState({
                    pager: pager,
                    tableModels: res.body.pageData || []
                });
            }.bind(this)
        });
    }
    exportFile() {
        let hasAuth = User.hasAuth('model__export');
        if (!hasAuth) {
            return false;
        }
        let form = $('#exportModelDetail');
        form.submit();
    }
    searchAlarmsByFilter(filter) {
        let pager = this.state.pager;
        pager.currPage = 1;
        this.setState({
            pager: pager,
            filter: filter,
            showFilter: false
        }, function() {
            this.getModelAlarms(1, filter);
        }.bind(this));
    }
    handlePageChange(currPage) {
        let pager = this.state.pager;
        pager.currPage = currPage;
        this.setState({
            pager: pager
        });
        this.getModelAlarms(currPage);
    }
    viewAlarmDetail(alarm) {
        this.props.router.push({
            pathname: '/warninginfordetails',
            state: {
                alarmId: alarm.ID
            }
        });
    }
    setFilterSize() {
        let fontSize = parseInt(getComputedStyle(window.document.documentElement)['font-size']);
        let tableWidth = $('.' + style.table).css('width').slice(0, -2);
        let tableHeight = $('.' + style.table).css('height').slice(0, -2) - fontSize * 3.5;
        this.setState({
            filterSize: [tableWidth, tableHeight]
        });
    }
    toggleFilter() {
        let showFilter = this.state.showFilter;
        this.setFilterSize();
        this.setState({
            showFilter: !showFilter
        });
    }
    render() {
        let userInfo = User.get();
        let filter = this.state.filter;
        let currentArea = !!filter && !!filter.area ? filter.area : (User.get('currentArea') || '');
        let currentWindsite = !!filter && !!filter.windsite ? filter.windsite : (User.get('currentWindsite') || '');

        let modelDetail = this.props.modelDetail || {};
        let statusCountList = !!modelDetail ? modelDetail.statusCount : [];
        let modelDetailSearch = this.props.modelDetailSearch || {};
        let tableModels = !!modelDetailSearch ? (modelDetailSearch.pageData || []) : [];
        let modelAccuracy = this.state.modelAccuracy;

        let modelType;
        let turbineCom;
        if (!!modelDetail && !!modelDetail.model) {
            modelType = this.state.modelTypes.find((item) => item.CODE == modelDetail.model.TYPE_CODE);
            turbineCom = this.state.turbineComs.find((item) => item.ID == modelDetail.model.COMP_RELATED);
        }

        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                <div className='boxInner'>
                    <div className={style.boxInner + ' pure-g full'}>
                        <div className='pure-u-1-3'>
                            <div className={style.charts + ' full'}>
                                <div className={style.chartOne} data-aspect-ratio={0.34}>
                                    <div className='panel'>
                                        <div className='panelHeader'>
                                            <div className='panelTitle'>准确率</div>
                                        </div>
                                        <div className='panelBody'>
                                            <ChartModelPrecisionSimple
                                                accuracy={modelAccuracy} />
                                            <div className={style.chartOneInfo}>
                                                <div className={style.chartOneText}>
                                                    <span className={style.chartOneLabel}>模型类型：</span>
                                                    <span>{!!modelDetail && !!modelDetail.model && !!modelType ? modelType.DESCRIPTION : ''}</span>
                                                </div>
                                                <div className={style.chartOneText}>
                                                    <span className={style.chartOneLabel}>模型类别：</span>
                                                    <span>{!!modelDetail && modelDetail.model ? (!!modelDetail.model.FARM_PREDICT ? '风场预警' : '风机预警') : ''}</span>
                                                </div>
                                                <div className={style.chartOneText}>
                                                    <span className={style.chartOneLabel}>模型名称：</span>
                                                    <span>{!!modelDetail && modelDetail.model ? modelDetail.model.NAME : ''}</span>
                                                </div>
                                                <div className={style.chartOneText}>
                                                    <span className={style.chartOneLabel}>模型等级：</span>
                                                    <span>{!!modelDetail && modelDetail.model ? modelDetail.model.levelNAME : ''}</span>
                                                </div>
                                                <div className={style.chartOneText}>
                                                    <span className={style.chartOneLabel}>关联部件：</span>
                                                    <span>{!!modelDetail && modelDetail.model && !!turbineCom ? turbineCom.DESCRIPTION : ''}</span>
                                                </div>
                                                <div className={style.chartOneText}>
                                                    <span className={style.chartOneLabel}>查看全场：</span>
                                                    <span>{!!modelDetail && modelDetail.model ? (modelDetail.model.VIEW_ALL == 0 ? '否' : '是') : ''}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.chartRow} data-aspect-ratio={0.34}>
                                    <div className='panel'>
                                        <div className='panelHeader'>
                                            <div className='panelTitle'>预警总数及分布</div>
                                        </div>
                                        <div className='panelBody pure-g'>
                                            <div className={'pure-u-6-24 ' + style.chartRowPanel}>
                                                <div>{!!modelDetail && !!modelDetail.predictCount ? modelDetail.predictCount + '个' : '0个'}</div>
                                                <div className={style.chartRowLabel}>预警总数</div>
                                            </div>
                                            <div className='pure-u-18-24'>
                                                <div className={style.chartRowScale}>
                                                    {!Utils.isEmpty(modelDetail) ?
                                                    <ChartAlarmDistributionModel data={modelDetail} /> : <div className='dataEmpty'></div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.chartRow} data-aspect-ratio={0.34}>
                                    <div className='panel'>
                                        <div className='panelHeader'>
                                            <div className='panelTitle'>预警完成率及状态分布</div>
                                        </div>
                                        <div className='panelBody pure-g'>
                                            <div className={'pure-u-6-24 ' + style.chartRowPanel}>
                                                <div>{!!modelDetail ? (modelDetail.completeRate || '0%') : '0%'}</div>
                                                <div className={style.chartRowLabel}>预警完成率</div>
                                            </div>
                                            <div className='pure-u-18-24'>
                                                {!Utils.isEmpty(statusCountList) ?
                                                <ChartStateDistributionModel
                                                    data={statusCountList}
                                                    center={['35%', '50%']}
                                                    legendRight={'15%'} /> : <div className='dataEmpty'></div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='pure-u-2-3 gapLeft'>
                            <div className={style.table}>
                                <div className='panel'>
                                    <div className='panelHeader'>
                                        <div className='panelTitle'>预警列表</div>
                                        <div className={'arrowDown ' + style.tableArrow} onClick={this.toggleFilter}></div>
                                    </div>
                                    <div className={'panelBody ' + style.panelBody}>
                                        <form id='exportModelDetail' action={Constant.API_ROOT + '/predict/getWorkbenchExport'} method='POST' target='_blank'>
                                            <input type='hidden' id='token' name='token' value={userInfo.token} />
                                            <input type='hidden' id='AREA' name='AREA' value={!!currentArea ? currentArea.CODE : ''} />
                                            <input type='hidden' id='PROJECT' name='PROJECT' value={!!currentWindsite ? currentWindsite.CODE_ : ''} />
                                            <input type='hidden' id='PREDICT_MODEL' name='PREDICT_MODEL' value={this.props.location.state.modelId} />
                                            <input type='hidden' id='TIME' name='TIME' value={!!filter && !!filter.time ? filter.time : ''} />
                                            <input type='hidden' id='START' name='START' value={!!filter && !!filter.startDate ? filter.startDate : ''} />
                                            <input type='hidden' id='END' name='END' value={!!filter && !!filter.endDate ? filter.endDate : ''} />
                                            <input type='hidden' id='STATUS' name='STATUS' value={!!filter && !!filter.status ? filter.status.ID : ''} />
                                            <input type='hidden' id='LEVEL' name='LEVEL' value={!!filter && !!filter.level ? filter.level.ID : ''} />
                                            <input type='hidden' id='COMP_RELATED' name='COMP_RELATED' value={!!filter && !!filter.unit ? filter.unit.ID : ''} />
                                            <input type='hidden' id='ID' name='ID' value={!!filter && !!filter.number ? filter.number : ''} />
                                            <img title='导出' src={theme === 'dark' ? IconExportDark : IconExport} className={style.btn} onClick={this.exportFile} />
                                        </form>
                                        <div className={style.filterWrapper}>
                                            <Filter
                                                showFilter={this.state.showFilter}
                                                size={this.state.filterSize}
                                                arrowPos={{left: '5.12rem'}}
                                                hideItems={['footerTime']}
                                                onSearch={this.searchAlarmsByFilter} />
                                        </div>
                                        {!Utils.isEmpty(tableModels) ?
                                        <Table
                                            tableId='modelDetail'
                                            table={tableModels}
                                            ths={['预警ID', '区域', '风场', '风机', '开始时间', '结束时间', '累计异常时间(小时)', '模型名称','备注', '预警信息', '类型', '等级', '关联部件', '状态']}
                                            keys={['ID', 'AREA_NAME', 'PROJECT_NAME', 'LOCATION_CODE', 'START_TIME', 'END_TIME', 'ADD_UP_TIME', 'PREDICT_MODEL_NAME','REMARK', 'CONTENT', 'MODEL_TYPE', 'LEVEL_NAME', 'COMP_RELATED_NAME', 'STATUS_NAME']}
                                            hasHeader={false}
                                            hasOrder={false}
                                            totalRow={10}
                                            pager={this.state.pager}
                                            onPageChange={this.handlePageChange}
                                            onItemClick={this.viewAlarmDetail}
                                            trAspectRatio={0.026} /> : <div className='dataEmpty'></div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        modelDetail: state.alarms.modelDetail || {},
        modelDetailSearch: state.alarms.modelDetailSearch || {}
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getModelById: function({ data, before, after, success, fail }) {
            dispatch(actions.getModelById({ data, before, after, success, fail }));
        },
        getModelDetail: function({ data, before, after, success, fail }) {
            dispatch(actions.getModelDetail({ data, before, after, success, fail }));
        },
        getModelDetailSearch: function({ data, before, after, success, fail }) {
            dispatch(actions.getModelDetailSearch({ data, before, after, success, fail }));
        },
        getWorkbenchExport: function({ data, before, after, success, fail }) {
            dispatch(actions.getWorkbenchExport({ data, before, after, success, fail }));
        },
        getParameterByTypeCode: function({ data, before, after, success, fail }) {
            dispatch(actions.getParameterByTypeCode({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ModelDetail);
