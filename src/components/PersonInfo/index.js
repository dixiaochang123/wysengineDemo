// 用户信息
import React from 'react';
const ReactRedux = require('react-redux');

import Utils from 'utils/utils';

import Navbar from 'subComponents/Navbar';
import PersonInfoBasic from 'subComponents/PersonInfoBasic';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class PersonInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    componentDidMount() {
        $(document.body).removeClass('btnLoading');
        Utils.handleBigScreenDomHeight();
    }
    render() {
        return (
            <div className={style.box}>
                <Navbar
                    props={this.props} />
                 <div className='boxInner'>
                    <div className={'panel ' + style.panel}>
                        <div className='panelHeader'>
                            <div className='panelTitle'>个人信息</div>
                        </div>
                        <div className={'panelBody ' + style.panelBody}>
                            <PersonInfoBasic />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = function() {
    return {};
};

let mapDispatchToProps = function() {
    return {};
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PersonInfo);
