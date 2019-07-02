// 总健康度
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

import Navbar from 'subComponents/Navbar';
import Healthyheid from 'subComponents/Healthyheid';
import Heaithyfoot from 'subComponents/Heaithyfoot';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class TotalHealth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // tab1名称
            totalHealthTitle: '总健康度',
            // tab2名称
            areaHealthTitle: '区域健康度',
            // 健康度-时间分布图标题
            totalHealth: '总健康度',
            // 健康度-场所分布图标题
            areaHealth: '区域健康度'
        };

        // 头部区域事件
        this.onAreaOrWindsiteChange = this.onAreaOrWindsiteChange.bind(this);

        // 跳转到总健康
        this.goToPage = this.goToPage.bind(this);

        // 处理月份变化
        this.handleMonthChange = this.handleMonthChange.bind(this);
        // 处理场所（区域、风场）变化
        this.handlePlaceChange = this.handlePlaceChange.bind(this);
        // 获取健康度数据
        this.getHealthTotal = this.getHealthTotal.bind(this);
    }
    componentWillMount() {
        this.onAreaOrWindsiteChange();
        User.set('barClickColor4', {});
        User.set('barClickColor5', {});
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
    }
    onAreaOrWindsiteChange() {
        let area = User.get('currentArea');
        let project = User.get('currentWindsite');

        if (!!project) {
            this.setState({
                totalHealthTitle: '风场健康度',
                areaHealthTitle: '风机健康度',
                totalHealth: project.NAME_ || '',
                areaHealth: '风机健康度'
            });
        } else if (!!area) {
            this.setState({
                totalHealthTitle: area.NAME + '区域健康度',
                areaHealthTitle: '风场健康度',
                totalHealth: area.NAME + '区域健康度',
                areaHealth: '风场健康度'
            });
        } else {
            this.setState({
                totalHealthTitle: '总健康度',
                areaHealthTitle: '区域健康度',
                totalHealth: '总健康度',
                areaHealth: '区域健康度'
            });
        }

        this.getHealthTotal();
    }
    handleMonthChange(data) {
        this.getHealthTotal({
            MONTH: !!data ? data.name : ''
        });
    }
    handlePlaceChange(data) {
        let codeLen = data.data.key.code.length;
        let isArea = codeLen == 2;
        let isProject = codeLen == 5;
        // 未选区域 && 查看区域
        if (isArea) {
            this.goToPage({
                areaCode: data.data.key.code,
                areaName: data.data.key.name
            });
        }
        // 选择区域 && 未选风场 && 查看风场
        if (isProject) {
            this.goToPage({
                projectCode: data.data.key.code,
                projectName: data.data.key.name
            });
        }
    }
    getHealthTotal(data) {
        let area = User.get('currentArea');
        let project = User.get('currentWindsite');
        let postData = {
            AREA: !!area ? area.CODE : '',
            PROJECT: !!project ? project.CODE_ : '',
            MONTH: ''
        };
        if (!!data) {
            postData = Object.assign({}, postData, data);
        }
        this.props.getHealthTotal({
            data: postData,
            success: function() {
                $(document.body).removeClass('btnLoading');
            }.bind(this)
        });
    }
    goToPage(data) {
        let area = User.get('currentArea');
        let project = User.get('currentWindsite');
        let postState = {
            totalHealthTitle: this.state.totalHealthTitle,
            areaHealthTitle: this.state.areaHealthTitle,
            areaCode: !!area ? area.CODE : '',
            areaName: !!area ? area.NAME : '',
            projectCode: !!project ? project.CODE_ : '',
            projectName: !!project ? project.NAME_ : ''
        };

        if (!!data) {
            postState = Object.assign({}, postState, data);
        }

        this.props.router.push({
            pathname: '/regionalhealth',
            state: postState
        });
    }
    render() {
        let healthTotal = this.props.healthTotal || {};
        let monthRate = !!healthTotal ? healthTotal.monthRate : [];
        let keys = !!monthRate ? Object.keys(monthRate) : [];
        let healthDetail = {};
        keys.map((key) => {
            healthDetail[key] = {
                time: !!monthRate[key] ? monthRate[key].CALC_MONTH : 0,
                tbRate: !!monthRate[key] ? monthRate[key].HEALTH : 0
            };
        });

        let areaRate = !!healthTotal ? healthTotal.areaRate : [];
        let healthDetailArea = {};
        if (areaRate) {
            areaRate.map((key, index) => {
                healthDetailArea[index] = {
                    code: !!areaRate[index] ? areaRate[index].code : 0,
                    name: !!areaRate[index] ? areaRate[index].name : 0,
                    value: !!areaRate[index] ? areaRate[index].HEALTH : 0
                };
            });
        }

        return (
            <div className={style.box}>
                <Navbar
                    props={this.props}
                    showAreaIcon={true}
                    onAreaOrWindsiteChange={this.onAreaOrWindsiteChange} />
                <div className='boxInner'>
                    <div className={style.boxInner}>
                        <div className={style.subTitle}>
                            <a>{this.state.totalHealthTitle}</a>
                            <a href='javascript:;' onClick={this.goToPage.bind(this, {})}>{this.state.areaHealthTitle}</a>
                        </div>
                        <div className={style.parentLeftSpan + ' panel'} data-aspect-ratio='0.1607'>
                            <div className='panelHeader'>
                                <span className='panelTitle'>{this.state.totalHealth}</span>
                            </div>
                            {Utils.isEmpty(healthDetail) ?
                            <div className='dataEmpty'></div> :
                            <Healthyheid
                                name={'总健康度'}
                                tooltipName={'总健康度'}
                                healthDetail={healthDetail}
                                onHealthChange={this.handleMonthChange} />}
                        </div>
                        <div className={style.parentLeftSpan + ' panel'} data-aspect-ratio='0.1607'>
                            <div className='panelHeader'>
                                <span className='panelTitle'>{this.state.areaHealth}</span>
                            </div>
                            {Utils.isEmpty(healthDetailArea) ?
                            <div className='dataEmpty'></div> :
                            <Heaithyfoot
                                name={'健康度'}
                                color={'#408ef0'}
                                tooltipName={'健康度'}
                                healthDetail={healthDetailArea}
                                onHealthChange={this.handlePlaceChange} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        healthTotal:state.health.healthTotal || {}
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getHealthTotal: function({ data, before, after, success, fail }) {
            dispatch(actions.getHealthTotal({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TotalHealth);
