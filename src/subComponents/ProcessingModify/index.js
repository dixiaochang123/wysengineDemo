import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';
import FileUploads from 'subComponents/FileUploads';
import Dropdown from 'subComponents/Dropdown';
import Datebox from 'subComponents/Datebox';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class ProcessingModify extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            err: '',
            date: '',
            time: '',
            person: '',
            process: '',
            file: '',
            options: {}
        };

        // 清除错误
        this.cleanErr = this.cleanErr.bind(this);
        // 取消修改
        this.cancelModify = this.cancelModify.bind(this);
        // 确定修改
        this.determineModify = this.determineModify.bind(this);
        // 处理密码变化
        this.handlePwdChange = this.handlePwdChange.bind(this);
        // 处理人
        this.handlePersonChange = this.handlePersonChange.bind(this);
        // 处理过程
        this.handleConfirmPwdChange = this.handleConfirmPwdChange.bind(this);
        // 上传下载
        this.fileupload = this.fileupload.bind(this);
        // 处理时间date
        this.handleDateChange = this.handleDateChange.bind(this);
        // 处理时间time
        this.handleTimeChange = this.handleTimeChange.bind(this);
    }
    cleanErr() {
        this.setState({
            err: ''
        });
    }
    cancelModify() {
        this.props.onClose && this.props.onClose();
    }
    handleDateChange(date) {
        this.setState({
            date: date
        });
    }
    handleTimeChange(time) {
        let date = this.state.date || '';
        this.setState({
            time: date +' '+ time
        },function() {
            console.log(this.state.time)
        }.bind(this));
    }
    determineModify() {
        console.log(this.props.time)
        let user = User.get();
        let time = this.state.time;
        let person = this.state.person;
        let process = this.state.process;
        let file = this.state.file;
        if (!time) {
            this.setState({
                err: '处理时间不能为空'
            });
            return false;
        }
        if (!person) {
            this.setState({
                err: '处理人不能为空'
            });
            return false;
        }
        if (!process) {
            this.setState({
                err: '处理过程不能为空'
            });
            return false;
        }
        this.props.saveDisposeProcess({
            data: {
                ID: '',
                WORKORDER_ID:9,
                disposeProcessFiles:[],
                DISPOSE_TIME: time,
                DISPOSE_MAN: person,
                DESCRIPTION:process
            },
            success: function() {
                this.props.onClose && this.props.onClose();
            }.bind(this)
        });
    }
    fileupload(options) {
        console.log(options)
    }
    handlePwdChange(event) {
        let pwd = event.target.value;
        this.setState({
            pwd: pwd
        });
    }
    handlePersonChange(event) {
        let person = event.target.value;
        this.setState({
            person: person
        });
    }
    handleConfirmPwdChange(event) {
        let process = event.target.value;
        this.setState({
            process: process
        });
    }

    render() {
        return (
            <div className={style.box}>
                <div className='panel'>
                    <div className='panelHeader'>
                        <div className='panelTitle'>处理过程</div>
                    </div>
                    <div className='panelBody'>
                        <div className='modalFormErr'>{this.state.err}</div>
                        <div className='modalFormItemPersoninfo modalFormBtns'>
                            <div className='modalFormLabelLarge'>处理时间：</div>
                            <Datebox
                                id='alarmDatebox'
                                isActive={true}
                                isInModal={true}
                                onSelect={this.handleDateChange}/>
                            <Datebox
                                id='alarmDatebox'
                                mode='timebox'
                                isActive={true}
                                isInModal={true}
                                onSelect={this.handleTimeChange}/>
                            {/*<input type='text' value={this.state.pwd} onChange={this.handlePwdChange} className='modalFormInput' onFocus={this.cleanErr} autoComplete='off' />*/}
                        </div>
                        <div className='modalFormItemPersoninfo modalFormBtns'>
                            <div className='modalFormLabelLarge'>处理人：</div>
                            <input type='text' value={this.state.person} onChange={this.handlePersonChange} className='modalFormInput' onFocus={this.cleanErr} />
                        </div>
                        <div className='modalFormItemPersoninfo modalFormBtns'>
                            <div className='modalFormLabelLarge'>处理过程：</div>
                            <textarea
                                cols='80'
                                rows='2'
                                placeholder='处理过程'
                                style={{resize: 'none', borderColor: '#121626', backgroundColor: 'transparent'}}
                                value={this.state.process}
                                onChange={this.handleConfirmPwdChange}
                                onFocus={this.cleanErr}></textarea>
                            {/*<input type='password' value={this.state.confirmPwd} onChange={this.handleConfirmPwdChange} className='modalFormInput' onFocus={this.cleanErr} />*/}
                        </div>
                        <div className={'modalFormItemPersoninfo modalFormBtns ' + style.chuliguocheng}>
                            <div className='modalFormLabelLarge'>处理过程：</div>
                            <textarea
                                cols='80'
                                rows='2'
                                style={{resize: 'none', borderColor: '#121626', backgroundColor: 'transparent'}}
                                onFocus={this.cleanErr}></textarea>
                                <div className={style.uploadImg}></div>
                                <div className={style.fileUpload}><FileUploads onClick={this.fileupload}/></div>
                            {/*<input type='password' value={this.state.confirmPwd} onChange={this.handleConfirmPwdChange} className='modalFormInput' onFocus={this.cleanErr} />*/}
                        </div>
                        <div className='modalFormBtns'>
                            <a href='javascript:;' onClick={this.determineModify} className='modalFormConfirmBtn'>确定</a>
                            <a href='javascript:;' onClick={this.cancelModify} className='modalFormCancelBtn'>取消</a>
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
        saveDisposeProcess: function({ data, before, after, success, fail }) {//保存处理过程
            dispatch(actions.saveDisposeProcess({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ProcessingModify);
