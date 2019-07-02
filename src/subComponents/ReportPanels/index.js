import React from 'react';

import ReportPanel from 'subComponents/ReportPanel';

class ReportPanels extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 项目选择
        this.handleItemSelect = this.handleItemSelect.bind(this);
    }
    handleItemSelect(item) {
        this.props.onItemSelect && this.props.onItemSelect(item);
    }
    render() {
        let reports = this.props.reports || [];
        reports = reports.filter((item) => (item.REPORT_DATE != null || item.REPORT_DATE != undefined));
        let reportNodes = reports.length > 0 ? reports.map((item, index) =>
            <ReportPanel
                key={index}
                data={item}
                onItemSelect={this.handleItemSelect.bind(this, item)} />
        ) : null;
        return (
            <div>
                {reportNodes}
            </div>
        );
    }
}

module.exports = ReportPanels;
