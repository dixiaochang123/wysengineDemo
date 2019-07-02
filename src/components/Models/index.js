// 模型管理
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import Utils from 'utils/utils';

import Navbar from 'subComponents/Navbar';
import ModelPanel from 'subComponents/ModelPanel';
import ChartModelPrecision from 'subComponents/ChartModelPrecision';
import ChartAlarmLevelModel from 'subComponents/ChartAlarmLevelModel';
import ChartAlarmDistributionModel from 'subComponents/ChartAlarmDistributionModel';
import ChartStateDistributionModel from 'subComponents/ChartStateDistributionModel';
import ChartAlarmCompletionRateModel from 'subComponents/ChartAlarmCompletionRateModel';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class Models extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 响应屏幕resize事件
        this.handleResize = this.handleResize.bind(this);
        // 查看模型详情
        this.viewModelDetail = this.viewModelDetail.bind(this);
    }
    componentWillMount() {
        // 获取预警模型产生的预警概览
        this.props.getModelOverview({});
        // 获取按级别分组预警模型列表
        this.props.getModelLevelList({});
        // 获取预警模型总数量
        this.props.getModelTotal({});
    }
    componentDidMount() {
        $(document.body).removeClass('btnLoading');
        this.handleResize();
        Utils.handleBigScreenDomHeight();
    }
    viewModelDetail(model) {
        this.props.router.push({
            pathname: '/modeldetail',
            state: {
                modelId: model[0].ID
            }
        });
    }
    handleResize() {
        let chartsWidth = $('.' + style.charts).css('width');
        $('.' + style.centerTop).css({
            width: chartsWidth * 0.24 + 'px'
        });
        $(window).on('resize', function() {
            $('.' + style.centerTop).css({
                width: chartsWidth * 0.24 + 'px'
            });
        });
    }
    render() {
        let modelOverview = this.props.modelOverview || {};
        let modelAccuracy = !Utils.isEmpty(modelOverview.modelAccuracy) && !!modelOverview.modelAccuracy ? modelOverview.modelAccuracy.slice(0, -1) : 0;
        modelAccuracy = 85;
        let predictLevelCountMap = modelOverview.predictLevelCountMap || {};
        let statusCountList = !Utils.isEmpty(modelOverview) ? modelOverview.statusCountList : [];

        let modelLevelList = this.props.modelLevelList || [];
        let modelGroups = modelLevelList.length > 0 ? modelLevelList[0] : {};
        let modelKeys = Object.keys(modelGroups);
        let typeStyle = {
            width: 100 / modelKeys.length + '%'
        }
        let types = modelKeys.map(function(key, index) {
            return (
                <div key={'modelPanel' + index} className='pure-u-1-5' style={typeStyle}>
                    <ModelPanel
                        triggerId={'modelPanel' + index}
                        data={modelGroups[key]}
                        isFirst={index == 0}
                        isLast={index == modelKeys.length - 1}
                        onViewDetail={this.viewModelDetail} />
                </div>
            );
        }.bind(this));

        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                <div className='boxInner'>
                    <div className={style.charts}>
                        <div className={style.row + ' clearfix'} data-aspect-ratio={0.135}>
                            <div className={style.chart + ' left'}>
                                <div className='panel'>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>预警等级</span>
                                    </div>
                                    <div className='panelBody'>
                                        {!Utils.isEmpty(predictLevelCountMap) ?
                                        <ChartAlarmLevelModel data={predictLevelCountMap} /> : <div className='dataEmpty'></div>}
                                    </div>
                                </div>
                            </div>
                            <div className={style.chart + ' right'}>
                                <div className='panel'>
                                    <div className='panelHeader'>
                                        <span className='panelTitleRight'>预警分布</span>
                                    </div>
                                    <div className='panelBody'>
                                        {!Utils.isEmpty(modelOverview) ?
                                        <ChartAlarmDistributionModel data={modelOverview} /> : <div className='dataEmpty'></div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style.row} data-aspect-ratio={0.135}>
                            <div className={style.chart + ' left'}>
                                <div className='panel'>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>预警完结率</span>
                                    </div>
                                    <div className='panelBody'>
                                        {!Utils.isEmpty(modelOverview) ?
                                        <ChartAlarmCompletionRateModel
                                            data={modelOverview} /> : <div className='dataEmpty'></div>}
                                    </div>
                                </div>
                            </div>
                            <div className={style.chart + ' right'}>
                                <div className='panel'>
                                    <div className='panelHeader'>
                                        <span className='panelTitleRight'>状态分布</span>
                                    </div>
                                    <div className='panelBody'>
                                        {!Utils.isEmpty(statusCountList) ?
                                        <ChartStateDistributionModel data={statusCountList} /> : <div className='dataEmpty'></div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style.center}>
                            <ChartModelPrecision
                                accuracy={modelAccuracy || 0} />
                            <div className={style.total}>
                                <span className={style.totalCount}>{this.props.modelTotal}</span>
                                <span className={style.totalTxt}>模型总数量</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.types} data-aspect-ratio={0.08}>
                        <div className='pure-g'>
                            {types}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        modelOverview: state.alarms.modelOverview || {},
        modelLevelList: state.models.modelLevelList || [],
        modelTotal: state.models.modelTotal || 0
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getModelOverview: function({ data, before, after, success, fail}) {
            dispatch(actions.getModelOverview({ data, before, after, success, fail}));
        },
        getModelTotal: function({ data, before, after, success, fail}) {
            dispatch(actions.getModelTotal({ data, before, after, success, fail}));
        },
        getModelLevelList: function({ data, before, after, success, fail}) {
            dispatch(actions.getModelLevelList({ data, before, after, success, fail}));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Models);
