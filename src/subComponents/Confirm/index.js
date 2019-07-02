import React from 'react';
import Utils from 'utils/utils';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class Confirm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 确认回调
        this.confirm = this.confirm.bind(this);
        // 取消回调
        this.cancel = this.cancel.bind(this);
    }
    confirm() {
        !!this.props.onConfirm && this.props.onConfirm();
    }
    cancel() {
        !!this.props.onCancel && this.props.onCancel();
    }
    render() {
        return (
            <div className={style.box}>
                <div className={style.boxInner}>
                    <div className={style.tips + ' tc'}>{'确认执行正在进行的操作？'}</div>
                    <div className={style.btns + ' tc'}>
                        <div className={'modalFormConfirmBtn'} onClick={this.confirm}>确认</div>
                        <div className={'modalFormCancelBtn'} onClick={this.cancel}>取消</div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Confirm;
