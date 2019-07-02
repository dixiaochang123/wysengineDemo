import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class PersonInfoModify extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            err: '',
            pwd: '',
            newPwd: '',
            confirmPwd: ''
        };

        // 清除错误
        this.cleanErr = this.cleanErr.bind(this);
        // 取消修改
        this.cancelModify = this.cancelModify.bind(this);
        // 确定修改
        this.determineModify = this.determineModify.bind(this);
        // 处理密码变化
        this.handlePwdChange = this.handlePwdChange.bind(this);
        // 处理新密码变化
        this.handleNewPwdChange = this.handleNewPwdChange.bind(this);
        // 处理确认密码变化
        this.handleConfirmPwdChange = this.handleConfirmPwdChange.bind(this);
    }
    cleanErr() {
        this.setState({
            err: ''
        });
    }
    cancelModify() {
        this.props.onClose && this.props.onClose();
    }
    determineModify() {
        let user = User.get();
        let pwd = this.state.pwd;
        let newPwd = this.state.newPwd;
        let confirmPwd = this.state.confirmPwd;
        if (!pwd) {
            this.setState({
                err: '原密码不能为空'
            });
            return false;
        }
        if (!newPwd) {
            this.setState({
                err: '新密码不能为空'
            });
            return false;
        }
        if (newPwd != confirmPwd) {
            this.setState({
                err: '新密码和确认密码不一致'
            });
            return false;
        }
        this.props.resetPassword({
            data: {
                ID: user.ID,
                PASSWORD: newPwd
            },
            success: function() {
                this.props.onClose && this.props.onClose();
            }.bind(this)
        });
    }
    handlePwdChange(event) {
        let pwd = event.target.value;
        this.setState({
            pwd: pwd
        });
    }
    handleNewPwdChange(event) {
        let newPwd = event.target.value;
        this.setState({
            newPwd: newPwd
        });
    }
    handleConfirmPwdChange(event) {
        let confirmPwd = event.target.value;
        this.setState({
            confirmPwd: confirmPwd
        });
    }
    render() {
        return (
            <div className={style.box}>
                <div className='panel'>
                    <div className='panelHeader'>
                        <div className='panelTitle'>修改密码</div>
                    </div>
                    <div className='panelBody'>
                        <div className='modalFormErr'>{this.state.err}</div>
                        <div className='modalFormItemPersoninfo'>
                            <div className='modalFormLabelLarge'>请输入原密码：</div>
                            <input type='text' value={this.state.pwd} onChange={this.handlePwdChange} className='modalFormInput' onFocus={this.cleanErr} autoComplete='off' />
                        </div>
                        <div className='modalFormItemPersoninfo'>
                            <div className='modalFormLabelLarge'>请输入新密码：</div>
                            <input type='password' value={this.state.newPwd} onChange={this.handleNewPwdChange} className='modalFormInput' onFocus={this.cleanErr} />
                        </div>
                        <div className='modalFormItemPersoninfo'>
                            <div className='modalFormLabelLarge'>再次输入新密码：</div>
                            <input type='password' value={this.state.confirmPwd} onChange={this.handleConfirmPwdChange} className='modalFormInput' onFocus={this.cleanErr} />
                        </div>
                        <div className='modalFormBtns'>
                            <a href='javascript:;' onClick={this.cancelModify} className='modalFormCancelBtn'>取消</a>
                            <a href='javascript:;' onClick={this.determineModify} className='modalFormConfirmBtn'>确定</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function() {
    return {};
};

let mapDispatchToProps = function(dispatch) {
    return {
        resetPassword: function({ data, before, after, success, fail }) {
            dispatch(actions.resetPassword({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PersonInfoModify);
