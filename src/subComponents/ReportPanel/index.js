import React from 'react';
import Utils from 'utils/utils';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class ReportPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 处理报告选择
        this.handleItemSelect = this.handleItemSelect.bind(this);
    }
    handleItemSelect(item) {
        !!this.props.onItemSelect && this.props.onItemSelect(item);
    }
    render() {
        let data = this.props.data;
        return (
            <div className={!data.isSelected ? style.box : style.boxActive} onClick={this.handleItemSelect.bind(this, data)}>
                {data.time}
            </div>
        );
    }
}

module.exports = ReportPanel;
