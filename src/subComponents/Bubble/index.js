import React from 'react';
import Utils from 'utils/utils';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

const SCREEN_TYPES = {
    ipad: {
        bubbleTop: '-1rem'
    },
    miniscreen: {
        bubbleTop: '-1rem'
    },
    smallscreen: {
        bubbleTop: '-1rem'
    },
    mediumscreen: {
        bubbleTop: '-1rem'
    },
    highmediumscreen: {
        bubbleTop: '-1rem'
    },
    basescreen: {
        bubbleTop: '-1rem'
    },
    bigscreen: {
        bubbleTop: '-1.5rem'
    },
    highscreen: {
        bubbleTop: '-1.5rem'
    },
    bigscreenmicrosoft: {
        bubbleTop: '-2rem'
    }
};

class Bubble extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        };

        // 显示隐藏气泡框
        this.toggleBubble = this.toggleBubble.bind(this);
        // 选中气泡框项
        this.handleItemSelect = this.handleItemSelect.bind(this);
    }
    componentDidMount() {
        let trigger = document.getElementById(this.props.trigger);
        trigger.addEventListener('click', function() {
            this.toggleBubble();
        }.bind(this));
    }
    toggleBubble() {
        let show = this.state.show;
        this.setState({
            show: !show
        });
        return false;
    }
    handleItemSelect(bubble) {
        !!this.props.onSelect && this.props.onSelect(bubble);
    }
    render() {
        let bubbles = this.props.bubbles || [];

        let bubbleArrowCls = style.bubblesArrow;
        let bubblesStyle = {};
        if (!!this.props.position && this.props.position === 'top') {
            bubbleArrowCls += (' ' + style.top);

            let screenType = Utils.getScreenType();
            let bubbleTop = SCREEN_TYPES[screenType].bubbleTop;
            bubblesStyle = {
                top: bubbleTop
            };
        }

        if (!!this.props.width) {
            bubblesStyle = Object.assign({}, {
                width: this.props.width,
                marginLeft: -(parseInt(this.props.width) / 2) + 'rem'
            }, bubblesStyle);
        }
        if (!!this.props.bubblesStyle) {
            bubblesStyle = Object.assign({}, bubblesStyle, this.props.bubblesStyle)
        }

        let bubbleNodes = bubbles.map(function(bubble, index) {
            return (
                <div key={'bubble_' + bubble.text + '_' + index} className={style.bubble} onClick={this.handleItemSelect.bind(this, bubble)}>
                    {!!bubble.icon ?
                    <img src={bubble.icon} /> : null}
                    <span>{bubble.text}</span>
                </div>
            );
        }.bind(this));

        return (
            <div className={this.state.show ? '' : 'none'}>
                <div className={style.overlay}></div>
                <div className={bubbleArrowCls}></div>
                <div className={style.bubbles} style={bubblesStyle}>
                    <div className={style.bubblesInner}>
                        {bubbleNodes}
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Bubble;
