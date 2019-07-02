import React from 'react';
import Utils from 'utils/utils';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class WarningStatisticsHead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
      let statisticsOverview = this.props.statisticsOverview;
        return (
            <div className={style.boxInnerHead1}>
                <div className={style.boxInnerHeadChild1}>
                    <span key='allCount1'>预警总数</span>
                    <span key='allCount2'>预警区域</span>
                    <span key='allCount3'>预警风场</span>
                    <span key='allCount4'>预警风机</span>
                </div>
                <div className={style.boxInnerHeadChild2}>
                    <span key='allCount' className={style.span1}>{!!statisticsOverview.allCount ? statisticsOverview.allCount : '0' }</span>
                    <span key='areaCount' className={style.span2}>{!!statisticsOverview.areaCount ? statisticsOverview.areaCount : '0' }</span>
                    <span key='projectCount' className={style.span3}>{!!statisticsOverview.projectCount ? statisticsOverview.projectCount : '0'}</span>
                    <span key='turbineCount' className={style.span4}>{!!statisticsOverview.turbineCount ? statisticsOverview.turbineCount : '0'}</span>
                </div>
            </div>
        );
    }
}

module.exports = WarningStatisticsHead;
