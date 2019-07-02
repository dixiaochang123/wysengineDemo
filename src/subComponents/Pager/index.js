import React from 'react';
import Pagination from 'rc-pagination';
import style from './index.less';

class Pager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // 翻页回调
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    handlePageChange(currPage) {
        !!this.props.onPageChange && this.props.onPageChange(currPage);
    }
    render() {
        return (
            <div className={style.box + ' tc'}>
                <Pagination
                    simple
                    defaultCurrent={1}
                    total={this.props.pager.total}
                    pageSize={this.props.pager.pageSize}
                    onChange={this.handlePageChange}
                    current={this.props.pager.currPage}
                    showQuickJumper={{ goButton: true }} />
            </div>
        );
    }
}

module.exports = Pager;
