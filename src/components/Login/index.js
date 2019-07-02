// 登录页
import React from 'react';
const ReactRedux = require('react-redux');

import style from './index.less';

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';
import EventUtils from 'utils/event';
import Constant from 'constant/index';

import BannerImage from 'images/login/img_bg.png';
// mingyang logo
import MyIconLogo from 'images/homepage/logo.png';
// wysengine logo
import WysengineIconLogo from 'images/homepage/logoWysengine.png';
import IconKey from 'images/login/icon_key.png';
import IconUser from 'images/login/icon_user.png';
import IconEnter from 'images/login/icon_enter.png';

const THEME_MAP = {
    '正常': 'light',
    '亮色': 'light',
    '暗色': 'dark'
};

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 账户
            account: '',
            // 密码
            password: '',
            // 表单错误信息
            err: '',
            //登录按钮交互样式
            formBtn: false
        };

        // 获取用户信息
        this.getUser = this.getUser.bind(this);
        // 处理账号变化
        this.handleAccountChange = this.handleAccountChange.bind(this);
        // 处理密码变化
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        // 清除错误
        this.clearErr = this.clearErr.bind(this);
        // 光标离开
        this.clearBlur = this.clearBlur.bind(this);
        // 登录
        this.login = this.login.bind(this);
        // 回车登录
        this.enterLogin = this.enterLogin.bind(this);
    }
    componentDidMount() {
        $(document.body).addClass('hideOverflow');
        $(document.body).removeClass('btnLoading');
        Utils.handleBigScreenDomHeight();
        EventUtils.bindEvent('keydown', this.enterLogin);
    }
    componentWillUnmount() {
        $(document.body).removeClass('hideOverflow');
        EventUtils.unbindEvent('keydown', this.enterLogin);
    }
    getUser() {
        this.props.getUserByToken({
            success: function(innerRes) {
                User.set(innerRes.body);
                Utils.setTheme(THEME_MAP[innerRes.body.THEME_NAME]);
            }.bind(this)
        });
    }
    handleAccountChange(event) {
        let value = event.target.value;
        this.setState({
            account: value
        });
    }
    handlePasswordChange(event) {
        let value = event.target.value;
        this.setState({
            password: value
        });
    }
    clearErr(event) {
        let $this = !!event ? event.target : '';
        $($this).parent().css('box-shadow', '0 0 2rem #fff inset');
        $($this).prev().css('box-shadow', '0.4rem 0 2rem #fff inset');
        this.setState({
            err: ''
        });
    }
    clearBlur(event) {
        let $this = !!event ? event.target : '';
        $($this).parent().css('box-shadow', '0 0 0 transparent inset');
        $($this).prev().css('box-shadow', '0 0 0 #fff inset');
    }
    login() {
        this.props.router.push({
            pathname: '/homepage'
        });
        let account = this.state.account;
        let pwd = this.state.password;
        if (!account) {
            this.setState({
                err: '账户不能为空'
            });
            return false;
        }
        if (!pwd) {
            this.setState({
                err: '密码不能为空'
            });
            return false;
        }
        this.clearErr();
        this.setState({
            formBtn: true
        }, function() {
            $('.' + style.formBtn1).addClass('btnLoading');
            $('.' + style.formBtn1 + ' img').addClass('none');
            this.props.login({
                data: {
                    USER_NAME: account,
                    PASSWORD: pwd
                },
                success: function(res) {
                    $('.' + style.formBtn1).removeClass('btnLoading');
                    $('.' + style.formBtn1 + ' img').removeClass('none');
                    let body = res.body;
                    let authGroup = {};
                    body.authList.forEach((auth) => {
                        let authKey = Object.keys(auth)[0];
                        let authVal = auth[authKey];
                        authGroup[authKey] = !!authGroup[authKey] ? authGroup[authKey] : [];
                        if (authGroup[authKey].indexOf(authVal) == -1) {
                            authGroup[authKey].push(authVal);
                        }
                    });

                    User.set('token', body.token);
                    User.set('authGroup', authGroup);
                    User.set('currentArea', '');
                    User.set('currentWindsite', '');
                    this.getUser();
                    this.props.router.push({
                        pathname: '/homepage'
                    });
                }.bind(this),
                fail: function() {
                    $('.' + style.formBtn).removeClass('btnLoading');
                    $('.' + style.formBtn + ' img').removeClass('none');
                    Utils.tooltip('账号或密码有误，请稍后重试');
                    return false;
                }.bind(this)
            });
        })
    }
    enterLogin() {
        if (window.event.keyCode == 13) {
            this.login();
        }
    }
    render() {
        return (
            <div className={style.box + ' full'}>
                <img src={BannerImage} className='full' />
                <div className={style.formWrapper}>
                    <div className={style.panel}>
                        <img src={Constant.PROJECT == 'mingyang' ? MyIconLogo : WysengineIconLogo} className={Constant.PROJECT == 'mingyang' ? '' : style.wide} />
                        <span className={style.title + ' tc'}>{Constant.PROJECT_NAME}</span>
                    </div>
                    <div className={!Utils.isEmpty(this.state.err) ? style.err : ''}>{this.state.err}</div>
                    <div className={style.form}>
                        <div className={style.formItem}>
                            <div className={style.formLable}>
                                <img src={IconUser} />
                            </div>
                            <input
                                className={style.formInput}
                                value={this.state.account}
                                onChange={this.handleAccountChange}
                                onFocus={this.clearErr}
                                onBlur={this.clearBlur}
                                placeholder='请输入账号' />
                        </div>
                        <div className={style.formItem}>
                            <div className={style.formLable}>
                                <img src={IconKey} />
                            </div>
                            <input
                                className={style.formInput}
                                type='password'
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                                onBlur={this.clearBlur}
                                onFocus={this.clearErr}
                                placeholder='请输入密码' />
                        </div>
                        <div className={!!this.state.formBtn ? style.formBtn1 : style.formBtn} onClick={this.login}>
                            <span>进入</span>
                            <img src={IconEnter} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        user: state.user.user
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        login: function({ data, before, after, success, fail }) {
            dispatch(actions.login({ data, before, after, success, fail }));
        },
        getUserByToken: function({ data, before, after, success, fail }) {
            dispatch(actions.getUserByToken({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Login);
