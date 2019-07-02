 // 区域完结率
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

const TITLE_MAP = {
    completed: '完结率',
    issued: '下发率'
};

class RegionalEndRate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 当前选中子标签页
            // completed: 完结率
            // issued: 下发率
            selected: 'completed',
            // 选中的code：可能是区域 or 风场
            selectCode: '',
            // 左侧标签组父标签名称
            titleName: '总完结率',
            // 左侧标签组子标签名称
            subName: '区域完结率',
            // 第一行图表名称
            tclAllName: '总完结率',
            // 第二行左侧图表名称
            bottomLeft: '',
            // 第二行右侧图表名称
            bottomRight: '',
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

        // 处理场所（区域 or 风场）数据（完结率 or 下发率）概览图场所变化
        this.handlePlaceChange = this.handlePlaceChange.bind(this);
        // 处理数据（完结率 or 下发率）-月份对应图中月份变化
        this.handleMonthChange = this.handleMonthChange.bind(this);
        // 获取部分数据（完结率 or 下发率）
        this.getPartialData = this.getPartialData.bind(this);

        // 跳转到总完结率页面
        this.goToPage = this.goToPage.bind(this);
        //弹出框事件
        this.handleArrowBoxShow = this.handleArrowBoxShow.bind(this);
        //蒙层
        this.handleMc = this.handleMc.bind(this);
    }
    handleMc() {
        this.setState({
            handleArrowBoxShow: false
        })
    }
    handleArrowBoxShow() {
        this.setState({
            handleArrowBoxShow: true
        });
    }
    componentWillMount() {
        let area = User.get('currentArea');
        let project = User.get('currentWindsite');
        let isAreaEmpty = Utils.isEmpty(area);

        // 区域名称
        let areaName = !!area ? area.NAME : '';

        // 总完结率、总下发率页面跳转过来传递的state数据
        let paramsState = this.props.location.state;
        let titleName = !!paramsState ? paramsState.titleName : '';
        let tclAllName = !!paramsState ? paramsState.tclAllName : '';
        let subName = !!paramsState ? paramsState.subName : '';

        let selectedName = TITLE_MAP[this.state.selected];

        let finalTclAllName = tclAllName;
        if (tclAllName == ('总' + selectedName)) {
            finalTclAllName = subName;
        } else if (subName == ('风机' + selectedName)) {
            finalTclAllName = areaName + '区域' + selectedName;
        } else {
            finalTclAllName = titleName;
        }

        this.setState({
            titleName: titleName,
            subName: subName,
            tclAllName: finalTclAllName
        }, function() {
            if (!!this.props.location.state.selected) {
                this.props.location.state.selected == 'completed' ? this.viewCompleted() : this.viewIssued();
                return false;
            }
            this.props.getPredictCompleteArea({
                data: {
                    AREA: !!area ? area.CODE : '',
                    PROJECT: !!project ? project.CODE_ : '',
                    CATEGORY: this.state.selected,
                    selectedDate: '',
                    selectedArea: ''
                },
                success: function(res) {
                    let areaRateList = !!res.body && !!res.body.areaRateList ? res.body.areaRateList : [];
                    if (areaRateList.length > 0 && !!areaRateList[0].name) {
                        let itemName = areaRateList[0].name;
                        this.setState({
                            bottomLeft: isAreaEmpty ? itemName + '区域' + selectedName : itemName,
                            bottomRight: isAreaEmpty ? itemName + '区域风场' + selectedName : itemName
                        });
                    }
                }.bind(this)
            });
        }.bind(this));
        User.set('barClickColor4', {});
        User.set('barClickColor5', {});
        User.set('barClickColor6', {});
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
        $(document.body).removeClass('btnLoading');
    }
    onAreaOrWindsiteChange() {
        let area = User.get('currentArea');
        let project = User.get('currentWindsite');
        if (!!area || !!project) {
            this.goToPage();
        }
    }
    viewCompleted() {
        let selectedName = TITLE_MAP['completed'];
        let bottomLeft = this.state.bottomLeft;
        let bottomRight = this.state.bottomRight;
        this.setState({
            handleArrowBoxShow: false,
            selected: 'completed',
            titleName: this.state.titleName.slice(0, -3) + selectedName,
            subName: this.state.subName.slice(0, -3) + selectedName,
            tclAllName: this.state.tclAllName.slice(0, -3) + selectedName,
            bottomLeft: bottomLeft.indexOf('下发率') != -1 ? bottomLeft.slice(0, -3) + selectedName : bottomLeft,
            bottomRight: bottomRight.indexOf('下发率') != -1 ? bottomRight.slice(0, -3) + selectedName : bottomRight
        }, function() {
            this.getWholeData();
        }.bind(this));
    }
    viewIssued() {
        let selectedName = TITLE_MAP['issued'];
        let bottomLeft = this.state.bottomLeft;
        let bottomRight = this.state.bottomRight;
        this.setState({
            handleArrowBoxShow: false,
            selected: 'issued',
            titleName: this.state.titleName.slice(0, -3) + selectedName,
            subName: this.state.subName.slice(0, -3) + selectedName,
            tclAllName: this.state.tclAllName.slice(0, -3) + selectedName,
            bottomLeft: bottomLeft.indexOf('完结率') != -1 ? bottomLeft.slice(0, -3) + selectedName : bottomLeft,
            bottomRight: bottomRight.indexOf('完结率') != -1 ? bottomRight.slice(0, -3) + selectedName : bottomRight
        }, function() {
            this.getWholeData();
        }.bind(this));
    }
    getWholeData() {
        let area = User.get('currentArea');
        let project = User.get('currentWindsite');
        this.props.getPredictCompleteArea({
            data: {
                AREA: !!area ? area.CODE : '',
                PROJECT: !!project ? project.CODE_ : '',
                CATEGORY: this.state.selected,
                MONTH: '',
                selectedArea: ''
            }
        });
    }
    handlePlaceChange(data) {
        let area = User.get('currentArea');
        let isAreaEmpty = Utils.isEmpty(area);

        let turbine = !!data && !!data.data && !!data.data.key ? data.data.key.turbine : '';

        let code = !!data && !!data.data && !!data.data.key ? data.data.key.code : '';
        let name = !!data && !!data.data && !!data.data.key ? data.data.key.name : '';

        let selectedName = TITLE_MAP[this.state.selected];

        this.setState({
            selectCode: code,
            bottomLeft: isAreaEmpty ? name + '区域' + selectedName : name,
            bottomRight: isAreaEmpty ? name + '区域风场' + selectedName : name
        }, function() {
            this.getPartialData({
                selectedArea: !!turbine && turbine!='' ? turbine : code || ''
            });
        }.bind(this));
    }
    handleMonthChange(data) {
        let time = !!data && !!data.name ? data.name : '';
        this.getPartialData({
            selectedDate: time || '',
            selectedArea: this.state.selectCode
        });
    }
    getPartialData(data) {
        let area = User.get('currentArea');
        let project = User.get('currentWindsite');
        let postData = Object.assign({}, {
            AREA: !!area ? area.CODE : '',
            PROJECT: !!project ? project.CODE_ : '',
            CATEGORY: this.state.selected,
            selectedDate: '',
            selectedArea: ''
        }, data);
        this.props.getPredictCompleteArea({
            data: postData
        });
    }
    goToPage() {
        this.props.router.push({
            pathname: '/totalcompletionrate'
        });
    }
    render() {
        let predictCompleteArea = this.props.predictCompleteArea || {};
        // 数据概览
        let areaRateList = !!predictCompleteArea && !!predictCompleteArea.areaRateList ? predictCompleteArea.areaRateList : [];
        let dataOverview = {};
        areaRateList.map((key, index) => {
            dataOverview[index] = {
                value: !!areaRateList[index] ? areaRateList[index].rate : '',
                name: !!areaRateList[index] ? areaRateList[index].name : '',
                code: !!areaRateList[index] ? areaRateList[index].PROJECT || areaRateList[index].AREA : '',
                turbine: !!areaRateList[index] ? areaRateList[index].TURBINE : ''
            };
        });

        // 数据-月份概览
        let monthRateList = !!predictCompleteArea && !!predictCompleteArea.monthRateList ? predictCompleteArea.monthRateList : {};
        let keys = Object.keys(monthRateList).reverse() || [];
        let monthOverview = {};
        keys.map((key) => {
            monthOverview[key] = {
                value: monthRateList[key]
            };
        });

        // 数据详情
        let projectRateList = !!predictCompleteArea && !!predictCompleteArea.projectRateList ? predictCompleteArea.projectRateList : [];
        let dataDetail = {};
        projectRateList.map((key, index) => {
            dataDetail[index] = {
                value: !!projectRateList[index] ? projectRateList[index].rate : 0,
                name: !!projectRateList[index] ? projectRateList[index].name : 0
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
                            <div className={style.subTitleLeft}>
                                <a href='javascript:;' onClick={this.goToPage}>{!!this.state.titleName ? this.state.titleName : ''}</a>
                                <a href='javascript:;' onClick={this.handleArrowBoxShow}>{!!this.state.subName ? this.state.subName : ''}</a>
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
                            {Utils.isEmpty(dataOverview) ?
                            <div className='dataEmpty'></div> :
                            <Heaithyfoot
                                name={'完结率'}
                                color={'#8dcd43'}
                                tooltipName={selectedName}
                                healthDetail={dataOverview}
                                onHealthChange={this.handlePlaceChange} />}
                        </div>
                        <div className={style.flex} data-aspect-ratio='0.1607'>
                            <div className={style.leftChart + ' panel'}>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>{!!this.state.bottomLeft ? this.state.bottomLeft : '区域' + selectedName}</span>
                                </div>
                                {Utils.isEmpty(monthOverview) ?
                                <div className='dataEmpty'></div> :
                                <Heaithyfoottwo
                                    name={'完结率'}
                                    tooltipName={selectedName}
                                    healthDetail={monthOverview}
                                    onHealthChange={this.handleMonthChange} />}
                            </div>
                            <div className={style.rightChart + ' panel'}>
                                <div className='panelHeader'>
                                    <span className='panelTitle'>{!!this.state.bottomRight ? this.state.bottomRight : '区域风场' + selectedName}</span>
                                </div>
                                {Utils.isEmpty(dataDetail) ?
                                <div className='dataEmpty'></div> :
                                <Heaithyfoottworight
                                    name={'完结率'}
                                    tooltipName={selectedName}
                                    healthDetail={dataDetail} />}
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
        predictCompleteArea: state.alarms.predictCompleteArea || {}
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getPredictCompleteArea: function({ data, before, after, success, fail }) {
            dispatch(actions.getPredictCompleteArea({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(RegionalEndRate);
