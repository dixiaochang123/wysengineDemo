 // 总完结率
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

const TITLE_MAP = {
    completed: '完结率',
    issued: '下发率'
};

class TotalCompletionRate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 当前选中子标签页
            // completed: 完结率
            // issued: 下发率
            selected: 'completed',
            // 左侧标签组父标签名称
            titleName: '总完结率',
            // 左侧标签组子标签名称 or 第二行图表名称
            subName: '区域完结率',
            // 第一行图表名称
            tclAllName: '总完结率',
            //弹出框
            handleArrowBoxShow: false
        };

        // 头部区域事件
        this.onAreaOrWindsiteChange = this.onAreaOrWindsiteChange.bind(this);

        // 查看完结率
        this.viewCompleted = this.viewCompleted.bind(this);
        // 查看下发率
        this.viewIssued = this.viewIssued.bind(this);
        // 获取全部数据（完结率 or 下发率）
        this.getWholeData = this.getWholeData.bind(this);
        // 获取部分数据（月份变化后的数据概览）
        this.getPartialData = this.getPartialData.bind(this);

        // 查看月份数据变化
        this.viewMonthDetail = this.viewMonthDetail.bind(this);
        // 查看场所（区域 or 风场）详情
        this.viewPlaceDetail = this.viewPlaceDetail.bind(this);

        // 跳转到区域完结率
        this.goToPage = this.goToPage.bind(this);
        //弹出框事件
        this.handleArrowBoxShow = this.handleArrowBoxShow.bind(this);
        //蒙层
        this.handleMc = this.handleMc.bind(this);
    }
    componentWillMount() {
        this.onAreaOrWindsiteChange();
        User.set('barClickColor4', {});
        User.set('barClickColor5', {});
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
        $(document.body).removeClass('btnLoading');
    }
    onAreaOrWindsiteChange() {
        let area = User.get('currentArea');
        let project = User.get('currentWindsite');

        // 区域名称
        let areaName = !!area ? area.NAME + '区域' : '总';

        let selectedName = TITLE_MAP[this.state.selected];

        let titleName = !!project ? '风场' + selectedName : areaName + selectedName;
        let tclAllName = !!project ? project.NAME_ : areaName + selectedName;
        let subName = !!project ? '风机' + selectedName : (!!area ? '风场' + selectedName : '区域' + selectedName);

        this.setState({
            titleName: titleName,
            tclAllName: tclAllName,
            subName: subName
        }, function() {
            this.getWholeData();
            this.getPartialData();
        });
    }
    handleMc() {
        this.setState({
            handleArrowBoxShow: false
        });
    }
    viewCompleted() {
        let selectedName = TITLE_MAP['completed'];
        this.setState({
            handleArrowBoxShow: false,
            selected: 'completed',
            titleName: this.state.titleName.slice(0, -3) + selectedName,
            subName: this.state.subName.slice(0, -3) + selectedName,
            tclAllName: this.state.tclAllName.indexOf('下发率') != -1 ? this.state.tclAllName.slice(0, -3) + selectedName : this.state.tclAllName
        }, function() {
            this.getWholeData();
            this.getPartialData();
        }.bind(this));
    }
    // 下发率
    viewIssued() {
        let selectedName = TITLE_MAP['issued'];
        this.setState({
            handleArrowBoxShow: false,
            selected: 'issued',
            titleName: this.state.titleName.slice(0, -3) + selectedName,
            subName: this.state.subName.slice(0, -3) + selectedName,
            tclAllName: this.state.tclAllName.indexOf('完结率') != -1 ? this.state.tclAllName.slice(0, -3) + selectedName : this.state.tclAllName
        }, function() {
            this.getWholeData();
            this.getPartialData();
        }.bind(this));
    }
    handleArrowBoxShow() {
        this.setState({
            handleArrowBoxShow: true
        });
    }
    getWholeData() {
        let area = User.get('currentArea');
        let project = User.get('currentWindsite');
        this.props.getPredictCompleteTotal({
            data: {
                AREA: !!area ? area.CODE : '',
                PROJECT: !!project ? project.CODE_ : '',
                CATEGORY: this.state.selected
            }
        });
    }
    getPartialData(data) {
        let area = User.get('currentArea');
        let project = User.get('currentWindsite');
        let postData = {
            AREA: !!area ? area.CODE : '',
            PROJECT: !!project ? project.CODE_ : '',
            CATEGORY: this.state.selected,
            MONTH: ''
        };
        if (!!data) {
            postData = Object.assign({}, postData, data);
        }
        this.props.getPredictCompleteSubTotal({
            data: postData
        });
    }
    viewMonthDetail(data) {
        this.getPartialData({
            MONTH: !!data.name ? data.name : ''
        });
    }
    viewPlaceDetail(data) {
        if (!!data && !!data.data && !!data.data.key && !!data.data.key.id && data.data.key.id.length > 5) {
            return false;
        }
        this.goToPage();
    }
    goToPage() {
        this.props.router.push({
            pathname: '/regionalendrate',
            state: {
                selected: this.state.selected,
                titleName: !!this.state.titleName ? this.state.titleName : '',
                tclAllName: !!this.state.tclAllName ? this.state.tclAllName : '',
                subName: !!this.state.subName ? this.state.subName : ''
            }
        });
    }
    render() {
        let predictCompleteTotal = this.props.predictCompleteTotal || {};

        // 场所（区域 or 风场）-月份图
        let monthDetail = {};
        let keys = Object.keys(predictCompleteTotal);
        let values = Object.values(predictCompleteTotal);
        let valuesNew = Array.from(new Set(values));
        keys.forEach((key) => {
            monthDetail[key] = {
                tbRate: !!predictCompleteTotal[key] ? predictCompleteTotal[key].rate : 0
            };
        });

        // 区域 or 风场数据图
        let predictCompleteSubTotal = this.props.predictCompleteSubTotal || {};
        let areaCount1 = predictCompleteSubTotal.areaCount || [];
        let placeDetail = {};
        let areaCount = [].concat(areaCount1);
        areaCount.map((key, index) => {
            placeDetail[index] = {
                id: areaCount[index].id,
                value: areaCount[index].value,
                name: areaCount[index].name,
                finishedValue: areaCount[index].finishedValue
            };
        });

        let selectedName = TITLE_MAP[this.state.selected] || '';
        return (
            <div className={style.box}>
                <Navbar
                    props={this.props}
                    showAreaIcon={true}
                    onAreaOrWindsiteChange={this.onAreaOrWindsiteChange} />
                <div className='boxInner'>
                    <div className={style.boxInner}>
                        <div className={style.subTitle}>
                            <div className={style.subtitleLeft}>
                                <a href='javascript:;' onClick={this.handleArrowBoxShow}>{!!this.state.titleName ? this.state.titleName : ''}</a>
                                <a href='javascript:;' onClick={this.goToPage}>{!!this.state.subName ? this.state.subName : ''}</a>
                                <div className={!!this.state.handleArrowBoxShow ? style.arrow_box +' '+ style.down+' '+ style.down1 : ' none'}>
                                    <p  className={style.year} onClick={this.viewCompleted}>完结率</p>
                                    <p  className={style.month} onClick={this.viewIssued}>下发率</p>
                                </div>
                            </div>
                        </div>
                        <div className={!!this.state.handleArrowBoxShow ? style.mc : ' none'} onClick={this.handleMc}></div>
                        <div className={style.parentLeftSpan + ' panel'} data-aspect-ratio='0.1607'>
                            <div className='panelHeader'>
                                <span className='panelTitle'>{!!this.state.tclAllName ? this.state.tclAllName : ''}</span>
                            </div>
                            {(valuesNew.length == 1 || valuesNew.length < 1) && valuesNew[0] == null ?
                            <div className='dataEmpty'></div> :
                            <Healthyheid
                                name={'总完结率'}
                                healthDetail={monthDetail}
                                tooltipName={'总' + selectedName}
                                onHealthChange={this.viewMonthDetail} />}
                        </div>
                        <div className={style.parentLeftSpan + ' panel'} data-aspect-ratio='0.1607'>
                            <div className='panelHeader'>
                                <span className='panelTitle'>{!!this.state.subName ? this.state.subName : ''}</span>
                            </div>
                            {Utils.isEmpty(placeDetail) ?
                            <div className='dataEmpty'></div> :
                            <Heaithyfoot
                                name={'完结率'}
                                color={'#408ef0'}
                                tooltipName={selectedName}
                                healthDetail={placeDetail}
                                onHealthChange={this.viewPlaceDetail} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        predictCompleteTotal: state.alarms.predictCompleteTotal || {},
        predictCompleteSubTotal: state.alarms.predictCompleteSubTotal || {}
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getPredictCompleteTotal: function({ data, before, after, success, fail }) {
            dispatch(actions.getPredictCompleteTotal({ data, before, after, success, fail }));
        },
        getPredictCompleteSubTotal: function({ data, before, after, success, fail }) {
            dispatch(actions.getPredictCompleteSubTotal({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TotalCompletionRate);
