import React from 'react';

import Utils from 'utils/utils';
import Dropdown from 'subComponents/Dropdown';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

const SOURCE_MAP = {
    // predictSourceManual
    96: '手工创建',
    // predictSourceAuto
    97: '模型创建'
};

class PredictInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 当前预警索引
            predictIndex: 0
        };

        // 处理预警次数变化
        this.handlePredictIndexChange = this.handlePredictIndexChange.bind(this);
    }
    componentDidMount() {
        let predict = this.props.predict || {};
        let predictDetailList = !!predict.predictDetailList && predict.predictDetailList.length > 0 ? predict.predictDetailList : [];

        this.setState({
            predictIndex: predictDetailList.length - 1
        });
    }
    componentWillUpdate(nextProps) {
        if (Utils.isEmpty(this.props.predict) && !Utils.isEmpty(nextProps.predict)) {
            this.setState({
                predictIndex: !!nextProps.predict && !!nextProps.predict.predictDetailList ? nextProps.predict.predictDetailList.length - 1 : 0
            });
        }
    }
    handlePredictIndexChange(option) {
        !!this.props.onPredictChange && this.props.onPredictChange(option.value - 1);
        this.setState({
            predictIndex: option.value - 1
        });
    }
    render() {
        let predict = this.props.predict || {};
        let predictIndex = this.state.predictIndex;
        let predictDetailList = !!predict.predictDetailList && predict.predictDetailList.length > 0 ? predict.predictDetailList : [];
        let finalPredictDetailList = predictDetailList.slice(0).reverse();
        let options = finalPredictDetailList.length > 0 ? finalPredictDetailList.map((item, index) => {
            return {
                key: item.ID,
                value: index + 1
            };
        }) : [];

        let targetPredict = finalPredictDetailList[predictIndex];
        let hasTargetPredict = finalPredictDetailList.length > 0 && !!targetPredict;
        let selectedPredict = hasTargetPredict ? {
            key: targetPredict.ID,
            value: predictIndex + 1
        } : {};
        let duration = !predict.ADD_UP_TIME ? '' : predict.ADD_UP_TIME;
        let triggerTimes = !predict.TRIGGER_TIMES ? '' : predict.TRIGGER_TIMES;

        return (
            <div className={style.box}>
                <div className={style.col}>
                    <span className={style.label}>ID</span>
                    <span className={style.val}>{predict.ID}</span>
                </div>
                <div className={style.col}>
                    <span className={style.label}>类型</span>
                    <span className={style.val}>{predict.MODEL_TYPE}</span>
                </div>
                <div className={style.col}>
                    <span className={style.label}>状态</span>
                    <span className={style.val}>{predict.STATUS_NAME}</span>
                </div>
                <div className={style.col}>
                    <span className={style.label}>等级</span>
                    <span className={style.val}>{predict.LEVEL_NAME}</span>
                </div>
                <div className={style.col}>
                    <span className={style.label}>开始时间</span>
                    <span className={style.val} title={predict.START_TIME}>{predict.START_TIME}</span>
                </div>
                <div className={style.col}>
                    <span className={style.label}>结束时间</span>
                    <span className={style.val} title={predict.END_TIME}>{predict.END_TIME}</span>
                </div>
                <div className={style.col}>
                    <span className={style.label}>累计异常时间(小时)</span>
                    <span className={style.val} title={duration}>{duration}</span>
                </div>
                <div className={style.col}>
                    <span className={style.label}>累计次数</span>
                    <span className={style.val} title={triggerTimes}>{triggerTimes}</span>
                </div>
                <div className={style.col + ' ' + style.colSpe}>
                    <span className={style.label}>当前次数</span>
                    <Dropdown
                        btnCls={style.dropdown}
                        overlayCls={style.dropdownMenu}
                        options={options}
                        onSelect={this.handlePredictIndexChange}
                        selectedItem={selectedPredict} />
                </div>
                <div className={style.col}>
                    <span className={style.label}>备注</span>
                    <span className={style.val} title={predict.REMARK}>{predict.REMARK}</span>
                </div>
                <div className={style.col}>
                    <span className={style.label}>区域</span>
                    <span className={style.val}>{predict.AREA_NAME}</span>
                </div>
                <div className={style.col}>
                    <span className={style.label}>风场</span>
                    <span className={style.val} title={predict.PROJECT_NAME}>{predict.PROJECT_NAME}</span>
                </div>
                <div className={style.col}>
                    <span className={style.label}>风机</span>
                    <span className={style.val}>{predict.LOCATION_CODE}</span>
                </div>
                <div className={style.col}>
                    <span className={style.label}>部件</span>
                    <span className={style.val}>{predict.COMP_RELATED_NAME}</span>
                </div>
                <div className={style.col}>
                    <span className={style.label}>预警来源</span>
                    <span className={style.val}>{SOURCE_MAP[predict.SOURCE]}</span>
                </div>
                <div className={style.col}>
                    <span className={style.label}>预警信息</span>
                    <span className={style.val} title={predict.CONTENT}>{predict.CONTENT}</span>
                </div>
            </div>
        );
    }
}

module.exports = PredictInfo;
