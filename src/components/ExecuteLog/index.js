// 首页
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

import Navbar from 'subComponents/Navbar';
import Table from 'subComponents/Table';
import TableLog from 'subComponents/TableLog';
import TableOperation from 'subComponents/TableOperation';
import StatisticsCharts from 'subComponents/StatisticsCharts';
import Modal from 'subComponents/Modal';
import ProcessingModify from 'subComponents/ProcessingModify';

import TyphoonIcon from 'images/homepage/icon_right.png';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class ExecuteLog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 今日预警分页
            todayPredictPager: {
                total: 1,
                currPage: 1,
                pageSize: 1
            },
            // 准确定
            exactList: [{
                name: '准确',
                id: 1
            },{
                name: '不准确',
                id: 0
            }],
            exactListCheced: '不准确',
            // 禁止
            ban: false,
            form: {
                // 描述
                description: '',
                // 描述1
                description1: '',
                //反馈工单
                fkgd: '',
                //排查时间
                pcsj: '',
                //工单id
                id: '',
                // 准确是否
                accurateId: 1
            },
            showModal: false,
            chargeName: '',
            isNot: '是',
            chargePerson2: [],
            inputNameShow: true,
            focus: false,
            failureTypeList: [],
            selectedFailureType: [],
            id: ''
        };

        // 初始化
        this.init = this.init.bind(this);
        //查看工单
        this.getWorkorderById = this.getWorkorderById.bind(this)
        // 跳转页面
        this.jumpToPage = this.jumpToPage.bind(this);
        // 跳转页面，带有state参数
        this.jumpToPageWithState = this.jumpToPageWithState.bind(this);
        // 通过区域、风场获取数据
        this.initDataByAreaOrWindsite = this.initDataByAreaOrWindsite.bind(this);

        // 今日预警翻页回调
        this.handleTodayPredictPageChange = this.handleTodayPredictPageChange.bind(this);
        // 查看今日预警单条预警详情
        this.viewAlarmDetail = this.viewAlarmDetail.bind(this);
        this.handleApproveStatusChange = this.handleApproveStatusChange.bind(this);
        // 描述
        this.handleDesChange = this.handleDesChange.bind(this);
        // 描述1
        this.handleDesChange1 = this.handleDesChange1.bind(this);
        // 展示弹框
        this.showModal = this.showModal.bind(this);
        // 关闭弹框
        this.closeModal = this.closeModal.bind(this);
        // 展示输入框
        this.showInput = this.showInput.bind(this);
        //负责人输入框变化
        this.handleChargeNameChange = this.handleChargeNameChange.bind(this);
        //负责人输入框焦点离开事件
        this.inputOnBlur = this.inputOnBlur.bind(this);
        //负责人输入框焦点获取事件
        this.inputOnFocus = this.inputOnFocus.bind(this);
        //排查详细说明单选按钮
        // this.handleIsNotChange = this.handleIsNotChange.bind(this);
        //保存
        this.handleBaocunChange = this.handleBaocunChange.bind(this);
        //保存并提交
        this.handleSubmitChange = this.handleSubmitChange.bind(this);
        //查看处理过程
        this.getDisposeProcessById = this.getDisposeProcessById.bind(this);
        //删除处理过程
        this.deleteProcessById = this.deleteProcessById.bind(this);
        //反馈工单
        this.handleFkgdChange = this.handleFkgdChange.bind(this);
        //排查时间
        this.handlePcsjChange = this.handlePcsjChange.bind(this);

    }
    componentWillMount() {
        // let id = this.props.location.state.workorderId;
        let form = this.state.form;
        // form.id = this.props.location.state.workorderId;
        form.id = 9;
        this.setState({
            form: form
        });
        this.init();
        this.getWorkorderById(form.id);
    }
    componentDidMount() {
        Utils.handleScreenZoom(function() {
            Utils.handleBigScreenDomHeight();
        }.bind(this));
    }
    getWorkorderById(id) {
        this.props.getWorkorderById({
            data: {
                ID: id
            },
            success: function(resp) {
                let failureTypeList = this.state.failureTypeList;
                let selectedFailureType = this.state.selectedFailureType;
                failureTypeList = resp.body.failureTypeList;
                selectedFailureType = resp.body.selectedFailureType;
                let chargePerson2 = this.state.chargePerson2;
                let check_man = resp.body.CHECK_MAN;
                check_man='';
                this.setState({
                    failureTypeList: failureTypeList,
                    selectedFailureType: selectedFailureType,
                    chargePerson2: chargePerson2.concat(check_man.split(","))
                })
            }.bind(this)
        });
    }
    handleBaocunChange() {
        console.log(this.state.chargePerson2)
        console.log(this.state.chargePerson2.join(','))
        let form = this.state.form;
        this.props.saveWorkorder({
            data: {
                ID: form.id,
                DESCRIPTION: form.description,
                checkItemList: JSON.stringify(this.state.failureTypeList),
                CHECK_MAN: this.state.chargePerson2.join(',') || '',
                ACCURATE: form.accurateId,
                FEEDBACK_NO: form.fkgd,
                CHECK_TIME: '2018-01-03 02:11:14',
                selectedFailureTypes:'',
                FEED_BACK: form.description1,
                SAVE_TYPE: 'save'
            },
            success: function() {
                let form = this.state.form;
                this.getWorkorderById(form.id)
            }.bind(this)
        })
    }
    handleSubmitChange() {
        this.props.saveWorkorder({
            data: {
                ID: form.id,
                DESCRIPTION: form.description,
                checkItemList: JSON.stringify(this.state.failureTypeList),
                CHECK_MAN: this.state.chargePerson2.join(',') || '',
                ACCURATE: form.accurateId,
                FEEDBACK_NO: form.fkgd,
                CHECK_TIME: '2018-01-03 02:11:14',
                selectedFailureTypes:JSON.stringify(this.state.selectedFailureType),
                FEED_BACK: form.description1,
                SAVE_TYPE: 'submit'
            },
            success: function() {
                let form = this.state.form;
                this.getWorkorderById(form.id)
            }.bind(this)
        })
    }
    handleIsNotChange(item) {
        this.setState({
            isNot: item.name
        })
    }
    handleChargeNameChange(event) {
        let chargeName = event.target.value;
        this.setState({
            chargeName: chargeName
        });
    }
    //反馈工单
    handleFkgdChange(event) {
         let form = this.state.form;
        form.fkgd = event.target.value;
        this.setState({
            form: form
        });
    }
    //排查时间
    handlePcsjChange(event) {
        let form = this.state.form;
        form.pcsj = event.target.value;
        this.setState({
            form: form
        });
    }
    inputOnFocus() {
         this.setState({
            focus: true
        });
         $('#inputName').focus()
    }
    inputOnBlur() {
        let chargePerson2 = this.state.chargePerson2;
        let chargeName = this.state.chargeName;
        if(!!chargePerson2 && !!chargeName && chargeName!='') {
            chargePerson2.push(chargeName)
        }
        this.setState({
            chargePerson2: chargePerson2,
            inputNameShow: false,
            focus: false
        })
        console.log(this.state.chargePerson2.join(','))
        

    }
    showInput() {
        let chargeName = this.state.chargeName;
        this.setState({
            chargeName: '',
            inputNameShow: true,
            focus: true
        })
    }
    handleApproveStatusChange(item) {
         let form = this.state.form;
        form.accurateId = item.id;
        this.setState({
            form: form
        })
    }
    handleDesChange(event) {
        let form = this.state.form;
        form.description = event.target.value;
        this.setState({
            form: form
        });
    }
    handleDesChange1(event) {
        let form = this.state.form;
        form.description1 = event.target.value;
        this.setState({
            form: form
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
        let form = this.state.form;
        this.getWorkorderById(form.id);
    }
    init() {
        $(document.body).removeClass('btnLoading');
        let userInfo = User.get();
        if (!!userInfo && !!userInfo.ID) {
            this.initDataByAreaOrWindsite();
        }
    }
    jumpToPage(path) {
        this.props.router.push({
            pathname: path
        });
    }
    jumpToPageWithState(path, state) {
        this.props.router.push({
            pathname: path,
            state: state
        });
    }
    initDataByAreaOrWindsite() {
        this.setState({
            ban: false
        });
        let currentArea = User.get('currentArea') || '';
        let currentWindsite = User.get('currentWindsite') || '';
        let postData = {
            AREA: !Utils.isEmpty(currentArea) ? currentArea.CODE : '',
            PROJECT: !Utils.isEmpty(currentWindsite) ? currentWindsite.CODE_ : ''
        };
        let userArea = User.get('AREA');
        let userProject = User.get('PROJECTS');

        if (postData.AREA == '') {
            postData.AREA = userArea;
        }
        if (postData.PROJECT == '') {
            postData.PROJECT = userProject;
        }
    }

    handleTodayPredictPageChange(currPage) {
        let pager = this.state.todayPredictPager;
        pager.currPage = currPage;
        this.setState({
            todayPredictPager: pager,
            ban: true
        }, function() {
            // this.getPageTodayPredictList(currPage);
        }.bind(this));
    }
    viewAlarmDetail(alarm) {
        console.log(alarm)
        this.setState({
            showModal: true
        });
        let formDate = alarm.DISPOSE_TIME;
        let formMan = alarm.DISPOSE_MAN;
        let formDescription = alarm.DESCRIPTION;
        console.log(formDate)
        // let formDate = Moment(alarm.DISPOSE_TIME).format('YYYY-MM-DD');
        // let formTime = Moment(alarm.DISPOSE_TIME).format('HH:mm:ss');
        // console.log(alarm)
        //查看处理过程
        this.getDisposeProcessById(alarm.ID);

    }
    //查看处理过程
    getDisposeProcessById(id) {
        this.props.getDisposeProcessById({
            data:{
                ID: id
            }
        })
    }
    deleteProcessById(user) {
        this.props.deleteProcessById({
            data:{
                ID:user.ID
            },
            success: function() {
                Utils.tooltip('删除成功');
                let form = this.state.form;
                this.getWorkorderById(form.id);
            }.bind(this),
            fail: function() {
                Utils.tooltip('删除失败');
            }
        })
    }

    render() {
        let workorderById = this.props.workorderById || [];
        let failureTypeList = !!workorderById && !!workorderById[0] ? workorderById[0].failureTypeList : [];
        let disposeProcessListPage = !!workorderById && !!workorderById[0] && !!workorderById[0].disposeProcessListPage? workorderById[0].disposeProcessListPage.pageData : [];
        let checkHistoryList = !!workorderById && !!workorderById[0] && !!workorderById[0].disposeProcessListPage? workorderById[0].checkHistoryList : [];

        let selectedFailureType = !!workorderById && !!workorderById[0] ? workorderById[0].selectedFailureType : [];
        // let selectedFailureType = ['i'];
        let failureTypeListAll = failureTypeList.concat(selectedFailureType)
        // console.log(failureTypeListAll)

        let exactList = !!this.state.exactList ? this.state.exactList.map(function(item,index) {
            return (
                <div key={'approve' + item.id + index} className='modalFormRadioWrapper'>
                    <span className={this.state.form.accurateId == item.id ? 'modalFormRadio active '+ style.exactListCheced : 'modalFormRadio'} onClick={this.handleApproveStatusChange.bind(this, item)}></span>
                    <span className='modalFormRadioText'>{item.name}</span>
                </div>
            )
        }.bind(this)) : [];
        this.state.chargePerson2.filter(d=>d);
        console.log(this.state.chargePerson2)
        let chargePerson2 = !!this.state.chargePerson2 ? this.state.chargePerson2.map(function(item,index) {
            return (
                <div key={'input'+index}>
                    <span key={'input'+index} className={!!item ? style.chargePerson2 : 'none'}> {item} </span>
                </div>
                )
        }) : '';
        return (
            <div className={style.box + ' full'}>
                <Navbar
                    props={this.props}
                    showAreaIcon={true}
                    onAreaOrWindsiteChange={this.initDataByAreaOrWindsite} />
                <div className='boxInner'>
                    <div className={style.chargePerson}>
                        <div className={style.chargePersonName} id='#chargePersonName'>
                            <span className={style.chargePerson1}>项目负责人：</span>
                            <span>{!!workorderById && !!workorderById[0] ? workorderById[0].FARM_MANAGER+'（'+workorderById[0].LOCATION_CODE+'）' : ''}</span>
                            <span className={style.chargePerson1} id='chargePerson1'>  > </span>
                            {/*<span className={style.chargePerson2}> {chargePerson2[0].name} </span>*/}
                            {/*&nbsp;&nbsp;*/}
                            {/*<span
                                className={!!workorderById && !!workorderById[0] && !!workorderById[0].CHECK_MAN ? style.chargePerson2 : 'none'}>
                                {!!workorderById && !!workorderById[0] ? workorderById[0].CHECK_MAN : ''}
                            </span>*/}
                            {chargePerson2}
                            <input
                                id='inputName'
                                className={!!this.state.inputNameShow && !!workorderById && !!workorderById[0] ? style.inputName+' dis_bottom_input' : 'none'}
                                type='text'
                                name='name'
                                value={this.state.chargeName}
                                onChange={this.handleChargeNameChange}
                                onFocus={this.inputOnFocus}
                                onBlur={this.inputOnBlur}/>
                            <span href='javascript:;' title='添加' className={style.addIcon} onClick={this.showInput}></span>
                        </div>
                        <div className={style.preserve}>
                            <div className={style.preserve1} onClick={this.handleBaocunChange}>保存</div>
                            <div className={style.preserve2} onClick={this.handleSubmitChange}>保存并提交</div>
                        </div>
                    </div>
                    <div className={style.dashboards + ' pure-g'}>
                        <div className='pure-u-24-24 full panel'>
                            <div className='panelHeader'>
                                <span className='panelTitle'>工单详情</span>
                            </div>
                            <div className={style.panelHeader}>
                                <Table
                                    tableId='homepageTodayFanAlarm'
                                    table={workorderById}
                                    ths={['工单号', '风场名称', '机组号', '机组型号', '排查类型', '预警等级',' 创建时间', '专业工具','备件']}
                                    keys={['LOCATION_CODE', 'FARM_NAME', '', 'TURBINE_MODEL', '', 'PREDICT_LEVEL', 'CREATE_TIME','TOOLS','SPARE_PART']}
                                    hasHeader={false}
                                    hasOrder={false}
                                    title={'工单详情'}
                                    pager={this.state.todayPredictPager}
                                    isPageShow={1}
                                    onPageChange={this.handleTodayPredictPageChange} />
                            </div>
                        </div>
                    </div>
                    <div className={style.tables + ' pure-g'}>
                        <div className='pure-u-24-24'>
                            <div className={'pure-g ' + style.tablePanels}>
                                <div className={'pure-u-24-24 full panel '}>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>排查详细说明</span>
                                    </div>
                                    <TableLog
                                        tableId='homepageTodayFanAlarm'
                                        table={failureTypeList}
                                        ths={['序号', '预警排查项目', '预警排查内容','检查结果', '问题描述']}
                                        keys={['NAME', 'CHECK_CONTENT', 'CHECK_RESULT','DESCRIPTION']}
                                        hasHeader={false}
                                        hasOrder={true}
                                        isNot={this.state.isNot}
                                        pager={this.state.todayPredictPager}
                                        onPageChange={this.handleTodayPredictPageChange}
                                        onIsNotChange={this.handleIsNotChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.statistics + ' pure-g'}>
                        <div className={style.statisticsCharts + ' pure-u-24-24'}>
                                <div className={style.statisticsCharts1 + ' pure-u-12-24 panel'}>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>处理过程</span>
                                        <span href='javascript:;' title='添加' className={style.addIcon + ' right'} onClick={this.showModal}></span>
                                    </div>
                                    <div className={style.chuligcTable}>
                                        <TableOperation
                                            tableId='homepageTodayFanAlarm'
                                            table={disposeProcessListPage}
                                            ths={['处理时间', '处理人', '处理过程描述', '附件', '操作']}
                                            keys={['DISPOSE_TIME', 'DISPOSE_MAN', 'DESCRIPTION', 'LOCATION_CODE']}
                                            hasHeader={false}
                                            hasOrder={false}
                                            isPageShow={1}
                                            withOperation={true}
                                            pager={this.state.todayPredictPager}
                                            onDelete={this.deleteProcessById}
                                            onPageChange={this.handleTodayPredictPageChange}
                                            onItemClick={this.viewAlarmDetail} />
                                    </div>
                                </div>
                                <div className={'pure-u-12-24 panel '}>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>准确性及描述</span>
                                    </div>
                                    <div className={style.exactList}>
                                        <div className={style.exactList1}>
                                            {exactList}
                                            <span>反馈工单</span>
                                            <span>
                                                <input
                                                    type='text'
                                                    value={this.state.form.fkgd}
                                                    onChange={this.handleFkgdChange}/>
                                            </span>
                                            <span>排查时间：</span>
                                            <span>
                                                <input
                                                    type='text'
                                                    value={this.state.form.pcsj}
                                                    onChange={this.handlePcsjChange}/>
                                            </span>
                                        </div>
                                        <div className={style.exactList2}>
                                            <textarea
                                            cols='130'
                                            rows='6'
                                            placeholder='描述'
                                            style={{resize: 'none', borderColor: '#121626', backgroundColor: 'transparent'}}
                                            value={this.state.form.description}
                                            onChange={this.handleDesChange}
                                            onFocus={this.cleanErr}></textarea>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                    <div className={style.tables + ' pure-g'}>
                        <div className='pure-u-24-24'>
                            <div className={'pure-g ' + style.tablePanels}>
                                <div className={'pure-u-24-24 full panel '}>
                                    <div className='panelHeader'>
                                        <span className='panelTitle'>操作日志</span>
                                    </div>
                                    <div className={style.operateLog}>
                                        <span>操作描述</span>
                                        <textarea
                                            rows='6'
                                            placeholder='描述'
                                            style={{resize: 'none', borderColor: '#121626', backgroundColor: 'transparent'}}
                                            value={this.state.form.description1}
                                            onChange={this.handleDesChange1}
                                            onFocus={this.cleanErr}></textarea>
                                    </div>
                                    <div className={style.logTable}>
                                        <Table
                                            tableId='homepageTodayFanAlarm'
                                            table={checkHistoryList}
                                            ths={['时间', '处理人', '操作', '描述']}
                                            keys={['CREATE_TIME', 'CREATE_USER_NAME', 'CONTENT', 'FEED_BACK']}
                                            hasHeader={false}
                                            hasOrder={false}
                                            isPageShow={1}
                                            isNot={this.state.isNot}
                                            pager={this.state.todayPredictPager} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={this.state.showModal}
                    onClose={this.closeModal}>
                    <div className='modalForm'>
                        <ProcessingModify
                            data={failureTypeListAll}
                            onClose={this.closeModal} />
                    </div>
                </Modal>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        workorderById: state.log.workorderById || []
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getWorkorderById: function({ data, before, after, success, fail }) {
            dispatch(actions.getWorkorderById({ data, before, after, success, fail }));
        },
        saveWorkorder: function({ data, before, after, success, fail }) {
            dispatch(actions.saveWorkorder({ data, before, after, success, fail }));
        },
        //查看处理过程
        getDisposeProcessById: function({ data, before, after, success, fail }) {
            dispatch(actions.getDisposeProcessById({ data, before, after, success, fail }));
        },
        deleteProcessById: function({ data, before, after, success, fail }) {
            dispatch(actions.deleteProcessById({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ExecuteLog);
