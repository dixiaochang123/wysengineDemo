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
            editingItem: {},
            // 是否
            isNot: [{
                name: '是',
                id: 0
            },{
                name: '否',
                id: 1
            }],
            isNotChecked: '是'
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
        this.handleIsNotChange = this.handleIsNotChange.bind(this);
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
    }
    componentDidUpdate() {
        Utils.handleBigScreenDomHeight();
    }
    handleIsNotChange() {
        // this.setState({
        //     isNotChecked: item1.name
        // })
        // !!this.props.onIsNotChange && this.props.onIsNotChange(item);
    }
    handlePageChange(currPage) {
        !!this.props.onPageChange && this.props.onPageChange(currPage);
    }
    selectItem(itemIndex) {
        !!this.props.onSelected && this.props.onSelected(itemIndex);
    }
    modify(role) {
        !!this.props.onModify && this.props.onModify(role);
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
        // let operation = !!ths && !!ths[ths.length-1].props && ths[ths.length-1].props.children=='问题描述' ? true : false
        let tableMap = [].concat(this.props.table);
        // tableMap.push({CREATE_TIME: '',CREATE_USER: 'input', ID: '',MODEL_ID:'',NAME:'失效',ORDER_NO:'',SYS_MOD_COUNT:'',SYS_MOD_TIME:null,SYS_MOD_USER:null});
        let table = tableMap.map(function(item, index) {
            let currPage = this.props.pager.currPage;
            let pageSize = this.props.pager.pageSize;
            let order = currPage == 1 ? (index + 1) : (currPage - 1) * pageSize  + (index + 1);
            let trStyle = index % 2 == 0 ? style.odd : '';
            let tds = this.props.keys.map(function(key, keyIndex) {
                let values = item[key];
                if(item[key]=='input') {
                    values = <input className={style.input1} type='text' name='name' value={this.state.chargeName} onChange={this.handleChargeNameChange} onBlur={this.inputOnBlur}/>
                }
                if(key== 'CHECK_RESULT') {
                    values =  (
                            <div className='modalFormRadioWrapper'>
                                <span className={item[key] == 1 ||  item[key]== null ? 'modalFormRadio active' : 'modalFormRadio'} onClick={this.handleIsNotChange}></span>
                                <span className={'modalFormRadioText '+ style.modalFormRadioText}>是</span>
                                <span className={item[key] == 2 ? 'modalFormRadio active' : 'modalFormRadio'} onClick={this.handleIsNotChange}></span>
                                <span className='modalFormRadioText'>否</span>
                            </div>
                        );
                }

                return (
                    <td key={'td' + key + keyIndex} className='tc' title={item[key]}>{values}</td>
                );
            }.bind(this));

            return (
                <tr key={this.props.tableId + 'tr' + index} className={trStyle} data-aspect-ratio={this.props.trAspectRatio}>
                    <td className={this.props.hasOrder ? 'tc' : 'none'}><span>{order}</span></td>
                    {tds}
                </tr>
            );
        }.bind(this));

        let emptyRows = [];
        if (!!this.props.totalRow) {
            for (let i = 0; i < this.props.totalRow - this.props.table.length; i++) {
                let isOddRow = rowIndex % 2 == 0;
                let rowIndex = this.props.table.length + i;
                let rowStyle = isOddRow ? style.odd : '';
                let rowTds = [];
                for (let j = 0; j < ths.length; j++) {
                    rowTds.push(<td key={'rowTd' + Math.random().toFixed(5)}></td>);
                }
                emptyRows.push(<tr key={this.props.tableId + 'tr' + rowIndex} className={rowStyle} data-aspect-ratio={this.props.trAspectRatio}>{rowTds}</tr>);
            }
        }
        let abc =  (<div className='modalFormRadioWrapper'>
                        <span className={'modalFormRadio active' } onClick={this.handleIsNotChange}></span>
                        <span className={'modalFormRadioText '+ style.modalFormRadioText}>传感器异常</span>
                        <span className={'modalFormRadio active' } onClick={this.handleIsNotChange}></span>
                        <span className={'modalFormRadioText '+ style.modalFormRadioText}>齿轮箱油位过低/高</span>
                        <span className={'modalFormRadio active' } onClick={this.handleIsNotChange}></span>
                        <span className={'modalFormRadioText '+ style.modalFormRadioText}>齿轮箱油位过低/高</span>
                        <span className={'modalFormRadio active' } onClick={this.handleIsNotChange}></span>
                        <span className={'modalFormRadioText '+ style.modalFormRadioText}>齿轮箱油位过低/高</span>
                        <span className={'modalFormRadio active' } onClick={this.handleIsNotChange}></span>
                        <span className={'modalFormRadioText '+ style.modalFormRadioText}>齿轮箱油位过低/高</span>
                        <span className={'modalFormRadio active' } onClick={this.handleIsNotChange}></span>
                        <span className={'modalFormRadioText '+ style.modalFormRadioText}>传感器异常</span>
                        <span className={'modalFormRadio active' } onClick={this.handleIsNotChange}></span>
                        <span className={'modalFormRadioText '+ style.modalFormRadioText}>齿轮箱油位过低/高</span>
                        <span className={'modalFormRadio active' } onClick={this.handleIsNotChange}></span>
                        <span className={'modalFormRadioText '+ style.modalFormRadioText}>齿轮箱油位过低/高</span>
                        <span className={'modalFormRadio active' } onClick={this.handleIsNotChange}></span>
                        <span className={'modalFormRadioText '+ style.modalFormRadioText}>其他</span>
                    </div>);
        let lastTd = <tr><td className={this.props.hasOrder ? 'tc' : 'none'}>{tableMap.length+1}</td><td>失效</td><td colSpan="3">{abc}</td></tr>;
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
                        {lastTd}
                        {emptyRows}
                    </tbody>
                </table>
                <div className={this.props.pageShow ? style.pageShow : 'none'}>
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
