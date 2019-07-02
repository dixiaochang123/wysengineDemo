import React from 'react';
import Moment from 'moment';

import User from 'utils/user';
import Utils from 'utils/utils';
import Pager from 'subComponents/Pager';

import ModifyIcon from 'images/common/modify.png';
import DeleteIcon from 'images/common/delete1.png';
import ApproveIcon from 'images/common/ty.png';
import ApproveIconL from 'images/common/tyl.png';
import Accuracy from 'images/common/accuracy.png';
import InAccuracy from 'images/common/inaccuracy.png';

import Constant from 'constant/index';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

let LEVEL_STYLE_MAP = {
    '一级': style.level + ' ' + style.levelOne,
    '二级': style.level + ' ' + style.levelTwo,
    '三级': style.level + ' ' + style.levelThree,
    '四级': style.level + ' ' + style.levelFour,
    '五级': style.level + ' ' + style.levelFive
};

let LEVEL_NAME_MAP = {
    '一级': 1,
    '二级': 2,
    '三级': 3,
    '四级': 4,
    '五级': 5
};

const MENU_ITEM_HEIGHT = 36;

class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 展示更多菜单，只有首页台风预警
            showMoreMenu: false
        };

        // 更多回调事件
        this.onMore = this.onMore.bind(this);
        // 处理翻页变化
        this.handlePageChange = this.handlePageChange.bind(this);
        // 处理数据项点击事件
        this.handleItemClick = this.handleItemClick.bind(this);
        // 处理菜单选择事件
        this.handleMenuSelect = this.handleMenuSelect.bind(this);

        // 处理工作平台预警修改事件
        this.handleModify = this.handleModify.bind(this);
        // 处理工作平台预警审核事件
        this.handleApprove = this.handleApprove.bind(this);
        // 处理工作平台预警删除事件
        this.handleDelete = this.handleDelete.bind(this);
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
    }
    componentDidUpdate() {
        Utils.handleBigScreenDomHeight();
    }
    onMore() {
        if (!!this.props.onMore) {
            this.props.onMore();
        } else if (!!this.props.moreMenu) {
            this.setState({
                showMoreMenu: true
            });
        }
    }
    handlePageChange(currPage) {
        !!this.props.onPageChange && this.props.onPageChange(currPage);
    }
    handleItemClick(item) {
        !!this.props.onItemClick && this.props.onItemClick(item);
    }
    handleMenuSelect(menuItem) {
        this.setState({
            showMoreMenu: false
        });
        !!this.props.onSelectMenu && this.props.onSelectMenu(menuItem);
    }
    handleModify(item, event) {
        event.stopPropagation && event.stopPropagation();
        !!this.props.onModify && this.props.onModify(item);
    }
    handleApprove(item, event) {
        event.stopPropagation && event.stopPropagation();
        !!this.props.onApprove && this.props.onApprove(item);
    }
    handleDelete(item, event) {
        event.stopPropagation && event.stopPropagation();
        !!this.props.onDelete && this.props.onDelete(item);
    }
    render() {
        let thList = this.props.ths || [];
        if (this.props.withOperation == true) {
            thList.push('操作');
        }
        let ths = thList.map((item) => <th key={'th' + Math.random().toFixed(5)} className='tc'>{item}</th>);

        let tableData = this.props.table;
        if (this.props.keys.indexOf('PREDICT_DATE') != -1) {
            tableData.sort((a, b) => {
                let aTime = Moment(a['PREDICT_DATE'], 'YYYY-MM-DD HH:mm:ss').valueOf();
                let bTime = Moment(b['PREDICT_DATE'], 'YYYY-MM-DD HH:mm:ss').valueOf();
                return parseInt(bTime) - parseInt(aTime);
            });
        }
        let table = !!tableData ? tableData.map(function(item, index) {
            let currPage = !this.props.hidePager ? this.props.pager.currPage : 1;
            let pageSize = !this.props.hidePager ? this.props.pager.pageSize : 5;
            let order = currPage == 1 ? '0' + (index + 1) : (currPage - 1) * pageSize + (index + 1);
            let trStyle = index % 2 == 0 ? style.odd : '';
            let tdStyle = this.props.trHeight ? {
                height: this.props.trHeight + 'px',
                lineHeight: this.props.trHeight + 'px',
                padding: 0
            } : {};
            let tableWidth = $('.' + style.box).css('width');
            if (!!tableWidth && !!this.props.hasOrder) {
                tdStyle = Object.assign({}, tdStyle, {
                    maxWidth: Math.floor(tableWidth.slice(0, -2) / ths.length) + 'px'
                });
            } else {
                tdStyle = Object.assign({}, tdStyle, {
                    maxWidth: Math.floor(tableWidth.slice(0, -2) / ths.length-1) + 'px'
                });
            }
            let tds = this.props.keys.map(function(key, keyIndex) {
                let tdText = <span>{item[key]}</span>;
                let isTime = key == 'PREDICT_DATE' && ('' + item[key]).length == 13 && !isNaN(item[key]);
                let isLevel = key == 'LEVEL_NAME';
                let isStatus = key == 'STATUS_NAME';
                let isVeracity = key =='COMPLETE_CODE_NAME';
                if (isTime) {
                    tdText = <span>{Moment(item[key]).format('YYYY-MM-DD HH:mm:ss')}</span>;
                }
                if (isLevel) {
                    tdText = <span className={LEVEL_STYLE_MAP[item[key]]}>{LEVEL_NAME_MAP[item[key]]}</span>;
                }
                if (isStatus) {
                    let tdItemStyle = {
                        backgroundColor: Constant.STATUS_COLOR_MAP[item[key]]
                    };
                    tdText = <span className={style.statusLabel} style={tdItemStyle}>{item[key]}</span>;
                }
                if(isVeracity) {
                    if(item[key]=='准确') {
                        tdText = <span><img className={style.isveracity} src={Accuracy} /></span>;
                    } else if(item[key]=='不准确') {
                        tdText = <span><img className={style.isveracity} src={InAccuracy} /></span>;
                    } else {
                        tdText = <span></span>;
                    }
                }

                return (
                    <td title={item[key]} key={'td' + key + keyIndex} className='tc' style={tdStyle}>
                        {tdText}
                    </td>
                );
            }.bind(this));

            let operation = [];
            if (this.props.withOperation == true) {
                let hasEditAuth = User.hasAuth('workbench__edit');
                let hasDeleteAuth = User.hasAuth('workbench__delete');
                let hasApproveAuth = User.hasAuth('workbench__approve');

                operation = [].concat(this.props.keys).map(function(key) {
                    let isStatus = key == 'STATUS_NAME';
                    if (isStatus) {
                        let isImg = Constant.STATUS_IMG_MAP[item[key]];
                        return (
                            <td key={index} className='tc'>
                                <img title='修改' src={ModifyIcon} className={hasEditAuth ? style.operationIcon : 'none'} onClick={this.handleModify.bind(this, item)} />
                                <img title={!!isImg ? '已审核' : '未审核'} src={hasApproveAuth ? (!!isImg ? ApproveIconL : ApproveIcon) : 'none'} className={style.operationIcon} onClick={this.handleApprove.bind(this, item)} />
                                <img title='删除' src={DeleteIcon} className={hasDeleteAuth ? style.operationIcon : 'none'} onClick={this.handleDelete.bind(this, item)} />
                            </td>
                        );
                    }
                }.bind(this));
            }

            return (
                <tr key={this.props.tableId + 'tr' + index} className={'pointer ' + trStyle} style={tdStyle} onClick={this.handleItemClick.bind(this, item)} data-aspect-ratio={this.props.trAspectRatio}>
                    <td className={this.props.hasOrder ? 'tc' : 'none'} style={tdStyle}>
                        <span title={order}>{order}</span>
                    </td>
                    {tds}
                    {operation}
                </tr>
            );
        }.bind(this)) : [];

        let emptyRows = [];
        let totalRow = 5;
        if (!!this.props.pager) {
            totalRow = this.props.pager.pageSize;
        }
        if (!!totalRow) {
            for (var i = 0; i < totalRow - this.props.table.length; i++) {
                let rowIndex = this.props.table.length + i;
                let isOddRow = rowIndex % 2 == 0;
                let rowStyle = isOddRow ? style.odd : '';
                let rowTds = [];
                for (var j = 0; j < ths.length; j++) {
                    rowTds.push(<td key={'rowTd' + Math.random().toFixed(5)}></td>);
                }
                emptyRows.push(<tr key={this.props.tableId + 'tr' + rowIndex} className={rowStyle} data-aspect-ratio={this.props.trAspectRatio}>{rowTds}</tr>);
            }
        }

        let moreMenu = this.props.moreMenu && this.props.moreMenu.length > 0 ? this.props.moreMenu.map(function(item) {
            return (
                <div key={item.key} className='menuItem tc' onClick={this.handleMenuSelect.bind(this, item)}>{item.value}</div>
            );
        }.bind(this)) : null;

        let moreMenuStyle = this.props.moreMenu && this.props.moreMenu.length > 0 ? {
            top: -(this.props.moreMenu.length * MENU_ITEM_HEIGHT) + 'px'
        } : {};

        let isColorInvert = !!this.props.isColorInvert;

        return (
            <div id={this.props.tableId} className={isColorInvert ? style.box + ' ' + style.boxInvert : style.box}>
                <div className={this.props.hasHeader ? 'panelHeader ' + style.header : 'none'}>
                    <span className='panelTitle'>{this.props.title}</span>
                    <span className='panelSubTitle'>{Moment().format('YYYY-MM-DD')}</span>
                    <span className={this.props.hideMore ? 'none' : 'panelLink linkBtn'} onClick={this.onMore}></span>
                </div>
                {!!this.props.moreMenu && this.props.moreMenu.length > 0 ?
                <div className={this.state.showMoreMenu ? 'menu' : 'none'} style={moreMenuStyle}>
                    {moreMenu}
                </div> : null}
                <div className={style.boxInner}>
                    {Utils.isEmpty(this.props.table) ?
                    <div className='dataEmpty'></div> :
                    <table className={style.table}>
                        <thead>
                            <tr data-aspect-ratio={this.props.trAspectRatio}>
                                {ths}
                            </tr>
                        </thead>
                        <tbody>
                            {table}
                            {emptyRows}
                        </tbody>
                    </table>}
                    {!Utils.isEmpty(this.props.table) && !!this.props.pager && this.props.isPageShow!=1 ?
                    <Pager
                        pager={this.props.pager}
                        onPageChange={this.handlePageChange} /> : null}
                </div>
            </div>
        );
    }
}

module.exports = Table;
