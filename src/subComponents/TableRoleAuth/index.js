import React from 'react';
import Utils from 'utils/utils';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

const AUTH_MAP = {
    '增加': 'add',
    '修改': 'edit',
    '删除': 'delete',
    '查询': 'query',
    '导出': 'export',
    '审批': 'approve'
};

class TableRoleAuth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 展示角色权限表格
        this.toggleRoleAuth = this.toggleRoleAuth.bind(this);
    }
    toggleRoleAuth(auth) {
        !!this.props.onRoleAuthChange && this.props.onRoleAuthChange(auth);
    }
    render() {
        let ths = this.props.ths.map((item) => <th key={'th' + Math.random().toFixed(5)} className='tc'>{item}</th>);
        let tableKeys = Object.keys(this.props.table) || [];
        let table = tableKeys.length > 0 ? tableKeys.map(function(item, index) {
            let trStyle = index % 2 == 0 ? style.odd : '';
            let tds = this.props.ths.slice(1).map(function(thKey, keyIndex) {
                let columns = this.props.table[item];
                let targetAuth = columns.find((colItem) => colItem.AUTH_NAME == AUTH_MAP[thKey]);
                return (
                    <td key={'td' + item + keyIndex} className='tc'>
                        <div className={targetAuth.HAS_RIGHT == 0 ? style.checkbox : style.checkboxActive} onClick={this.toggleRoleAuth.bind(this, targetAuth)}></div>
                    </td>
                );
            }.bind(this));

            return (
                <tr key={this.props.tableId + 'tr' + index} className={trStyle}>
                    <td key={'td' + item}>{item}</td>
                    {tds}
                </tr>
            );
        }.bind(this)) : null;

        return (
            <div className={style.box}>
                <table className={style.table}>
                    <thead>
                        <tr>
                            {ths}
                        </tr>
                    </thead>
                    <tbody>
                        {table}
                    </tbody>
                </table>
            </div>
        );
    }
}

module.exports = TableRoleAuth;
