import React from 'react';
import Utils from 'utils/utils';
import Constant from 'constant/index';
import StatisticsChartItem from 'subComponents/StatisticsChartItem';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class StatisticsCharts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alarms: [],
            technicalAssistances: [],
            plans: []
        };

        // 初始化数据
        this.initData = this.initData.bind(this);
        // 处理标题点击事件
        this.viewDetailByItem = this.viewDetailByItem.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.data != this.props.data) {
            this.initData();
        }
    }
    componentDidMount() {
        this.initData();
    }
    initData() {
        let data = this.props.data;
        let alarms = [].concat([{
            type: '未处理预警',
            total: data.notHandled || 0,
            finished: data.complete || 0
        }, {
            type: '一级预警',
            total: !!data.level1 ? data.level1.value : 0,
            finished: !!data.level1 ? data.level1.finishedValue : 0
        }, {
            type: '二级预警',
            total: !!data.level2 ? data.level2.value : 0,
            finished: !!data.level2 ? data.level2.finishedValue : 0
        }, {
            type: '三级预警',
            total: !!data.level3 ? data.level3.value : 0,
            finished: !!data.level3 ? data.level3.finishedValue : 0
        }]);
        if (Constant.PROJECT == 'mingyang') {
            alarms = alarms.concat([{
                type: '四级预警',
                total: !!data.level4 ? data.level4.value : 0,
                finished: !!data.level4 ? data.level4.finishedValue : 0
            }, {
                type: '五级预警',
                total: !!data.level5 ? data.level5.value : 0,
                finished: !!data.level5 ? data.level5.finishedValue : 0
            }]);
        }
        let technicalAssistances = [].concat([{
            type: '未审核',
            total: data.toBeChecked || 0
        }, {
            type: '已通过',
            total: data.checked || 0
        }, {
            type: '未通过',
            total: data.notPass || 0
        }]);
        let plans = [].concat([{
            type: '已推送',
            total: data.toExecute || 0
        }, {
            type: '已完成',
            total: data.complete || 0
        }]);
        this.setState({
            alarms: alarms,
            technicalAssistances: technicalAssistances,
            plans: plans
        });
    }
    viewDetailByItem(id, subItem) {
        window.event.stopPropagation && window.event.stopPropagation();
        !!this.props.onViewDetailByItem && this.props.onViewDetailByItem(id, subItem);
    }
    render() {
        return (
            <div className={style.box + ' clearfix full'}>
                <StatisticsChartItem
                    id='statisticsAlarm'
                    activeId={this.props.activeId}
                    activeIdNo={this.props.activeIdNo}
                    title='预警'
                    data={this.state.alarms}
                    offset={20}
                    hasFinishedType={false}
                    hideBtn={this.props.hideBtn}
                    onMore={this.props.onMore}
                    onViewDetailByItem={this.viewDetailByItem}
                    onActive={this.viewDetailByItem}
                    noResponseOnTitleAndMoreClick={this.props.noResponseOnTitleAndMoreClick} />
                <StatisticsChartItem
                    id='statisticsTech'
                    activeId={this.props.activeId}
                    title='技术支持'
                    data={this.state.technicalAssistances}
                    offset={20}
                    hideBtn={this.props.hideBtn}
                    onMore={this.props.onMore}
                    onViewDetailByItem={this.viewDetailByItem}
                    onActive={this.viewDetailByItem}
                    noResponseOnTitleAndMoreClick={this.props.noResponseOnTitleAndMoreClick} />
                <StatisticsChartItem
                    id='statisticsPlan'
                    activeId={this.props.activeId}
                    title='执行'
                    data={this.state.plans}
                    offset={-15}
                    hideBtn={this.props.hideBtn}
                    onMore={this.props.onMore}
                    onViewDetailByItem={this.viewDetailByItem}
                    onActive={this.viewDetailByItem}
                    noResponseOnTitleAndMoreClick={this.props.noResponseOnTitleAndMoreClick} />
            </div>
        );
    }
}

module.exports = StatisticsCharts;
