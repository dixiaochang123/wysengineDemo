import React from 'react';
import Moment from 'moment';
import Tooltip from 'rc-tooltip';

import Constant from 'constant/index';
import Utils from 'utils/utils';
import Pager from 'subComponents/Pager';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class TableWeatherAlarm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 翻页回调事件
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    handlePageChange(currPage) {
        !!this.props.onPageChange && this.props.onPageChange(currPage);
    }
    render() {
        let table = this.props.table.map((item, index) => {
            let trStyle = index % 2 == 0 ? style.odd : '';
            let weatherIcon = require('images/weather/' + Constant.WEATHER_TYPES[item.CATEGOTY] + '_' + Constant.WEATHER_LEVELS[item.LEVEL] + '.png');
            let tooltipOverlay = <span className='rc-tooltip-overlay-inner'>{item.ISSUE_CONTENT}</span>;
            let tooltipArrowContent = <div className='rc-tooltip-arrow-inner'></div>;
            return (
                <tr key={'tr' + index} className={trStyle}>
                    <td className='tc'>
                        <img src={weatherIcon} className={style.weatherIcon} />
                    </td>
                    <td className={'tc ' + style.weatherInfo}>
                        <Tooltip
                            placement='left'
                            overlay={tooltipOverlay}
                            overlayClassName={index % 2 == 0 ? 'oddOverlay' : 'evenOverlay'}
                            arrowContent={tooltipArrowContent}
                            trigger='hover'>
                            <span>
                                {item.ISSUE_TITLE}
                            </span>
                        </Tooltip>
                    </td>
                    <td className='tc'>{item.ISSUE_TIME}</td>
                </tr>
            );
        });

        let emptyRows = [];
        let totalRow = 5;
        if (!!this.props.pager) {
            totalRow = this.props.pager.pageSize;
        }
        if (!!totalRow) {
            for (let i = 0; i < totalRow - this.props.table.length; i++) {
                let rowIndex = this.props.table.length + i;
                let isOddRow = rowIndex % 2 == 0;
                let rowStyle = isOddRow ? style.odd : '';
                let rowTds = [];
                for (let j = 0; j < 4; j++) {
                    rowTds.push(<td key={'rowTd' + Math.random().toFixed(5)}></td>);
                }
                emptyRows.push(<tr key={this.props.tableId + 'tr' + rowIndex} className={rowStyle}>{rowTds}</tr>);
            }
        }

        return (
            <div className='full'>
                <div className='panelHeader'>
                    <span className='panelTitle'>极端天气预警</span>
                    <span className='panelSubTitle'>{Moment().format('YYYY-MM-DD')}</span>
                </div>
                <div className={style.boxInner}>
                    {Utils.isEmpty(this.props.table) ?
                    <div className='dataEmpty'></div> :
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th className='tc'>等级</th>
                                <th className='tc'>预警信息</th>
                                <th className='tc'>预警发布时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            {table}
                            {emptyRows}
                        </tbody>
                    </table>}
                    {Utils.isEmpty(this.props.table) ? null :
                    <div className={style.pager}>
                        <Pager
                            pager={this.props.pager}
                            onPageChange={this.handlePageChange} />
                    </div>}
                </div>
            </div>
        );
    }
}

module.exports = TableWeatherAlarm;
