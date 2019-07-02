import React from 'react';
import Utils from 'utils/utils';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 搜索条件
            searchKey: ''
        };

        // 处理点击搜索
        this.handleSearch = this.handleSearch.bind(this);
        // 处理搜索条件变化
        this.handleSearchKeyChange = this.handleSearchKeyChange.bind(this);
    }
    handleSearch() {
        this.props.onSearch && this.props.onSearch(this.state.searchKey);
    }
    handleSearchKeyChange(event) {
        let searchKey = event.target.value;
        this.setState({
            searchKey: searchKey
        });
    }
    render() {
        return (
            <div  className={style.box}>
                <input type='text' name='search' value={this.state.searchKey} onChange={this.handleSearchKeyChange} placeholder={this.props.placeholder || '请输入搜索关键字'} />
                <label htmlFor='search' className={style.label} onClick={this.handleSearch}>搜索</label>
            </div>
        );
    }
}

module.exports = Search;
