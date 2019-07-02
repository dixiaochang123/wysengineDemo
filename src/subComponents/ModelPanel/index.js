import React from 'react';
import Utils from 'utils/utils';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

import Bubble from 'subComponents/Bubble/index';

import ICON_LEVEL_ONE from 'images/models/icon_level_one.png';
import ICON_LEVEL_TWO from 'images/models/icon_level_two.png';
import ICON_LEVEL_THREE from 'images/models/icon_level_three.png';
import ICON_LEVEL_FOUR from 'images/models/icon_level_four.png';
import ICON_LEVEL_FIVE from 'images/models/icon_level_five.png';

const LEVEL_ICONS = {
    '一级': ICON_LEVEL_ONE,
    '二级': ICON_LEVEL_TWO,
    '三级': ICON_LEVEL_THREE,
    '四级': ICON_LEVEL_FOUR,
    '五级': ICON_LEVEL_FIVE
};

const SCREEN_TYPES = {
    ipad: {
        bubbleWidth: '13rem',
        bubbleItemHeight: 1.9
    },
    miniscreen: {
        bubbleWidth: '13rem',
        bubbleItemHeight: 1.9
    },
    smallscreen: {
        bubbleWidth: '13rem',
        bubbleItemHeight: 1.9
    },
    mediumscreen: {
        bubbleWidth: '13rem',
        bubbleItemHeight: 1.9
    },
    highmediumscreen: {
        bubbleWidth: '13rem',
        bubbleItemHeight: 1.9
    },
    basescreen: {
        bubbleWidth: '13rem',
        bubbleItemHeight: 1.9
    },
    bigscreen: {
        bubbleWidth: '20rem',
        bubbleItemHeight: 2.85
    },
    highscreen: {
        bubbleWidth: '20rem',
        bubbleItemHeight: 2.85
    },
    bigscreenmicrosoft: {
        bubbleWidth: '28rem',
        bubbleItemHeight: 3.8
    }
};

class ChartAlarmDistributionModel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 查看详情
        this.viewDetail = this.viewDetail.bind(this);
    }
    viewDetail(model) {
        let list = this.props.data.list;
        let targetModel = list.filter((item) => item.NAME === model.text);
        !!this.props.onViewDetail && this.props.onViewDetail(targetModel);
    }
    render() {
        let screenType = Utils.getScreenType();
        let bubbleWidth = SCREEN_TYPES[screenType].bubbleWidth;
        let bubbleItemHeight = SCREEN_TYPES[screenType].bubbleItemHeight;
        let data = this.props.data;

        let boxCls = style.box + ' tc';
        if (!!this.props.isFirst) {
            boxCls += (' ' + style.isFirst);
        }
        if (!!this.props.isLast) {
            boxCls += (' ' + style.isLast);
        }

        let bubbles = data.list.length > 0 ? data.list.map(function(item) {
            return {
                text: item.NAME
            };
        }) : null;

        let len = Math.min(data.list.length, 5)
        let bubblesMarginTop = -bubbleItemHeight * len + 'rem';
        let bubblesStyle = {
            marginTop: bubblesMarginTop
        };
        if (!!this.props.isLast) {
            bubblesStyle = Object.assign({}, bubblesStyle, {
                marginLeft: (1 - Math.abs(parseInt(bubbleWidth))) + 'rem'
            });
        }

        return (
            <div className={boxCls}>
                <div className={style.boxInner + ' full'}>
                    <div className={style.header + ' clearfix'}>
                        <span className={'left ' + style.title}>{data.list[0].LEVEL_NAME + '预警模型'}</span>
                        <div id={this.props.triggerId} className={'arrowDown right ' + style.arrow}>
                            <Bubble
                                width={bubbleWidth}
                                trigger={this.props.triggerId}
                                position={'top'}
                                bubbles={bubbles}
                                bubblesStyle={bubblesStyle}
                                onSelect={this.viewDetail} />
                        </div>
                    </div>
                    <div className={style.count}>
                        <img src={LEVEL_ICONS[data.list[0].LEVEL_NAME]} />
                        <span>{data.count}</span>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = ChartAlarmDistributionModel;
