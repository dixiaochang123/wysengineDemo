import React from 'react';
import Utils from 'utils/utils';
import Dropdown from 'rc-dropdown';
import Menu, {
    Item as MenuItem
} from 'rc-menu';

let theme = Utils.getTheme();
let style = require('./' + theme + '.less');

class CustomDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedValue: '',
            selectedKey: ''
        };

        // 选择菜单项回调事件
        this.onSelectMenuItem = this.onSelectMenuItem.bind(this);
    }
    componentDidMount() {
        let option = this.props.options.length > 0 ? this.props.options[0] : {
            key: '',
            value: ''
        };
        let selectedItem = this.props.selectedItem;
        this.setState({
            selectedValue: !!selectedItem ? selectedItem.value : option.value,
            selectedKey: !!selectedItem ? selectedItem.key : option.key
        });
    }
    componentWillUpdate(nextProps) {
        if (!!nextProps.selectedItem && nextProps.selectedItem.key != this.props.selectedItem.key) {
            this.setState({
                selectedValue: nextProps.selectedItem.value,
                selectedKey: nextProps.selectedItem.key
            });
        }
    }
    onSelectMenuItem(option) {
        let target = this.props.options.find(function(item) {
            return item.key == option.key;
        });
        this.setState({
            selectedValue: !!target ? target.value : option.value,
            selectedKey: !!target ? target.key : option.key
        });
        !!this.props.onSelect && this.props.onSelect(target);
    }
    render() {
        let isInModal = this.props.isInModal;
        let isDisabled = this.props.isDisabled || (!!this.props.options && this.props.options.length == 0);
        let options = this.props.options.length > 0 ? this.props.options.map((item) => <MenuItem key={item.key}>{item.value}</MenuItem>) : [];
        let menu = options.length > 0 ? (
            <Menu
                onSelect={this.onSelectMenuItem}
                selectedKeys={!!this.props.selectedKeys ? this.props.selectedKeys : ['' + this.state.selectedKey]}>
                {options}
            </Menu>
        ) : '';

        if (this.props.isMultiple == true && options.length > 0) {
            menu = (
                <Menu
                    multiple
                    onSelect={this.onSelectMenuItem}
                    onDeselect={this.onSelectMenuItem}
                    selectedKeys={!!this.props.selectedKeys ? this.props.selectedKeys : []}>
                    {options}
                </Menu>
            );
        }

        let overlayCls = !!this.props.overlayCls ? this.props.overlayCls : '';
        let btnCls = style.button;
        if (isInModal) {
            btnCls += (' ' + style.buttonModal);
        }
        if (isDisabled) {
            btnCls += (' ' + style.buttonDisabled);
        }
        if (!!this.props.btnCls) {
            btnCls += (' ' + this.props.btnCls);
        }

        let inputText = this.state.selectedValue;
        if (this.props.isMultiple == true && this.props.options.length > 0 && !!this.props.selectedKeys) {
            let selectedOptions = this.props.options.filter((item) => this.props.selectedKeys.indexOf(item.key) != -1);
            let selectedOptionValues = selectedOptions.map((item) => item.value);
            inputText = selectedOptionValues.join('、');
            if (selectedOptionValues[0] == '全部风场') {
                inputText = '全部风场';
            }
        }

        return (
            <Dropdown
                overlay={menu}
                animation='slide-up'
                overlayClassName={overlayCls}
                trigger={isDisabled ? [] : ['click']}>
                <div className={btnCls}>{inputText}</div>
            </Dropdown>
        );
    }
}

module.exports = CustomDropdown;
