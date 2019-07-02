import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

import Modal from 'subComponents/Modal';
import PersonInfoModify from 'subComponents/PersonInfoModify';

import IconKey from 'images/common/icon_key.png';
import IconKeyDark from 'images/common/icon_key_dark.png';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

const INFOS = [{
    name: '姓名',
    key: 'name'
}, {
    name: '状态',
    key: 'status'
}, {
    name: '性别',
    key: 'gender'
}, {
    name: '工号',
    key: 'code'
}, {
    name: '邮箱',
    key: 'email'
}, {
    name: '手机号码',
    key: 'tel'
}, {
    name: '区域',
    key: 'area'
}, {
    name: '公司',
    key: 'company'
}, {
    name: '部门',
    key: 'dep'
}, {
    name: '地址',
    key: 'address'
}, {
    name: '等级',
    key: 'level'
}, {
    name: '角色',
    key: 'role'
}, {
    name: '用户类型',
    key: 'type'
}];

class PersonInfoBasic extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            themes: [],
            selectedTheme: {},
            userInfo: {
                name: '',
                code: '',
                status: '',
                gender: '',
                email: '',
                tel: '',
                address: '',
                level: '',
                type: '',
                area: '',
                dep: '',
                role: '',
                theme: ''
            }
        };

        // 初始化
        this.initData = this.initData.bind(this);
        // 展示弹框
        this.showModal = this.showModal.bind(this);
        // 关闭弹框
        this.closeModal = this.closeModal.bind(this);
        // 切换主题
        this.switchTheme = this.switchTheme.bind(this);
    }
    componentWillMount() {
        this.initData();
        this.props.getParameterByTypeCode({
            data: {
                CODE: 'theme'
            },
            success: function(res) {
                let user = User.get();
                let selectedTheme = res.body.filter(function(item) {
                    return item.NAME == user.THEME_NAME;
                })[0] || {
                    ID: 9,
                    NAME: '亮色'
                };
                this.setState({
                    themes: res.body,
                    selectedTheme: selectedTheme
                });
            }.bind(this)
        });
    }
    initData() {
        let user = User.get();
        let userInfo = this.state.userInfo;

        userInfo.name = user.NAME;
        userInfo.code = user.USER_NAME;
        userInfo.status = user.STATUS_NAME;
        userInfo.gender = user.GENDER_NAME;
        userInfo.email = user.EMAIL;
        userInfo.tel = user.PHONE;
        userInfo.address = user.ADDRESS;
        userInfo.level = user.LEVEL_NAME;
        userInfo.type = user.USER_TYPE_NAME;
        userInfo.area = user.AREA_NAME;
        userInfo.dep = user.DEPARTMENT_NAME;
        userInfo.role = user.ROLE_NAME;
        userInfo.theme = user.THEME_NAME;

        this.setState({
            userInfo: userInfo
        });
    }
    showModal() {
        this.setState({
            showModal: true
        });
    }
    closeModal() {
        this.setState({
            showModal: false
        });
    }
    switchTheme(themeCode) {
        let user = User.get();
        let selectedTheme = this.state.themes.filter(function(item) {
            return item.CODE == themeCode;
        })[0] || {
            ID: 9,
            NAME: '亮色'
        };
        if (selectedTheme.ID == this.state.selectedTheme.ID) {
            return false;
        }

        let postData = {
            ID: user.ID,
            THEME: selectedTheme.ID
        };
        this.props.modifyTheme({
            data: postData,
            success: function() {
                User.set('THEME', selectedTheme.ID);
                User.set('THEME_NAME', selectedTheme.NAME);
                Utils.setTheme(themeCode);
            }.bind(this)
        });
    }
    render() {
        let userInfo = this.state.userInfo;
        let selectedTheme = this.state.selectedTheme || {};

        let panelInfos = [];
        INFOS.forEach(function(info, index) {
            let infoStyle = {
                width: (100 / INFOS.length).toFixed(1) + '%'
            };
            panelInfos.push(
                <div key={'personInfo' + index} className={style.info} style={infoStyle}>
                    <div className={style.label}>{info.name}</div>
                    <div className={style.val}>{userInfo[info.key]}</div>
                </div>
            );
        });

        let tabs = this.state.themes.map(function(theme) {
            return (
                <div key={'theme' + theme.ID} className={selectedTheme.ID == theme.ID ? style.tab + ' ' + style.active : style.tab} onClick={this.switchTheme.bind(this, theme.CODE)}>{theme.NAME}</div>
            );
        }.bind(this));

        return (
            <div className={style.box}>
                <div className={style.tabs + ' clearfix'}>
                    {tabs}
                </div>
                <div className={style.infos}>
                    {panelInfos}
                </div>
                <div className={style.btnWrapper} onClick={this.showModal}>
                    <img src={theme === 'dark' ? IconKeyDark : IconKey} />
                    <span>修改密码</span>
                </div>
                <Modal
                    isOpen={this.state.showModal}
                    onClose={this.closeModal}>
                    <div className='modalForm'>
                        <PersonInfoModify
                            onClose={this.closeModal} />
                    </div>
                </Modal>
            </div>
        );
    }
}

let mapStateToProps = function() {
    return {};
};

let mapDispatchToProps = function(dispatch) {
    return {
        modifyTheme: function({ data, before, after, success, fail }) {
            dispatch(actions.modifyTheme({ data, before, after, success, fail }));
        },
        getParameterByTypeCode: function({ data, before, after, success, fail }) {
            dispatch(actions.getParameterByTypeCode({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PersonInfoBasic);
