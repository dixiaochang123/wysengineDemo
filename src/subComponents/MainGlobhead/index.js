import React from 'react';
import Utils from 'utils/utils';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class MainGlobhead extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pathname: ''
        };
    }
    componentDidMount() {
        this.setState({
            pathname: window.location.pathname
        });
    }
    render() {
        let powerGainDetail = this.props.powerGainDetail;
        let keys = Object.keys(powerGainDetail);
        let halfYearKeys1 = keys.slice(0,6);
        let halfYearKeys2 = keys.slice(6,12);
        let powerGains1 = halfYearKeys1.map(function(key, index) {
            let powerGainItem = powerGainDetail[key];
            let tbGrowthRate = powerGainItem.tbGrowthRate;
            let hbGrowthRate = powerGainItem.hbGrowthRate;
            return (
                <div key={key + index} className={style.boxInnerHeideChild}>
                    <div className={style.boxInnerHeideChildright}>
                        <p>{key}</p>
                        <p><span>同比</span><span>环比</span></p>
                        <p><span className={!!tbGrowthRate && tbGrowthRate.substring(0,1)=='-' ? style.bottomNub : style.topNub}>{!!powerGainItem.tbGrowthRate ? powerGainItem.tbGrowthRate : '0%'}</span><span className={!!hbGrowthRate && hbGrowthRate.substring(0,1)=='-' ? style.bottomNub : style.topNub}>{!!powerGainItem.hbGrowthRate ? powerGainItem.hbGrowthRate : '0%'}</span></p>
                    </div>
                    <div className={style.divLine}></div>
                </div>
            );
        });
        let powerGains2 = halfYearKeys2.map(function(key, index) {
            let powerGainItem = powerGainDetail[key];
            let tbGrowthRate = powerGainItem.tbGrowthRate;
            let hbGrowthRate = powerGainItem.hbGrowthRate;
            return (
                <div key={key + index} className={style.boxInnerHeideChild}>
                    <div className={style.boxInnerHeideChildright}>
                        <p>{key}</p>
                        <p><span>同比</span><span>环比</span></p>
                        <p><span className={!tbGrowthRate || tbGrowthRate.substring(0,1)!='-' ? style.topNub : style.bottomNub}>{!!powerGainItem.tbGrowthRate ? powerGainItem.tbGrowthRate : '0%'}</span><span className={!hbGrowthRate || hbGrowthRate.substring(0,1)!='-' ? style.topNub : style.bottomNub}>{!!powerGainItem.hbGrowthRate ? powerGainItem.hbGrowthRate : '0%'}</span></p>
                    </div>
                    <div className={style.divLine}></div>
                </div>
            );
        });
        return (
            <div className={style.boxInnerHeide}>
                <div className={style.boxInnerHeide1} data-aspect-ratio='0.0552' >
                    {powerGains1}
                </div>
                <div className={style.boxInnerHeide2} data-aspect-ratio='0.0552' >
                    {powerGains2}
                </div>
            </div>
        );
    }
}

module.exports = MainGlobhead;
