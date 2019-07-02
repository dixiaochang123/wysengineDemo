 // 生产率页面
import React from 'react';
const ReactRedux = require('react-redux');

import actions from 'actions';
import User from 'utils/user';
import Utils from 'utils/utils';

import Navbar from 'subComponents/Navbar';
import MainGlobhead from 'subComponents/MainGlobhead';
import ChartDashpowergainbar from 'subComponents/ChartDashpowergainbar';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class Productivity extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 头部区域事件
        this.onAreaOrWindsiteChange = this.onAreaOrWindsiteChange.bind(this);
    }
    componentDidMount() {
        Utils.handleBigScreenDomHeight();
    }
    componentWillMount() {
        // 获取生产率详情
        this.props.getProductivityDetail({
            data: {
                AREA: '',
                PROJECT: '',
                TURBINE: ''
            },
            success: function() {
                $(document.body).removeClass('btnLoading');
            }.bind(this)
        });
    }
    onAreaOrWindsiteChange() {
        let area = !!User.get('currentArea').CODE ? User.get('currentArea').CODE : '';
        let project = !!User.get('currentWindsite').CODE_ ? User.get('currentWindsite').CODE_ : '';
        this.props.getProductivityDetail({
            data: {
                AREA: !!area ? area : '',
                PROJECT: !!project ? project : '',
                TURBINE: ''
            }
        });
    }
    render() {
        let productivityDetail = this.props.productivityDetail || [];
        let powerGainDetail = {};
        let keys = Object.keys(productivityDetail);
        keys.forEach(function(key) {
            powerGainDetail[key] = {
                tbGrowthRate: !!productivityDetail[key] ? productivityDetail[key].tbRate : 0,
                hbGrowthRate: !!productivityDetail[key] ? productivityDetail[key].hbRate : 0,
                tbEnergy: !!productivityDetail[key] ? productivityDetail[key].tbProduction : 0,
                hbEnergy: !!productivityDetail[key] ? productivityDetail[key].hbProduction : 0,
                energy: !!productivityDetail[key] ? productivityDetail[key].production : 0,
                hbDate: !!productivityDetail[key] ? productivityDetail[key].hbDate : 0,
                tbDate: !!productivityDetail[key] ? productivityDetail[key].tbDate : 0
            };
        });

        let values = Object.values(productivityDetail);
        let valuesNew = Array.from(new Set(values));
        let tbRate = valuesNew.map((item) => item.tbRate);
        let tbProduction = valuesNew.map((item) => item.tbProduction);
        let production = valuesNew.map((item) => item.production);
        let hbRate = valuesNew.map((item) => item.hbRate);
        let hbProduction = valuesNew.map((item) => item.hbProduction);

        let tbTate1 = Array.from(new Set(tbRate));
        let tbProduction1 = Array.from(new Set(tbProduction));
        let production1 = Array.from(new Set(production));
        let hbRate1 = Array.from(new Set(hbRate));
        let hbProduction1 = Array.from(new Set(hbProduction));

        let isProduction1Empty = production1.filter((item) => item == null).length == production1.length;
        let isHbRate1Empty = hbRate1.filter((item) => item == null).length == hbRate1.length;
        let isHbProduction1Empty = hbProduction1.filter((item) => item == null).length == hbProduction1.length;

        let isEmpty = tbTate1[0] == null && tbProduction1[0] == null && isProduction1Empty && isHbRate1Empty && isHbProduction1Empty;
        return (
            <div className={style.box}>
                <Navbar
                    props={this.props}
                    showAreaIcon={true}
                    onAreaOrWindsiteChange={this.onAreaOrWindsiteChange} />
                <div className='boxInner'>
                    <div className={style.boxInner}>
                        <div className={style.subTitle}>近一年生产率变化</div>
                        <MainGlobhead powerGainDetail={powerGainDetail} />
                        <div className={style.chart1 + ' panel'} data-aspect-ratio='0.2073'>
                            <div className='panelHeader'>
                                <span className='panelTitle'>近一年生产率变化</span>
                            </div>
                            {isEmpty ?
                            <div className='dataEmpty'></div> :
                            <ChartDashpowergainbar
                                showPage={true}
                                prompt={'生产率变化'}
                                data={productivityDetail}
                                powerGainDetail={powerGainDetail} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        productivityDetail: state.productivity.productivityDetail || {}
    };
};

let mapDispatchToProps = function(dispatch) {
    return {
        getProductivityDetail: function({ data, before, after, success, fail }) {
            dispatch(actions.getProductivityDetail({ data, before, after, success, fail }));
        }
    };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Productivity);
