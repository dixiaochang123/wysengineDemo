import React from 'react';
import Utils from 'utils/utils';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class CustomDropdownSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showMenus: false,
            searchKey: ''
        };

        // 隐藏菜单项
        this.hideMenus = this.hideMenus.bind(this);
        // 显示、隐藏菜单项
        this.toggleMenus = this.toggleMenus.bind(this);
        // 选择菜单项回调事件
        this.onSelectMenuItem = this.onSelectMenuItem.bind(this);
        // 处理搜索关键字变化
        this.handleSearchKeyChange = this.handleSearchKeyChange.bind(this);
    }
    hideMenus() {
        this.setState({
            showMenus: false
        });
    }
    toggleMenus() {
        $('.' + style.menusWrapper).addClass('none');
        this.setState({
            showMenus: !this.state.showMenus
        });
    }
    onSelectMenuItem(option) {
        let target = this.props.options.find(function(item) {
            return item.key == option.key;
        });
        !!this.props.onSelect && this.props.onSelect(target);
    }
    handleSearchKeyChange(event) {
        let val = event.target.value;
        this.setState({
            searchKey: val,
            showMenus: true
        });
    }
    render() {
        let searchKey = this.state.searchKey;
        let selectedKeys = this.props.selectedKeys;
        let availableOptions = !Utils.isEmpty(searchKey) ? this.props.options.filter(function(item) {
            return !!item.value && (item.value.indexOf(searchKey) != -1);
        }) : (this.props.options || []);

        let menus = availableOptions.map(function(menu) {
            let menuItemCls = selectedKeys.indexOf(menu.key) != -1 ? style.menuItemChecked : '';
            if (menu.isActive) {
                menuItemCls += (' ' + style.menuItemActive);
            }
            return (
                <li key={menu.key} data-key={menu.key.split('__')[0]} className={menuItemCls} onClick={this.onSelectMenuItem.bind(this, menu)}>
                    <span className={style.menuCheckbox}></span>
                    <span>{menu.value}</span>
                </li>
            );
        }.bind(this));

        let overlayCls = !!this.props.overlayCls ? this.props.overlayCls : '';
        let btnCls = style.button;

        return (
            <div className={overlayCls + ' ' + style.wrapper}>
                <div className={this.state.showMenus && this.props.isWrapperShow ? style.overlay : 'none'} onClick={this.hideMenus}></div>
                <div className={style.box}>
                    <input className={btnCls} value={this.state.searchKey} placeholder={this.props.placeholder} onChange={this.handleSearchKeyChange} onClick={this.toggleMenus} />
                    <div className={style.arrow}></div>
                </div>
                <div className={this.state.showMenus ? style.menusWrapper + ' ' + style.show : 'none'}>
                    <ul className={style.menus}>
                        {menus}
                    </ul>
                </div>
            </div>
        );
    }
}

module.exports = CustomDropdownSearch;
