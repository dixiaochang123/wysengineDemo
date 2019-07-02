import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';
import Constant from 'constant/index';

// mingyang logo
import MyIconLogo from 'images/homepage/logo.png';
// wysengine logo
import WysengineIconLogo from 'images/homepage/logoWysengine.png';

import IconLocation from 'images/homepage/icon_location.png';
import IconMenu from 'images/homepage/icon_menu.png';
import IconAdmin from 'images/homepage/icon_admin.png';
import IconDaiban from 'images/backlog/icon_daiban.png';
import IconBack from 'images/common/icon_back.png';
import IconBackWhite from 'images/common/icon_back_white.png';
import IconLogout from 'images/common/tc.png';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

const PATH_MAP = {
    '/areaalarm': '区域预警',
    '/companymanagement': '公司管理',
    '/departmentmanagement': '部门管理',
    '/homepage': '',
    '/kpistatistics': 'KPI统计分析',
    '/logmanagement': '日志管理',
    '/logsetting': '日志配置管理',
    '/menus': '菜单管理',
    '/modeldetail': '模型明细',
    '/models': '模型管理',
    '/modules': '模块管理',
    '/parameterconfigurationmanagement': '参数类型管理',
    '/parametermanagement': '参数管理',
    '/personinfo': '个人信息',
    '/privilegemanagement': '权限管理',
    '/productivity': '生产率',
    '/regionalendrate': '区域完结率',
    '/regionalhealth': '区域健康度',
    '/reportmanagement': '报告管理',
    '/reportmanagementmonthly': '报告管理',
    '/reportmanagementyear': '报告管理',
    '/rolemanagement': '角色管理',
    '/todayfanalarm': '今日风机预警信息明细',
    '/totalcompletionrate': '总完结率',
    '/totalhealth': '总健康度',
    '/usermanagement': '用户管理',
    '/warninginfordetails': '预警详情',
    '/warningstatistics': '预警统计分析',
    '/workbench': '工作台',
    '/universaltable': '通用点表',
    '/modelbackmanagement': '模型后台管理',
    '/backlog': '待办事项',
    '/executeLog': '执行工单'
};

const PATH_CODE_MAP = {
    'auth': '/privilegemanagement',
    'company': '/companymanagement',
    'department': '/departmentmanagement',
    'home': '/homepage',
    'log': '/logmanagement',
    'logSetting': '/logsetting',
    'menu': '/menus',
    'model': '/models',
    'module': '/modules',
    'param': '/parametermanagement',
    'paramType': '/parameterconfigurationmanagement',
    'report': '/reportmanagement',
    'role': '/rolemanagement',
    'statistics': '/warningstatistics',
    'user': '/usermanagement',
    'workbench': '/workbench',
    'turbineConfig': '/universaltable',
    'modelBackground': '/modelbackmanagement'
};

const MAIN_MODULES = [
    '首页',
    '工作平台',
    '统计分析',
    '报告管理',
    '模型管理'
];

class Navbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 展示区域选择框
            showAreas: false,
            // 展示模块选择框
            showModules: false,
            // 子区域（风场）列表
            subAreas: [],
            // 正在加载数据
            isLoading: false
        };

        // 显示、隐藏区域选择框
        this.toggleAreas = this.toggleAreas.bind(this);
        // 正在拉取区域数据
        this.isLoading = this.isLoading.bind(this);
        // 显示、隐藏区域选择框
        this.toggleModules = this.toggleModules.bind(this);
        // 选择区域
        this.selectArea = this.selectArea.bind(this);
        // 选择子区域（风场）
        this.selectSubArea = this.selectSubArea.bind(this);
        // 获取区域风场
        this.getAreaProject = this.getAreaProject.bind(this);
        // 跳转到其他页面
        this.goToModule = this.goToModule.bind(this);
        // 关闭弹窗
        this.close = this.close.bind(this);
        // 登出
        this.logout = this.logout.bind(this);
        // 返回上一页
        this.goBack = this.goBack.bind(this);
    }
    componentWillMount() {
        // 获取区域列表
        Utils.isEmpty(this.props.areaList) && this.props.getAreaList({
            success: function() {
                let userArea = User.get('AREA');
                let userProject = User.get('PROJECTS');
                if (!!userProject) {
                    let area = this.props.areaList[0];
                    User.set('currentArea', area);
                    this.getAreaProject(area, userProject);
                }
                if (!!userArea) {
                    let area = this.props.areaList.find((item) => item.CODE == userArea);
                    User.set('currentArea', area);
                    this.getAreaProject(area);
                }
            }.bind(this)
        });
        // 获取用户菜单列表
        Utils.isEmpty(this.props.userMenuList) && this.props.getUserMenuList({});
    }
    toggleAreas() {
        let isLoading = this.isLoading();
        if (this.state.showModules || isLoading) {
            return false;
        }
        let area = User.get('currentArea');
        let showAreas = this.state.showAreas;
        this.setState({
            showAreas: !showAreas
        }, function() {
            if (!!area) {
                this.getAreaProject(area);
            }
        }.bind(this));
    }
    isLoading() {
        let isLoading = this.state.isLoading;
        if (isLoading) {
            Utils.tooltip('数据请求中...');
        }
        return isLoading;
    }
    selectArea(area) {
        let currentArea = User.get('currentArea') || {};
        if (!Utils.isEmpty(currentArea) && area.ID == currentArea.ID) {
            User.set('currentArea', '');
            User.set('currentWindsite', '');
            this.props.onAreaOrWindsiteChange && this.props.onAreaOrWindsiteChange();
            return false;
        }

        User.set('currentArea', area);
        User.set('currentWindsite', '');
        this.setState({
            isLoading: true
        });
        this.getAreaProject(area);
        this.props.onAreaOrWindsiteChange && this.props.onAreaOrWindsiteChange();
    }
    selectSubArea(subArea) {
        let currentWindsite = User.get('currentWindsite') || {};
        if (!Utils.isEmpty(currentWindsite) && subArea.CODE_ == currentWindsite.CODE_) {
            this.toggleAreas(true);
            User.set('currentWindsite', '');
            this.props.onAreaOrWindsiteChange && this.props.onAreaOrWindsiteChange();
            return false;
        }

        User.set('currentWindsite', subArea);
        this.props.onAreaOrWindsiteChange && this.props.onAreaOrWindsiteChange();
    }
    getAreaProject(area, projectCode) {
        this.props.getOnlineProjectListByArea({
            data: {
                AREA: !!area && !!area.CODE ? area.CODE : ''
            },
            success: function(res) {
                let isResEmpty = Utils.isEmpty(res.body);
                // if (isResEmpty && !!area && !!area.NAME) {
                //     Utils.tooltip(area.NAME + '区域暂无风场');
                // } else {
                //     Utils.tooltip('区域暂无风场');
                // }
                this.setState({
                    isLoading: false,
                    subAreas: res.body || []
                }, function() {
                    if (projectCode) {
                        let targetProject = this.state.subAreas.find((item) => item.CODE_ == projectCode);
                        this.selectSubArea(targetProject);
                        User.set('currentWindsite', targetProject);
                    }
                }.bind(this));
            }.bind(this)
        });
    }
    toggleModules() {
        if (this.state.showAreas) {
            return false;
        }
        let showModules = this.state.showModules;
        this.setState({
            showModules: !showModules
        });
    }
    goToModule(path) {
        this.setState({
            showModules: false
        }, function() {
            $('body').css({
                'overflow-x': 'hidden',
                'overflow-y': 'auto'
            });

            let currPath = window.location.hash.match(/\/[\S]+\?/)[0].slice(0, -1);
            if (path == currPath) {
                return false;
            }
            this.props.props.router.push({
                pathname: path
            });
        }.bind(this));
    }
    close() {
        this.setState({
            showAreas: false,
            showModules: false
        });
        $('body').css({
            'overflow-x': 'hidden',
            'overflow-y': 'auto'
        });
    }
    logout() {
        this.props.logout({
            success: function() {
                User.clear();
                this.props.props.router.push({
                    pathname: '/login'
                });
            }.bind(this)
        });
    }
    goBack() {
        this.props.props.history.goBack();
    }
    render() {
        let areaList = this.props.areaList || [];
        let currentArea = User.get('currentArea') || '';
        let currentWindsite = User.get('currentWindsite');

        let subAreas = this.state.subAreas.length > 0 ? this.state.subAreas.map(function(subArea, index) {
            let subAreaStyle = style.area;
            if (subArea.CODE_ == currentWindsite.CODE_) {
                subAreaStyle += (' ' + style.active);
            }
            return (
                <div key={subArea + '_' + index} className={subAreaStyle} onClick={this.selectSubArea.bind(this, subArea)}>{subArea.NAME_}</div>
            );
        }.bind(this)) : null;

        let areas = areaList.length > 0 ? areaList.map(function(area, index) {
            let areaStyle = style.area;
            let subAreaNodes = null;
            if (area.ID == currentArea.ID) {
                areaStyle += (' ' + style.active);
                subAreaNodes = (
                    <div className={style.subAreas}>
                        {subAreas}
                    </div>
                );
            }
            return (
                <div key={area.NAME + '_' + index} className={areaStyle}>
                    <div className='full' onClick={this.selectArea.bind(this, area)}>{area.NAME}</div>
                    {subAreaNodes}
                </div>
            );
        }.bind(this)) : null;

        let userMenuList = this.props.userMenuList || [];
        let mainModules = userMenuList.filter((menu) => MAIN_MODULES.indexOf(menu.NAME) != -1);
        let otherModules = userMenuList.filter((menu) => MAIN_MODULES.indexOf(menu.NAME) == -1);
        let moduleName = this.props.props.location.pathname;

        let mainModuleNodes = mainModules.map(function(module, index) {
            let mainModuleStyle = style.module + ' tc';
            if (PATH_CODE_MAP[module.MODULE_NAME] == moduleName) {
                mainModuleStyle += (' ' + style.active);
            }
            return (
                <span key={module.NAME + '_' + index} className={mainModuleStyle} onClick={this.goToModule.bind(this, PATH_CODE_MAP[module.CODE])}>{module.NAME}</span>
            );
        }.bind(this));

        let otherModuleNodes = otherModules.map(function(module, index) {
            let otherModuleStyle = style.module + ' tc';
            if (PATH_CODE_MAP[module.MODULE_NAME] == moduleName) {
                otherModuleStyle += (' ' + style.active);
            }
            return (
                <span key={module.NAME + '_' + index} className={otherModuleStyle} onClick={this.goToModule.bind(this, PATH_CODE_MAP[module.CODE])}>{module.NAME}</span>
            );
        }.bind(this));

        let hashAry = window.location.hash.match(/\/[a-zA-Z]+/);
        let pathname = !Utils.isEmpty(hashAry) && hashAry.length > 0 ? hashAry[0] : '';
        let inHomepage = pathname === '/homepage';
        let subLink = <span className={style.pathLink}>{PATH_MAP[pathname]}</span>;

        let user = User.get();
        let areaName = !!currentWindsite ? currentWindsite.NAME_ : (!!currentArea ? currentArea.NAME : '区域');

        let showAreas = this.state.showAreas;
        let showModules = this.state.showModules;

        return (
            <div className={style.box + ' clearfix'}>
                <div className='left'>
                    <img src={Constant.PROJECT == 'mingyang' ? MyIconLogo : WysengineIconLogo} className={Constant.PROJECT == 'wysengine' ? style.logo + ' ' + style.wide : style.logo} onClick={this.goToModule.bind(this, '/homepage')} />
                    <span className={style.title}>{Constant.PROJECT_NAME}</span>
                </div>
                <div className='right clearfix'>
                    <div className={'right ' + style.menus}>
                        <div className={style.menuItem } onClick={this.goToModule.bind(this, '/backlog')}>
                            <img className={style.daibanIcon} src={IconDaiban} />
                            待办
                        </div>
                        {this.props.showAreaIcon ?
                        <div className={style.menuItem}>
                            <div className='full' onClick={this.toggleAreas}>
                                <img src={IconLocation} />
                                {areaName}
                            </div>
                            <div className={showAreas ? style.subMenusOverlay : 'none'} onClick={this.toggleAreas}></div>
                            <div className={showAreas ? style.subMenus : 'none'}>
                                {areas}
                            </div>
                        </div> : null}
                        <div className={style.menuItem}>
                            <div className='full' onClick={this.toggleModules}>
                                <img src={IconMenu} />
                                更多管理
                            </div>
                            <div className={showModules ? style.subMenusOverlay : 'none'} onClick={this.toggleModules}></div>
                            <div className={showModules ? style.subModules : 'none'}>
                                <div className={style.subModuleRow}>
                                    {mainModuleNodes}
                                </div>
                                <div className={style.subModuleRow}>
                                    {otherModuleNodes}
                                </div>
                            </div>
                        </div>
                        <div className={style.menuItem} onClick={this.goToModule.bind(this, '/personinfo')}>
                            <img src={IconAdmin} />
                            {user.USER_NAME}
                        </div>
                        <div className={style.menuItem + ' ' + style.menuLogout}>
                            <div className='full' onClick={this.logout}>
                                <img src={IconLogout} />
                                退出
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.paths}>
                    <div className={style.pathsInner}>
                        <a href='javascript:;' className={style.pathLink + ' ' + style.back} onClick={this.goBack}>
                            <img src={theme == 'light' ? IconBackWhite : IconBack} />
                            <span>返回上一页</span>
                        </a>
                        <a href='javascript:;' className={style.pathLink} onClick={this.goToModule.bind(this, '/homepage')}>首页</a>
                        <span className={inHomepage ? 'none' : style.pathLinkSep}></span>
                        {subLink}
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        areaList: state.area.areaList || [],
        userMenuList: state.menu.userMenuList || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        logout: function({ data, before, after, success, fail}) {
            dispatch(actions.logout({ data, before, after, success, fail}));
        },
        getAreaList: function({ data, before, after, success, fail }) {
            dispatch(actions.getAreaList({ data, before, after, success, fail }));
        },
        getUserMenuList: function({ data, before, after, success, fail }) {
            dispatch(actions.getUserMenuList({ data, before, after, success, fail }));
        },
        getOnlineProjectListByArea: function({ data, before, after, success, fail }) {
            dispatch(actions.getOnlineProjectListByArea({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Navbar);
