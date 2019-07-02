import React from 'react';
import Utils from 'utils/utils';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class ChartAlarmDistributionModel extends React.Component {
    render() {
        let chartData = this.props.data;
        let areaCount = chartData.areaCount;
        let windSiteCount = chartData.projectCount;
        let windMachineCount = chartData.turbineCount;
        return (
            <div className={style.box + ' tc'}>
                <div className={style.small + ' tc'}>
                    <div className={style.count}>{areaCount + '个'}</div>
                    <div className={style.label}>区域</div>
                </div>
                <div className={style.normal + ' tc'}>
                    <div className={style.count}>{windSiteCount + '个'}</div>
                    <div className={style.label}>风场</div>
                </div>
                <div className={style.large + ' tc'}>
                    <div className={style.count}>{windMachineCount + '个'}</div>
                    <div className={style.label}>风机</div>
                </div>
            </div>
        );
    }
}

module.exports = ChartAlarmDistributionModel;
