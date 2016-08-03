/**
* CascadeSelect Component for uxcore
* @author changming
*
* Copyright 2015-2016, Uxcore Team, Alinw.
* All rights reserved.
*/

const React = require('react');
const classnames = require('classnames');
const Dropdown = require('uxcore-dropdown');
import CascadeSubmenu from './CascadeSubmenu';
import SuperComponent from './SuperComponent';

let cascaderId = 1000;

class CascadeSelect extends SuperComponent {
  constructor(props) {
    super(props);
    const { defaultValue, options, value } = props;
    const selectedOptions = this.getSelectedOptions(props);
    this.state = {
      displayValue: value || defaultValue,
      value: value || defaultValue,
      selectedOptions,
    };
  }

  getSelectedOptions(props) {
    let selectedOptions = [];
    let {options, value, defaultValue} = props;
    let theValue = value || defaultValue;
    if (theValue.length) {
      let renderArr = null;
      let prevSelected = null;
      theValue.forEach((key, index) => {
        if (index === 0) {
          renderArr = options;
        } else {
          renderArr = prevSelected.children;
        }
        prevSelected = renderArr.find(item => item.value === key);
        if (renderArr) {
          selectedOptions[index] = prevSelected;
        }
      });
    }
    return selectedOptions;
  }

  componentWillReceiveProps(nextProps) {
    const {value, options} = nextProps;
    if (value) {
      const selectedOptions = this.getSelectedOptions(nextProps);
      this.setState({
        displayValue: value,
        value: value,
        selectedOptions,
      });
    }
  }

  onSubmenuItemClick(key, index, selectedOption) {
    const { value, selectedOptions} = this.state;
    const { onChange, changeOnSelect, cascadeSize } = this.props;
    let hideSubmenu = false;
    let newValue = value.slice(0, index);
    newValue.push(key);
    let newSelectedOptions = selectedOptions.slice(0, index);
    newSelectedOptions.push(selectedOption);
    if (newSelectedOptions.length >= cascadeSize) {
      hideSubmenu = true;
      this.refs.wrapper.click();
    }
    if (onChange) {
      onChange(newValue, newSelectedOptions);
    }
    if (changeOnSelect) {
      this.setState({
        displayValue: newValue,
        value: newValue,
        selectedOptions: newSelectedOptions,
      });
    } else if (hideSubmenu){
      this.setState({
        displayValue: newValue,
        value: newValue,
        selectedOptions: newSelectedOptions,
      });
    } else {
      this.setState({
        value: newValue,
        selectedOptions: newSelectedOptions,
      });
    }
  }

  clearContent() {
    const {onChange} = this.props;
    this.setState({
      displayValue: [],
      value : [],
      selectedOptions : []
    });
    if (onChange) {
      onChange([], []);
    }
  }

  onDropDownVisibleChange(visible) {
    const {disabled} = this.props;
    if (!disabled) {
      this.setState({showSubMenu:visible})
    }
  }

  renderContent() {
    const {
      placeholder,
      className,
      options,
      disabled,
      clearable,
      expandTrigger,
      cascadeSize,
      prefixCls
    } = this.props;
    const { value, selectedOptions, showSubMenu, displayValue } = this.state;
    return (
      <div
        id={++cascaderId}
        ref="wrapper"
        className={classnames({
          [this.prefixCls('wrapper')]: true,
          [className]: true,
          [this.prefixCls('disabled')]: disabled,
          [this.prefixCls('clearable')]: !disabled && clearable && displayValue.length > 0,
          // [this.prefixCls('hoverable')]: expandTrigger === 'hover'
        })}
      >
        <div className={this.prefixCls('text')}>
          <div className={this.prefixCls('trigger')}
          >
          {
            placeholder && !displayValue.length ?
            <div className={this.prefixCls('placeholder')}>
              {placeholder}
            </div> :
            null
          }
          {
            displayValue.length ?
            this.props.beforeRender(displayValue, selectedOptions) :
            null
          }
          </div>
        </div>
        <div
          className={classnames({
            [this.prefixCls('arrow')]: true,
            [this.prefixCls('arrow-reverse')]: showSubMenu,
          })}
        >
          <i className="kuma-icon kuma-icon-triangle-down"></i>
        </div>
        {
          <div
            className={this.prefixCls('close-wrap')}
          >
            <i onClick={this.clearContent.bind(this)} className="kuma-icon kuma-icon-error"></i>
          </div>
        }
      </div>
    )
  }

  render() {
    const {
      options,
      disabled,
      prefixCls,
      expandTrigger,
      cascadeSize
    } = this.props;
    const { value } = this.state;
    if (disabled) {
      return this.renderContent();
    }
    let submenu = <div />;
    if (options.length && !disabled) {
      submenu = (
        <CascadeSubmenu
          prefixCls={prefixCls}
          onItemClick={this.onSubmenuItemClick.bind(this)}
          options={options}
          value={value}
          expandTrigger={expandTrigger}
          cascadeSize={cascadeSize}
        />
      );
    }
    return (
      <Dropdown
        overlay={submenu}
        trigger={['click']}
        onVisibleChange={this.onDropDownVisibleChange.bind(this)}
      >
        {this.renderContent()}
      </Dropdown>
    );
  }

}

CascadeSelect.defaultProps = {
  prefixCls: 'kuma-cascader',
  className: '',
  placeholder: '请选择',
  options: [],
  defaultValue: [],
  value: null,
  onChange: (value, selectedOptions) => {},
  disabled: false,
  clearable: false,
  changeOnSelect: false,
  expandTrigger: 'click',
  cascadeSize: 3,
  beforeRender: (value, selectedOptions) => selectedOptions.map(o => o.label).join(' / '),
};

// http://facebook.github.io/react/docs/reusable-components.html
CascadeSelect.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  options: React.PropTypes.array,
  defaultValue: React.PropTypes.array,
  value: React.PropTypes.array,
  placeholder: React.PropTypes.string,
  onChange: React.PropTypes.func,
  disabled: React.PropTypes.bool,
  clearable: React.PropTypes.bool,
  changeOnSelect: React.PropTypes.bool,
  expandTrigger: React.PropTypes.string,
  beforeRender: React.PropTypes.func,
};

CascadeSelect.displayName = 'CascadeSelect';

module.exports = CascadeSelect;
