let actions = {};

import alarms from './alarms';
import area from './area';
import auth from './auth';
import company from './company';
import departments from './departments';
import health from './health';
import homepage from './homepage';
import kpi from './kpi';
import log from './log';
import login from './login';
import logsetting from './logsetting';
import menu from './menu';
import models from './models';
import modules from './modules';
import parameter from './parameter';
import paramtype from './paramtype';
import productivity from './productivity';
import reports from './reports';
import role from './role';
import turibine from './turibine';
import turibineconfig from './turibineconfig';
import typhoon from './typhoon';
import user from './user';
import windsite from './windsite';
import commonconfig from './commonconfig';

Object.assign(
    actions,
    alarms,
    area,
    auth,
    company,
    departments,
    health,
    homepage,
    kpi,
    log,
    login,
    logsetting,
    menu,
    models,
    modules,
    parameter,
    paramtype,
    productivity,
    reports,
    role,
    turibine,
    turibineconfig,
    typhoon,
    user,
    windsite,
    commonconfig
);

module.exports = actions;
