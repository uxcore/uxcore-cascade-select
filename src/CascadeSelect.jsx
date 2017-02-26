/**
* CascadeSelect Component for uxcore
* @author changming
*
* Copyright 2015-2016, Uxcore Team, Alinw.
* All rights reserved.
*/
import React from 'react';
import classnames from 'classnames';
import Dropdown from 'uxcore-dropdown';

import CascadeSubmenu from './CascadeSubmenu';
import SuperComponent from './SuperComponent';

import { find, i18n, getArrayLeafItemContains } from './util';

class CascadeSelect extends SuperComponent {
  constructor(props) {
    super(props);
    const { defaultValue, value } = props;
    const selectedOptions = this.getSelectedOptions(props);
    this.state = {
      displayValue: value || defaultValue,
      value: value || defaultValue,
      selectedOptions,
    };
  }

  saveRef(refName) {
    const me = this;
    return (c) => {
      me[refName] = c;
    };
  }

  getSelectedOptions(props) {
    let selectedOptions = [];
    const { options, value, defaultValue } = props;
    const theValue = value || defaultValue;
    if (theValue && theValue.length > 1) {
      let renderArr = null;
      let prevSelected = null;
      for (let i = 0, l = theValue.length; i < l; i++) {
        if (i === 0) {
          renderArr = options;
        } else {
          renderArr = prevSelected && prevSelected.children;
        }
        prevSelected = find(renderArr, item => item.value === theValue[i]);
        if (renderArr && prevSelected) {
          selectedOptions[i] = prevSelected;
        } else {
          selectedOptions = [];
          break;
        }
      }
    } else if (theValue && theValue.length === 1) {
      selectedOptions = getArrayLeafItemContains(options, theValue);
    }
    return selectedOptions;
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (value) {
      const selectedOptions = this.getSelectedOptions(nextProps);
      this.setState({
        displayValue: value,
        value,
        selectedOptions,
      });
    }
  }

  onSubmenuItemClick(key, index, selectedOption, hasChildren) {
    const { value, selectedOptions } = this.state;
    const { onChange, changeOnSelect } = this.props;
    let hideSubmenu = false;
    const newValue = value.slice(0, index);
    newValue.push(key);
    const newSelectedOptions = selectedOptions.slice(0, index);
    newSelectedOptions.push(selectedOption);
    if (!hasChildren) {
      hideSubmenu = true;
      this.wrapper.click();
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
    } else if (hideSubmenu) {
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

  clearContent(e) {
    e.stopPropagation();
    const { onChange } = this.props;
    this.setState({
      displayValue: [],
      value: [],
      selectedOptions: [],
    });
    if (onChange) {
      onChange([], []);
    }
  }

  onDropDownVisibleChange(visible) {
    const { disabled } = this.props;
    if (!disabled) {
      this.setState({ showSubMenu: visible });
    }
  }

  renderContent() {
    const {
      className,
      disabled,
      clearable,
      locale,
    } = this.props;
    const { selectedOptions, showSubMenu, displayValue } = this.state;

    let placeholder = this.props.placeholder;
    if (!placeholder) {
      placeholder = i18n('placeholder', locale);
    }

    return (
      <div
        ref={this.saveRef('wrapper')}
        className={classnames({
          [this.prefixCls('wrapper')]: true,
          [className]: true,
          [this.prefixCls('disabled')]: disabled,
          [this.prefixCls('clearable')]: !disabled && clearable && displayValue.length > 0,
          // [this.prefixCls('hoverable')]: expandTrigger === 'hover'
        })}
      >
        <div className={this.prefixCls('text')}>
          <div
            className={this.prefixCls('trigger')}
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
          <i className="kuma-icon kuma-icon-triangle-down" />
        </div>
        {
          <div
            className={this.prefixCls('close-wrap')}
          >
            <i onClick={this.clearContent.bind(this)} className="kuma-icon kuma-icon-error" />
          </div>
        }
      </div>
    );
  }

  render() {
    const {
      options,
      disabled,
      prefixCls,
      expandTrigger,
      cascadeSize,
      getPopupContainer,
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
        getPopupContainer={getPopupContainer}
      >
        {this.renderContent()}
      </Dropdown>
    );
  }

}

CascadeSelect.defaultProps = {
  prefixCls: 'kuma-cascader',
  className: '',
  placeholder: '',
  options: [],
  defaultValue: [],
  value: null,
  onChange: () => { },
  disabled: false,
  clearable: false,
  changeOnSelect: false,
  expandTrigger: 'click',
  cascadeSize: 3,
  beforeRender: (value, selectedOptions) => {
    if (selectedOptions.length) {
      return selectedOptions.map(o => o && o.label).join(' / ');
    }
    return value.join('/');
  },
  locale: 'zh_CN',
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
  locale: React.PropTypes.oneOf(['zh_CN', 'en_US']),
};

CascadeSelect.displayName = 'CascadeSelect';

module.exports = CascadeSelect;
