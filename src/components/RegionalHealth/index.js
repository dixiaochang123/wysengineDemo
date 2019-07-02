 // 区域健康度
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

import Navbar from 'subComponents/Navbar';

import Heaithyfoot from 'subComponents/Heaithyfoot';
import Heaithyfoottwo from 'subComponents/Heaithyfoottwo';
import Heaithyfoottworight from 'subComponents/Heaithyfoottworight';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class TotalHealth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 选中的月份
            time: '',
            // tab1名称
            totalHealthTitle: '总健康度',
            // tab2名称
            areaHealthTitle: '区域健康度',
            // 图1（场所-健康度关系图）标题
            totalHealth: '区域健康度',
            // 图2（场所时间分布图）标题
            areaHealth: '',
            // 图3（场所详细信息图）标题
            subAreaHealth: '风场健康度'
        };

        // 头部区域事件
        this.onAreaOrWindsiteChange = this.onAreaOrWindsiteChange.bind(this);

        // 处理健康度-场所（区域、风场）关系图场所变化
        this.handlePlaceChange = this.handlePlaceChange.bind(this);
        // 处理健康度-月份关系图月份变化
        this.handleMonthChange = this.handleMonthChange.bind(this);
        // 获取公共请求参数
        this.getPostData = this.getPostData.bind(this);

        // 跳转到总健康度页面
        this.goToPage = this.goToPage.bind(this);
    }
    componentWillMount() {
        let postData = this.getPostData();
        postData = Object.assign({}, postData, {
            selectedDate: this.state.time || ''
        });

        this.props.getHealthArea({
            data: postData,
            success: function() {
                $(document.body).removeClass('btnLoading');
            }.bind(this)
        });
        User.set('barClickColor4', {});
        User.set('barClickColor5', {});
        User.set('barClickColor6', {});
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
    }
    onAreaOrWindsiteChange() {
        let area = User.get('currentArea');
        let project = User.get('currentWindsite');

        if (!!area || !!project) {
            this.goToPage();
        }
    }
    handlePlaceChange(data) {
        let targetData = !!data && !!data.data && !!data.data.key ? data.data.key : null;
        let isArea = !!targetData && targetData.code.length == 2;
        let isProject = !!targetData && targetData.code.length == 5;
        let fixData = {};

        if (isArea) {
            fixData = {
                areaCode: targetData.code,
                areaName: targetData.name
            };
        } else if (isProject) {
            fixData = {
                projectCode: targetData.code,
                projectName: targetData.name
            };
        }

        let postData = this.getPostData(fixData);
        this.props.getHealthArea({
            data: postData,
            success: function() {
                this.setState({
                    areaHealth: isArea ? targetData.name + '区域健康度' : targetData.name
                });
            }.bind(this)
        });
    }
    handleMonthChange(data) {
        let time = !!data && !!data.name ? data.name : '';
        this.setState({
            time: time
        });

        let postData = this.getPostData();
        postData = Object.assign({}, postData, {
            selectedDate: time
        });

        this.props.getHealthArea({
            data: postData
        });
    }
    getPostData(data) {
        // 参数区域、风场code
        let dataAreaCode = !!data ? data.areaCode : '';
        let dataAreaName = !!data ? data.areaName : '';
        let dataProjectCode = !!data ? data.projectCode : '';
        let dataProjectName = !!data ? data.projectName : '';

        // 跳转参数区域、风场code
        let paramsData = this.props.location.state;
        let paramsAreaCode = !!paramsData ? paramsData.areaCode : '';
        let paramsAreaName = !!paramsData ? paramsData.areaName : '';
        let paramsProjectCode = !!paramsData ? paramsData.projectCode : '';
        let paramsProjectName = !!paramsData ? paramsData.projectName : '';
        let paramsTotalHealthTitle = !!paramsData ? paramsData.totalHealthTitle : '';
        let paramsAreaHealthTitle = !!paramsData ? paramsData.areaHealthTitle : '';

        // User信息中区域、风场code
        let area = User.get('currentArea');
        let project = User.get('currentWindsite');
        let userAreaCode = !!area ? area.CODE : '';
        let userAreaName = !!area ? area.NAME : '';
        let userProjectCode = !!project ? project.CODE_ : '';
        let userProjectName = !!project ? project.NAME_ : '';

        // 区域code
        let areaCode = dataAreaCode || paramsAreaCode || userAreaCode;
        // 区域name
        let areaName = dataAreaName || paramsAreaName || userAreaName;
        // 风场code
        let projectCode = dataProjectCode || paramsProjectCode || userProjectCode;
        // 风场name
        let projectName = dataProjectName || paramsProjectName || userProjectName;

        // 请求参数区域code
        let postAreaCode = '';
        // 请求参数风场code
        let postProjectCode = '';
        // 请求参数选中场所（区域 or 风场）code
        let postSelectedCode = '';

        if (!!areaCode && !!projectCode) {
            postAreaCode = areaCode;
            postProjectCode = '';
            postSelectedCode = projectCode;
            this.setState({
                totalHealthTitle: paramsTotalHealthTitle || areaName + '区域健康度',
                areaHealthTitle: paramsAreaHealthTitle || '风场健康度',
                totalHealth: areaName + '区域健康度',
                areaHealth: !!project ? '' : projectName,
                subAreaHealth: '风机健康度'
            });
        } else if (!!areaCode) {
            postAreaCode = '';
            postProjectCode = '';
            postSelectedCode = areaCode;
            this.setState({
                totalHealthTitle: paramsTotalHealthTitle || areaName + '区域健康度',
                areaHealthTitle:  paramsAreaHealthTitle || '风场健康度',
                totalHealth: '区域健康度',
                areaHealth: areaName + '区域健康度',
                subAreaHealth: '风场健康度'
            });
        }

        let postData = {
            AREA: postAreaCode,
            PROJECT: postProjectCode,
            selectedArea: postSelectedCode,
            selectedDate: ''
        };

        return postData;
    }
    goToPage() {
        this.props.router.push({
            pathname: '/totalhealth'
        });
    }
    render() {
        let healthArea = this.props.healthArea || {};

        // 区域健康度
        let areaRate = !!healthArea ? healthArea.areaRate : [];
        let areaNames = !!areaRate ? areaRate.map((key) => key.name) : [];
        let areaHealth = !!areaNames[0] && areaNames[0].length > 3 ? areaNames[0] : areaNames[0] + '区域健康度';

        // 区域健康度-时间图
        let monthRateMap = !!healthArea ? healthArea.monthRateMap : [];
        // 风场健康度
        let projectHealthRate = !!healthArea ? healthArea.projectHealthRate : [];
        let keys = !!areaRate ? Object.keys(areaRate) : [];
        let healthDetail = {};
        keys.map((key, index) => {
            healthDetail[key] = {
                value: !!areaRate[index] ? areaRate[index].HEALTH : 0,
                code: !!areaRate[index] ? areaRate[index].code : 0,
                name: !!areaRate[index] ? areaRate[index].name : 0
            };
        });

        let keys2 = !!monthRateMap ? Object.keys(monthRateMap).reverse() : [];
        let healthDetail2 = {};
        keys2.map((key) => {
            healthDetail2[key] = {
                value: !!monthRateMap[key] ? monthRateMap[key] : 0
            };
        });

        let keys3 = !!projectHealthRate ? Object.keys(projectHealthRate) : [];
        let healthDetail3 = {};
        keys3.map((key, index) => {
            healthDetail3[index] = {
                value: !!projectHealthRate[index] ? projectHealthRate[index].HEALTH : 0,
                name: !!projectHealthRate[index] ? projectHealthRate[index].name : 0
            };
        });

        return (
            <div className={style.box}>
                <Navbar
                    props={this.props}
                    showAreaIcon={true}
                    onAreaOrWindsiteChange={this.onAreaOrWindsiteChange} />
                <div className='boxInner'>
                    <div className={style.boxInner}>
                        <div className={style.subTitle}>
                            <a href='javascript:;' onClick={this.goToPage}>{this.state.totalHealthTitle}</a>
                            <a href='javascript:;'>{this.state.areaHealthTitle}</a>
                        </div>
                        <div className={style.parentLeftSpan + ' panel'} data-aspect-ratio='0.1607'>
                            <div className='panelHeader'>
                                <span className='panelTitle'>{this.state.totalHealth}</span>
                            </div>
                            {Utils.isEmpty(healthDetail) ?
                            <div className='dataEmpty'></div> :
                            <Heaithyfoot
                                name={'健康度'}
                                color={'#8dcd43'}
                                tooltipName={'健康度'}
                                healthDetail={healthDetail}
                                onHealthChange={this.handlePlaceChange} />}
                        </div>
                        <div className={style.flex} data-aspect-ratio='0.1607'>
                            <div className={style.leftChart + ' panel'}>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>{this.state.areaHealth || areaHealth}</span>
                                </div>
                                {Utils.isEmpty(healthDetail2) ?
                                <div className='dataEmpty'></div> :
                                <Heaithyfoottwo
                                    name={'健康度'}
                                    tooltipName={'健康度'}
                                    healthDetail={healthDetail2}
                                    onHealthChange={this.handleMonthChange} />}
                            </div>
                            <div className={style.rightChart + ' panel'}>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>{this.state.subAreaHealth}</span>
                                </div>
                                {Utils.isEmpty(healthDetail3) ?
                                <div className='dataEmpty'></div> :
                                <Heaithyfoottworight
                                    name={'健康度'}
                                    tooltipName={'健康度'}
                                    healthDetail={healthDetail3} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        healthArea:state.health.healthArea || {}
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getHealthArea: function({ data, before, after, success, fail }) {
            dispatch(actions.getHealthArea({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TotalHealth);
