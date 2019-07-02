require('normalize.css/normalize.css');
require('purecss/build/pure-min.css');
require('rc-dropdown/assets/index.css');
require('rc-pagination/assets/index.css');
require('styles/font-size.css');

/* common */
require('styles/common/base.css');
require('styles/common/button.css');
require('styles/common/common.css');
require('styles/common/data-empty.css');
require('styles/common/gradient.css');
require('styles/common/link-btn.css');
require('styles/common/menu.css');
require('styles/common/modal.css');
require('styles/common/panel.css');
require('styles/common/tooltip.css');

/* override */
require('styles/override/purecss.css');
require('styles/override/rc-dropdown.css');
require('styles/override/rc-pagination.css');
require('styles/override/rc-tooltip.css');
require('styles/override/react-modal.css');

import React from 'react';
const ReactRouter = require('react-router');
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const withRouter = ReactRouter.withRouter;
const IndexRedirect = ReactRouter.IndexRedirect;
const hashHistory = ReactRouter.hashHistory;

import User from 'utils/user';

let App = withRouter(require('react-router!components/App/index'));
let AreaAlarm = withRouter(require('react-router!components/AreaAlarm/index'));
let DepartmentManagement = withRouter(require('react-router!components/DepartmentManagement/index'));
let CompanyManagement = withRouter(require('react-router!components/CompanyManagement/index'));
let Homepage = withRouter(require('react-router!components/Homepage/index'));
let KPIStatistics = withRouter(require('react-router!components/KPIStatistics/index'));
let Login = withRouter(require('react-router!components/Login/index'));
let LogSetting = withRouter(require('react-router!components/LogSetting/index'));
let Menus = withRouter(require('react-router!components/Menus/index'));
let ModelDetail = withRouter(require('react-router!components/ModelDetail/index'));
let Models = withRouter(require('react-router!components/Models/index'));
let Modules = withRouter(require('react-router!components/Modules/index'));
let Productivity = withRouter(require('react-router!components/Productivity/index'));
let RegionalEndRate = withRouter(require('react-router!components/RegionalEndRate/index'));
let RegionalHealth = withRouter(require('react-router!components/RegionalHealth/index'));
let ReportManagement = withRouter(require('react-router!components/ReportManagement/index'));
let ReportManagementMonthly = withRouter(require('react-router!components/ReportManagementMonthly/index'));
let ReportManagementYear = withRouter(require('react-router!components/ReportManagementYear/index'));
let RoleManagement = withRouter(require('react-router!components/RoleManagement/index'));
let TodayFanAlarm = withRouter(require('react-router!components/TodayFanAlarm/index'));
let TotalCompletionRate = withRouter(require('react-router!components/TotalCompletionRate/index'));
let TotalHealth = withRouter(require('react-router!components/TotalHealth/index'));
let UserManagement = withRouter(require('react-router!components/UserManagement/index'));
let WarningInforDetails = withRouter(require('react-router!components/WarningInforDetails/index'));
let WarningStatistics = withRouter(require('react-router!components/WarningStatistics/index'));
let Workbench = withRouter(require('react-router!components/Workbench/index'));
let PersonInfo = withRouter(require('react-router!components/PersonInfo/index'));
let PrivilegeManagement = withRouter(require('react-router!components/PrivilegeManagement/index'));
let LogManagement = withRouter(require('react-router!components/LogManagement/index'));//日志管理
let ParameterManagement = withRouter(require('react-router!components/ParameterManagement/index'));//参数管理
let ParameterConfigurationManagement = withRouter(require('react-router!components/ParameterConfigurationManagement/index'));//参数管理
let UniversalTable = withRouter(require('react-router!components/UniversalTable/index'));//通用点表
let ModelBackManagement = withRouter(require('react-router!components/ModelBackManagement/index'));//模型后台管理
let UI = withRouter(require('react-router!components/UI/index'));

let Backlog = withRouter(require('react-router!components/Backlog/index'));//待办事项
let ExecuteLog = withRouter(require('react-router!components/ExecuteLog/index'));//执行工单

function enterRoute(nextState, replace, callback) {
    $(document.body).addClass('btnLoading');
    let userInfo = User.get();
    if (!userInfo.token) {
        // window.location.href = window.location.origin + window.location.pathname + '#/login';
    }
    // let prevRoutes = !!User.get('prevRoutes') ? User.get('prevRoutes') : [];
    // if (prevRoutes.length < 4) {
    //     prevRoutes.push(nextState);
    // } else {
    //     prevRoutes.shift();
    //     prevRoutes.push(nextState);
    // }
    // User.set('prevRoutes', prevRoutes);
    callback();
}

let router = (
    <Router history={hashHistory}>
        <Route path='/' component={App}>
            <IndexRedirect to='login' />
            <Route path='areaalarm' component={AreaAlarm} onEnter={enterRoute} />
            <Route path='departmentmanagement' component={DepartmentManagement} onEnter={enterRoute} />
            <Route path='companymanagement' component={CompanyManagement} onEnter={enterRoute} />
            <Route path='homepage' component={Homepage} onEnter={enterRoute} />
            <Route path='kpistatistics' component={KPIStatistics} onEnter={enterRoute} />
            <Route path='login' component={Login} onEnter={enterRoute} />
            <Route path='logsetting' component={LogSetting} onEnter={enterRoute} />
            <Route path='menus' component={Menus} onEnter={enterRoute} />
            <Route path='modeldetail' component={ModelDetail} onEnter={enterRoute} />
            <Route path='models' component={Models} onEnter={enterRoute} />
            <Route path='modules' component={Modules} onEnter={enterRoute} />
            <Route path='productivity' component={Productivity} onEnter={enterRoute} />
            <Route path='regionalendrate' component={RegionalEndRate} onEnter={enterRoute} />
            <Route path='regionalhealth' component={RegionalHealth} onEnter={enterRoute} />
            <Route path='reportmanagement' component={ReportManagement} onEnter={enterRoute} />
            <Route path='reportmanagementmonthly' component={ReportManagementMonthly} onEnter={enterRoute} />
            <Route path='reportmanagementyear' component={ReportManagementYear} onEnter={enterRoute} />
            <Route path='rolemanagement' component={RoleManagement} onEnter={enterRoute} />
            <Route path='todayfanalarm' component={TodayFanAlarm} onEnter={enterRoute} />
            <Route path='totalcompletionrate' component={TotalCompletionRate} onEnter={enterRoute} />
            <Route path='totalhealth' component={TotalHealth} onEnter={enterRoute} />
            <Route path='usermanagement' component={UserManagement} onEnter={enterRoute} />
            <Route path='warninginfordetails' component={WarningInforDetails} onEnter={enterRoute} />
            <Route path='warningstatistics' component={WarningStatistics} onEnter={enterRoute} />
            <Route path='workbench' component={Workbench} onEnter={enterRoute} />
            <Route path='personinfo' component={PersonInfo} onEnter={enterRoute} />
            <Route path='privilegemanagement' component={PrivilegeManagement} onEnter={enterRoute} />
            <Route path='logmanagement' component={LogManagement} onEnter={enterRoute} />
            <Route path='parametermanagement' component={ParameterManagement} onEnter={enterRoute} />
            <Route path='parameterconfigurationmanagement' component={ParameterConfigurationManagement} onEnter={enterRoute} />
            <Route path='universaltable' component={UniversalTable} onEnter={enterRoute} />
            <Route path='modelbackmanagement' component={ModelBackManagement} onEnter={enterRoute} />
            <Route path='ui' component={UI} />
            <Route path='backlog' component={Backlog} onEnter={enterRoute} />//待办事项
            <Route path='executelog' component={ExecuteLog} onEnter={enterRoute} />//执行工单
        </Route>
    </Router>
);

module.exports = router;
