/**
* CascadeSelect Component for uxcore
* @author changming.zy
*
* Copyright 2015-2017, Uxcore Team, Alinw.
* All rights reserved.
*/
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Dropdown from 'uxcore-dropdown';
import Select2 from 'uxcore-select2';
import i18n from './i18n';
import CascadeSubmenu from './CascadeSubmenu';
import SuperComponent from './SuperComponent';

import { find, getArrayLeafItemContains, deepCopy, getOptions } from './util';

class CascadeSelect extends SuperComponent {
  constructor(props) {
    super(props);
    let { value } = props;
    const { defaultValue } = props;
    const selectedOptions = this.getSelectedOptions(props);

    if (selectedOptions && selectedOptions.length) {
      value = selectedOptions.map(item => item.value);
    }

    this.state = {
      displayValue: value || defaultValue || [],
      value: value || defaultValue || [],
      selectedOptions,
      showSubMenu: false,
    };

    // 兼容老版本的locale code
    const { locale } = props;
    if (locale === 'zh_CN') {
      this.locale = 'zh-cn';
    } else if (locale === 'en_US') {
      this.locale = 'en-us';
    } else {
      this.locale = locale;
    }

    this.getSelectPlaceholder = props.getSelectPlaceholder ||
      function getSelectPlaceholder() { return i18n[this.locale].placeholder; };
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
    let { value } = nextProps;
    if (value && deepCopy(value) !== deepCopy(this.props.value)) {
      const selectedOptions = this.getSelectedOptions(nextProps);

      if (selectedOptions && selectedOptions.length) {
        value = selectedOptions.map(item => item.value);
      }

      this.setState({
        displayValue: value,
        value,
        selectedOptions,
      });
    }
  }

  onSubmenuItemClick(key, index, selectedOption, hasChildren) {
    const { value, selectedOptions } = this.state;
    const { changeOnSelect } = this.props;
    let { showSubMenu } = this.state;
    let hideSubmenu = false;
    const newValue = value.slice(0, index);
    newValue.push(key);
    const newSelectedOptions = selectedOptions.slice(0, index);
    newSelectedOptions.push(selectedOption);
    if (!hasChildren) {
      if (this.props.miniMode) {
        hideSubmenu = true;
        showSubMenu = false;
      }
    }

    if (!this.props.miniMode) { // 如果展示风格为复杂风格，则点击OK才进行onChange回调
      this.newValue = newValue;
      this.newSelectedOptions = newSelectedOptions;
    } else {
      this.onValueChange(newValue, newSelectedOptions);
    }

    let displayValue = newValue;
    if (!this.props.miniMode) {
      displayValue = [];
    }

    if (changeOnSelect) {
      this.setState({
        displayValue,
        value: newValue,
        selectedOptions: newSelectedOptions,
        showSubMenu,
      });
    } else if (hideSubmenu) {
      this.setState({
        displayValue,
        value: newValue,
        selectedOptions: newSelectedOptions,
        showSubMenu,
      });
    } else if (newValue.length >= this.props.cascadeSize) {
      this.setState({
        value: newValue,
        displayValue,
        selectedOptions: newSelectedOptions,
        showSubMenu,
      });
    } else {
      displayValue = [];
      this.setState({
        displayValue,
        value: newValue,
        selectedOptions: newSelectedOptions,
        showSubMenu,
      });
    }
  }

  onValueChange(value, selectedOptions) {
    const { onChange, isMustSelectLeaf, cascadeSize } = this.props;
    if (onChange) {
      if (isMustSelectLeaf) {
        if ((value && value.length >= cascadeSize) ||
          (selectedOptions &&
            !selectedOptions[selectedOptions.length - 1].hasOwnProperty('children')
          )
        ) {
          onChange(value, selectedOptions);
        }
      } else {
        onChange(value, selectedOptions);
      }
    }
  }

  clearContent(e) {
    e.stopPropagation();
    this.setState({
      displayValue: [],
      value: [],
      selectedOptions: [],
    });
    this.onValueChange([], []);
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
    } = this.props;

    const { selectedOptions, showSubMenu, displayValue } = this.state;

    let placeholder = this.props.placeholder;
    if (!placeholder) {
      placeholder = i18n[this.locale].placeholder;
    }

    const displayText = displayValue.length ?
      this.props.beforeRender(displayValue, selectedOptions) :
      '';

    return (
      <div
        ref={this.saveRef('wrapper')}
        className={classnames({
          [this.prefixCls('wrapper')]: true,
          [className]: true,
          [this.prefixCls('disabled')]: disabled,
          [this.prefixCls('clearable')]: !disabled && clearable && displayValue.length > 0,
          [this.prefixCls('focus')]: showSubMenu,
          [this.prefixCls(`size-${this.props.size}`)]: true,
        })}
      >
        <div className={this.prefixCls('text')}>
          <div
            className={this.prefixCls('trigger')}
            title={displayText}
          >
            {
              placeholder && !displayValue.length ?
                <div className={this.prefixCls('placeholder')}>
                  {placeholder}
                </div> :
                null
            }
            {displayText}
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

  renderSelect2Options(index, options) {
    const { value } = this.state;
    if (options) {
      const opt = getOptions(options, value, index);
      return opt.map((optionItem) => (
        <Select2.Option
          key={optionItem.value}
          value={`${optionItem.value}`}
        >
          {optionItem.label}
        </Select2.Option>
      ));
    }
    return null;
  }

  renderSelect() {
    const { value } = this.state;
    const { cascadeSize, options } = this.props;
    const back = [];
    for (let i = 0; i < cascadeSize; i++) {
      back.push((
        <div
          key={i}
          className={this.prefixCls('select-item-wrap')}
          style={{ width: `${(100 / cascadeSize).toFixed(1)}%` }}
        >
          <Select2
            showSearch={false}
            placeholder={this.getSelectPlaceholder(i)}
            getPopupContainer={this.props.getPopupContainer}
            value={value[i]}
            dropdownMatchSelectWidth={false}
            dropdownStyle={{
              width: this.props.columnWidth,
            }}
            onChange={v => {
              let stateValue = this.state.value;
              let selectedOptions = this.state.selectedOptions;
              if (i === 0) {
                stateValue = [v];
                selectedOptions = options.filter(item => `${item.value}_` === `${v}_`);
              } else {
                stateValue[i] = v;
                const selectedParent = selectedOptions[selectedOptions.length - 1];
                if (selectedParent.children) {
                  selectedOptions.push(
                    selectedParent.children.filter(item => `${item.value}_` === `${v}_`)[0]
                  );
                }
              }
              this.setState({ value: stateValue, selectedOptions }, () => {
                this.onValueChange(stateValue, selectedOptions);
              });
            }}
            size={this.props.size}
          >
            {this.renderSelect2Options(i, this.props.options)}
          </Select2>
        </div>
      ));
    }
    return <div className={this.prefixCls('select-wrap')}>{back}</div>;
  }

  render() {
    if (this.props.displayMode === 'select') {
      return this.renderSelect();
    }

    const {
      options,
      disabled,
      prefixCls,
      expandTrigger,
      cascadeSize,
      getPopupContainer,
      columnWidth,
    } = this.props;
    const { value } = this.state;
    if (disabled) {
      return this.renderContent();
    }
    let submenu = (
      <div
        className={this.prefixCls('submenu-empty')}
        style={columnWidth ? { width: columnWidth * this.props.cascadeSize } : null}
      />
    );
    if (options.length && !disabled) {
      submenu = (
        <CascadeSubmenu
          prefixCls={prefixCls}
          onItemClick={this.onSubmenuItemClick.bind(this)}
          options={options}
          value={value}
          expandTrigger={expandTrigger}
          cascadeSize={cascadeSize}
          locale={this.locale}
          miniMode={this.props.miniMode}
          onOkButtonClick={() => {
            this.wrapper.click();
            const newValue = this.newValue;
            const newSelectedOptions = this.newSelectedOptions;
            if (newValue && newSelectedOptions) {
              this.setState({
                value: newValue,
                displayValue: newValue,
                selectedOptions: newSelectedOptions,
              }, () => {
                delete this.newValue;
                delete this.newSelectedOptions;
                this.onValueChange(newValue, newSelectedOptions);
              });
            }
          }}
          columnWidth={this.props.columnWidth}
          size={this.props.size}
        />
      );
    }
    return (
      <Dropdown
        overlay={submenu}
        trigger={['click']}
        onVisibleChange={this.onDropDownVisibleChange.bind(this)}
        getPopupContainer={getPopupContainer}
        minOverlayWidthMatchTrigger={false}
        visible={this.state.showSubMenu}
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
  locale: 'zh-cn',
  miniMode: true,
  columnWidth: 100,
  displayMode: 'dropdown',
  getSelectPlaceholder: null,
  size: 'large',
  isMustSelectLeaf: false,
};

// http://facebook.github.io/react/docs/reusable-components.html
CascadeSelect.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.array,
  defaultValue: PropTypes.array,
  value: PropTypes.array,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  clearable: PropTypes.bool,
  changeOnSelect: PropTypes.bool,
  expandTrigger: PropTypes.string,
  beforeRender: PropTypes.func,
  locale: PropTypes.oneOf(['zh-cn', 'en-us', 'zh_CN', 'en_US']),
  miniMode: PropTypes.bool,
  columnWidth: PropTypes.number,
  displayMode: PropTypes.oneOf(['dropdown', 'select']),
  getSelectPlaceholder: PropTypes.func,
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  isMustSelectLeaf: PropTypes.bool,
};

CascadeSelect.displayName = 'CascadeSelect';

module.exports = CascadeSelect;
