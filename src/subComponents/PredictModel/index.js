import React from 'react';

import Utils from 'utils/utils';
import Constant from 'constant/index';
import Bubble from 'subComponents/Bubble/index';

import IconDqbl from 'images/warninginfordetails/icon_dqbl.png';
import IconDqblDark from 'images/warninginfordetails/icon_dqbl_dark.png';
import IconCkq from 'images/warninginfordetails/icon_ckq.png';
import IconCkqDark from 'images/warninginfordetails/icon_ckq_dark.png';
import IconMxgl from 'images/warninginfordetails/icon_mxgl.png';
import IconMxglDark from 'images/warninginfordetails/icon_mxgl_dark.png';
import IconGlyj from 'images/warninginfordetails/icon_glyj.png';
import IconGlyjDark from 'images/warninginfordetails/icon_glyj_dark.png';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class PredictModel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 选择气泡框项
        this.handleItemSelect = this.handleItemSelect.bind(this);
    }
    handleItemSelect(item) {
        if (item.text === '当前变量') {
            !!this.props.onItemSelect && this.props.onItemSelect(item.tab);
        }
        if (item.text === '维护窗口') {
            !!this.props.onItemSelect && this.props.onItemSelect(item.tab);
        }
        if (item.text === '关联预警') {
            !!this.props.onItemSelect && this.props.onItemSelect(item.tab);
        }
        if (item.text === '模型管理') {
            !!this.props.onViewModelDetial && this.props.onViewModelDetial();
        }
    }
    render() {
        let predict = this.props.predict || {};

        let isDark = theme === 'dark';
        let bubbles = [{
            tab: 'variable',
            text: '当前变量',
            icon: isDark ? IconDqblDark : IconDqbl
        }, {
            tab: 'win',
            text: '维护窗口',
            icon: isDark ? IconCkqDark : IconCkq
        }, {
            tab: 'predict',
            text: '关联预警',
            icon: isDark ? IconGlyjDark : IconGlyj
        }, {
            tab: 'model',
            text: '模型管理',
            icon: isDark ? IconMxglDark : IconMxgl
        }];

        if (Constant.PROJECT !== 'wysengine') {
            // bubbles = bubbles.filter((item) => item.text != '关联预警');
        }

        return (
            <div className={style.box + ' flex-center'}>
                <span>{!Utils.isEmpty(predict) ? predict.PREDICT_MODEL_NAME : ''}</span>
                <div id='predictModelBubbleTrigger' className={'arrowDown ' + style.arrow}>
                    <Bubble
                        trigger={'predictModelBubbleTrigger'}
                        bubbles={bubbles}
                        onSelect={this.handleItemSelect} />
                </div>
            </div>
        );
    }
}

module.exports = PredictModel;
