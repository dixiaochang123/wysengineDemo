import React from 'react';

import Utils from 'utils/utils';
import Pager from 'subComponents/Pager';
import Confirm from 'subComponents/Confirm';

import ModifyIcon from 'images/common/modify.png';
import DeleteIcon from 'images/common/delete.png';

import IconKey from 'images/common/icon_key.png';
import IconKeyDark from 'images/common/icon_key_dark.png';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class TableOperation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfirm: false,
            editingItem: {}
        };

        // 翻页
        this.handlePageChange = this.handlePageChange.bind(this);
        // 选择项目
        this.selectItem = this.selectItem.bind(this);
        // 修改
        this.modify = this.modify.bind(this);
        // 修改密码
        this.modifypassword = this.modifypassword.bind(this);
        // 删除
        this.delete = this.delete.bind(this);
        // 取消删除
        this.cancelDelete = this.cancelDelete.bind(this);
        // 确认删除
        this.confirmDelete = this.confirmDelete.bind(this);
        // 处理数据项点击事件
        this.handleItemClick = this.handleItemClick.bind(this);
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
    }
    componentDidUpdate() {
        Utils.handleBigScreenDomHeight();
    }
    handleItemClick(item) {
        // !!this.props.onItemClick && this.props.onItemClick(item);
    }
    handlePageChange(currPage) {
        !!this.props.onPageChange && this.props.onPageChange(currPage);
    }
    selectItem(itemIndex) {
        !!this.props.onSelected && this.props.onSelected(itemIndex);
    }
    modify(role) {
        !!this.props.onModify && this.props.onModify(role);
        !!this.props.onItemClick && this.props.onItemClick(role);
    }
    modifypassword(role) {
        !!this.props.onModifypassword && this.props.onModifypassword(role);
    }
    delete(role) {
        this.setState({
            showConfirm: true,
            editingItem: role
        });
    }
    cancelDelete() {
        this.setState({
            showConfirm: false
        });
    }
    confirmDelete() {
        let editingItem = this.state.editingItem;
        this.setState({
            showConfirm: false,
            editingItem: {}
        });
        !!this.props.onDelete && this.props.onDelete(editingItem);
    }
    render() {
        let ths = this.props.ths.map((item) => <th key={'th' + Math.random().toFixed(5)} className='tc'>{item}</th>);
        let operation = !!ths && !!ths[ths.length-1].props && ths[ths.length-1].props.children=='操作' ? true : false
        let table = this.props.table.map(function(item, index) {
            let currPage = this.props.pager.currPage;
            let pageSize = this.props.pager.pageSize;
            let order = currPage == 1 ? (index + 1) : (currPage - 1) * pageSize  + (index + 1);
            let trStyle = index % 2 == 0 ? style.odd : '';
            let tds = this.props.keys.map(function(key, keyIndex) {
                let itemVal = '';
                if (item['ACTIVE'] == 1) {
                    itemVal = '激活';
                }
                if (item['ACTIVE'] == 0) {
                    itemVal = '不激活';
                }
                return (
                    <td key={'td' + key + keyIndex} className='tc' title={item[key]}>{key != 'ACTIVE' ? item[key] : itemVal}</td>
                );
            }.bind(this));

            return (
                <tr key={this.props.tableId + 'tr' + index} className={trStyle} onClick={this.handleItemClick.bind(this, item)} data-aspect-ratio={this.props.trAspectRatio}>
                    <td className={this.props.hasOrder ? 'tc' : 'none'}><span>{order}</span></td>
                    {tds}
                    <td className={!!operation ? 'tc' : 'none' }>
                        <img title={'修改'} src={ModifyIcon} className={style.modifyicon} onClick={this.modify.bind(this, item)} />
                        <img title={'删除'} src={DeleteIcon} className={style.deleteicon} onClick={this.delete.bind(this, item)} />
                        {/*<span className={!!item.GENDER_NAME ? style.modifyPassword : ' none'} onClick={this.modifypassword.bind(this, item)} >修改密码</span>*/}
                        <div className={!!item.GENDER_NAME ? style.btnWrapper : ' none'}  onClick={this.modifypassword.bind(this, item)}>
                            <img src={theme === 'dark' ? IconKeyDark : IconKey} />
                            <span>修改密码</span>
                        </div>
                    </td>
                </tr>
            );
        }.bind(this));

        let emptyRows = [];
        if (!!this.props.totalRow) {
            for (let i = 0; i < this.props.totalRow - this.props.table.length; i++) {
                let rowIndex = this.props.table.length + i;
                let isOddRow = rowIndex % 2 == 0;
                let rowStyle = isOddRow ? style.odd : '';
                let rowTds = [];
                for (let j = 0; j < ths.length; j++) {
                    rowTds.push(<td key={'rowTd' + Math.random().toFixed(5)}></td>);
                }
                emptyRows.push(<tr key={this.props.tableId + 'tr' + rowIndex} className={rowStyle} data-aspect-ratio={this.props.trAspectRatio}>{rowTds}</tr>);
            }
        }

        return (
            <div className={style.box}>
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
                </table>
                <div className={this.props.pageShow  && this.props.isPageShow!=1 ? style.pageShow : 'none'}>
                    <Pager
                        pager={this.props.pager}
                        onPageChange={this.handlePageChange} />
                </div>
                {this.state.showConfirm ?
                <Confirm
                    onCancel={this.cancelDelete}
                    onConfirm={this.confirmDelete} /> : null}
            </div>
        );
    }
}

module.exports = TableOperation;
