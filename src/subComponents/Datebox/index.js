require('jquery-mousewheel/jquery.mousewheel.js');

import React from 'react';
import Moment from 'moment';
import Utils from 'utils/utils';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');
let DATE_FORMAT = 'YYYY-MM-DD';
let TIME_FORMAT = 'HH:mm:ss';

class Datepicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDatebox: false,
            date: Moment().format(DATE_FORMAT),
            time: Moment().format(TIME_FORMAT)
        };

        // 关闭日期选择框
        this.close = this.close.bind(this);
        // 展示、隐藏日历选择框
        this.toggleDatebox = this.toggleDatebox.bind(this);
        // 设置日期
        this.setDate = this.setDate.bind(this);
        // 设置时间
        this.setTime = this.setTime.bind(this);
        // 处理年份变化
        this.handleYearChange = this.handleYearChange.bind(this);
        // 处理月份变化
        this.handleMonthChange = this.handleMonthChange.bind(this);
        // 处理天数变化
        this.handleDayChange = this.handleDayChange.bind(this);
        // 处理小时变化
        this.handleHourChange = this.handleHourChange.bind(this);
        // 处理分钟变化
        this.handleMinuteChange = this.handleMinuteChange.bind(this);
        // 处理秒变化
        this.handleSecondChange = this.handleSecondChange.bind(this);
    }
    componentDidMount() {
        $('#' + this.props.id + 'Year').on('mousewheel', function(event) {
            // event.deltaX, event.deltaY, event.deltaFactor
            this.handleYearChange(event.deltaY);
            return false;
        }.bind(this));
        $('#' + this.props.id + 'Month').on('mousewheel', function(event) {
            this.handleMonthChange(event.deltaY);
            return false;
        }.bind(this));
        $('#' + this.props.id + 'Date').on('mousewheel', function(event) {
            this.handleDayChange(event.deltaY);
            return false;
        }.bind(this));
        $('#' + this.props.id + 'Hour').on('mousewheel', function(event) {
            this.handleHourChange(event.deltaY);
            return false;
        }.bind(this));
        $('#' + this.props.id + 'Minute').on('mousewheel', function(event) {
            this.handleMinuteChange(event.deltaY);
            return false;
        }.bind(this));
        $('#' + this.props.id + 'Second').on('mousewheel', function(event) {
            this.handleSecondChange(event.deltaY);
            return false;
        }.bind(this));
    }
    componentDidUpdate(prevProps) {
        if (prevProps.date != this.props.date) {
            this.setState({
                date: this.props.date
            });
            !!this.props.onSelect && this.props.onSelect(this.props.date);
        }
    }
    close() {
        this.setState({
            showDatebox: false
        });
    }
    toggleDatebox() {
        let showDatebox = this.state.showDatebox;
        this.setState({
            showDatebox: !showDatebox
        });
    }
    setDate() {
        let date = this.state.date;
        this.close();
        !!this.props.onSelect && this.props.onSelect(date);
    }
    setTime() {
        let time = this.state.time;
        this.close();
        !!this.props.onSelect && this.props.onSelect(time);
    }
    handleYearChange(delta) {
        let date = this.state.date;
        let newDate = Moment(date, DATE_FORMAT).add(delta, 'year').format(DATE_FORMAT);
        this.setState({
            date: newDate
        });
    }
    handleMonthChange(delta) {
        let date = this.state.date;
        let newDate = Moment(date, DATE_FORMAT).add(delta, 'month').format(DATE_FORMAT);
        this.setState({
            date: newDate
        });
    }
    handleDayChange(delta) {
        let date = this.state.date;
        let newDate = Moment(date, DATE_FORMAT).add(delta, 'day').format(DATE_FORMAT);
        this.setState({
            date: newDate
        });
    }
    handleHourChange(delta) {
        let time = this.state.time;
        let newTime = Moment(time, TIME_FORMAT).add(delta, 'hour').format(TIME_FORMAT);
        this.setState({
            time: newTime
        });
    }
    handleMinuteChange(delta) {
        let time = this.state.time;
        let newTime = Moment(time, TIME_FORMAT).add(delta, 'minute').format(TIME_FORMAT);
        this.setState({
            time: newTime
        });
    }
    handleSecondChange(delta) {
        let time = this.state.time;
        let newTime = Moment(time, TIME_FORMAT).add(delta, 'second').format(TIME_FORMAT);
        this.setState({
            time: newTime
        });
    }
    render() {
        let mode = this.props.mode || 'datebox';
        let dom = '';
        let boxCls = style.box;
        let dateboxCls = this.state.showDatebox ? style.datebox : style.datebox + ' ' + style.dateboxHide;
        if (this.props.isActive) {
            boxCls += (' ' + style.active);
        }
        if (this.props.isInModal) {
            boxCls += (' ' + style.inModal);
        }

        if (mode == 'datebox') {
            dom = (
                <div id={this.props.id} className={boxCls}>
                    <div className={this.state.showDatebox ? style.dateboxOverlay : 'none'} onClick={this.close}></div>
                    <div className={style.dateInput} style={!!this.props.boxStyle ? this.props.boxStyle : {}} onClick={this.toggleDatebox}>{this.state.date || '请选择日期'}</div>
                    <div className={dateboxCls}>
                        <div className={style.dateboxInner}>
                            <div className={style.group}>
                                <div className={style.groupBtn + ' ' + style.groupBtnPointer} onClick={this.handleYearChange.bind(this, 1)}>+</div>
                                <div id={this.props.id + 'Year'} className={style.groupBtn}>{Moment(this.state.date, DATE_FORMAT).year()}</div>
                                <div className={style.groupBtn + ' ' + style.groupBtnPointer} onClick={this.handleYearChange.bind(this, -1)}>-</div>
                            </div>
                            <div className={style.group}>
                                <div className={style.groupBtn + ' ' + style.groupBtnPointer} onClick={this.handleMonthChange.bind(this, 1)}>+</div>
                                <div id={this.props.id + 'Month'} className={style.groupBtn}>{Moment(this.state.date, DATE_FORMAT).month() + 1}</div>
                                <div className={style.groupBtn + ' ' + style.groupBtnPointer} onClick={this.handleMonthChange.bind(this, -1)}>-</div>
                            </div>
                            <div className={style.group}>
                                <div className={style.groupBtn + ' ' + style.groupBtnPointer} onClick={this.handleDayChange.bind(this, 1)}>+</div>
                                <div id={this.props.id + 'Date'} className={style.groupBtn}>{Moment(this.state.date, DATE_FORMAT).date()}</div>
                                <div className={style.groupBtn + ' ' + style.groupBtnPointer} onClick={this.handleDayChange.bind(this, -1)}>-</div>
                            </div>
                        </div>
                        <div className={style.dateBtn} onClick={this.setDate}>设置日期</div>
                    </div>
                </div>
            );
        }
        if (mode == 'timebox') {
            dom = (
                <div id={this.props.id} className={boxCls}>
                    <div className={this.state.showDatebox ? style.dateboxOverlay : 'none'} onClick={this.close}></div>
                    <div className={style.dateInput} style={!!this.props.boxStyle ? this.props.boxStyle : {}} onClick={this.toggleDatebox}>{this.state.time || '请选择时间'}</div>
                    <div className={dateboxCls}>
                        <div className={style.dateboxInner}>
                            <div className={style.group}>
                                <div className={style.groupBtn + ' ' + style.groupBtnPointer} onClick={this.handleHourChange.bind(this, 1)}>+</div>
                                <div id={this.props.id + 'Hour'} className={style.groupBtn}>{Moment(this.state.time, TIME_FORMAT).hour()}</div>
                                <div className={style.groupBtn + ' ' + style.groupBtnPointer} onClick={this.handleHourChange.bind(this, -1)}>-</div>
                            </div>
                            <div className={style.group}>
                                <div className={style.groupBtn + ' ' + style.groupBtnPointer} onClick={this.handleMinuteChange.bind(this, 1)}>+</div>
                                <div id={this.props.id + 'Minute'} className={style.groupBtn}>{Moment(this.state.time, TIME_FORMAT).minute()}</div>
                                <div className={style.groupBtn + ' ' + style.groupBtnPointer} onClick={this.handleMinuteChange.bind(this, -1)}>-</div>
                            </div>
                            <div className={style.group}>
                                <div className={style.groupBtn + ' ' + style.groupBtnPointer} onClick={this.handleSecondChange.bind(this, 1)}>+</div>
                                <div id={this.props.id + 'Second'} className={style.groupBtn}>{Moment(this.state.time, TIME_FORMAT).second()}</div>
                                <div className={style.groupBtn + ' ' + style.groupBtnPointer} onClick={this.handleSecondChange.bind(this, -1)}>-</div>
                            </div>
                        </div>
                        <div className={style.dateBtn} onClick={this.setTime}>设置时间</div>
                    </div>
                </div>
            );
        }

        return dom;
    }
}

module.exports = Datepicker;
