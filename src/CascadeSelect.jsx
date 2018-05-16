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
import Promise from 'lie';
import i18n from './i18n';
import CascadeSubmenu from './CascadeSubmenu';
import SuperComponent from './SuperComponent';
import Search from './Search';

import { find, getArrayLeafItemContains, deepCopy, getOptions } from './util';

const noop = function noop() {};
class CascadeSelect extends SuperComponent {
  constructor(props) {
    super(props);
    const { options } = props;
    this.options = options.slice();
    this.loadedOptions = {};
    this.state = {
      displayValue: [],
      value: [],
      selectedOptions: [],
      showSubMenu: false,
      loading: {},
      searchResult: [],
      inputValue: null,
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

  componentDidMount() {
    this.setValue(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { options, value } = nextProps;
    if (options !== this.props.options) {
      this.options = options;
      this.loadedOptions = {};
    }
    if ((value && deepCopy(value) !== deepCopy(this.props.value)) ||
      (options !== this.props.options)) {
      this.setValue(nextProps);
    }
  }

  saveRef(refName) {
    const me = this;
    return (c) => {
      me[refName] = c;
    };
  }
  /**
   * 获取options， 下面为请求第二层数据时的参数参考
   * @param {*} values 当前的values值， 如['jiangsu']
   * @param {*} key 请求的key值， 如'jiangsu'
   * @param {*} level 请求的层数， 如 1
   */
  fetchOptions(values, key, level) {
    let node = this.options;
    const { loading } = this.state;
    if (this.loadedOptions[key]) {
      return Promise.resolve('n');
    }
    const { onSelect, cascadeSize } = this.props;
    if (onSelect && level < cascadeSize) {
      return new Promise((resolve, reject) => {
        loading[key] = true;
        this.setState({ loading });
        onSelect(resolve, reject, key, level);
      }).then((children) => {
        this.loadedOptions[key] = true;
        values.forEach((value, index) => {
          if (index + 1 > level) {
            return;
          }
          node = find(node, item => item.value === value);
          if (node.children) {
            node = node.children;
          }
        });
        node.children = children;
        loading[key] = false;
        this.setState({ loading });
        return 'y';
      }).catch(() => {
        loading[key] = false;
        this.setState({ loading });
      });
    }
    return Promise.resolve('n');
  }

  setMultiState(selectedOptions) {
    let value;
    if (selectedOptions && selectedOptions.length) {
      value = selectedOptions.map(item => item.value);
    }
    this.setState({
      displayValue: value || [],
      value: value || [],
      selectedOptions,
    });
  }

  setValue(props) {
    const { onSelect } = props;
    if (onSelect) {
      this.getAsyncSelectedOptions(props, (selectedOptions) => {
        this.setMultiState(selectedOptions);
      });
    } else {
      const selectedOptions = this.getSelectedOptions(props);
      this.setMultiState(selectedOptions);
    }
  }

  getAsyncSelectedOptions(props, callback = noop) {
    let selectedOptions = [];
    const { value, defaultValue, cascadeSize } = props;
    const { options } = this;
    const theValue = value || defaultValue;
    let renderArr = null;
    let prevSelected = null;
    const recursive = (i = 0) => {
      const len = theValue.length;
      if (len === 0) { 
        callback.call(this, selectedOptions);
        return;
      }
      if (i === 0) {
        renderArr = options;
      } else {
        renderArr = prevSelected && prevSelected.children;
      }
      if (!renderArr && i < cascadeSize) {
        this.fetchOptions(theValue.slice(0, i), theValue[i - 1], i)
          .then(() => {
            renderArr = prevSelected && prevSelected.children;
            internalExecute.call(this, i, len); // eslint-disable-line
          });
      } else {
        internalExecute.call(this, i, len); // eslint-disable-line
      }
    };
    function internalExecute(i, len) {
      prevSelected = find(renderArr, item => item.value === theValue[i]);
      if (renderArr && prevSelected) {
        selectedOptions[i] = prevSelected;
        if (i + 1 === len) {
          callback.call(this, selectedOptions);
        } else {
          recursive(i + 1);
        }
      } else {
        selectedOptions = [];
        callback.call(this, selectedOptions);
      }
    }
    recursive();
  }

  getSelectedOptions(props) {
    let selectedOptions = [];
    const { value, defaultValue } = props;
    const { options } = this;
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

  onSubmenuItemClick = (key, index, selectedOption, hasChildren) => {
    const { value, selectedOptions } = this.state;
    const { changeOnSelect, cascadeSize, miniMode, onSelect } = this.props;
    let { showSubMenu } = this.state;
    let hideSubmenu = false;
    const newValue = value.slice(0, index);
    newValue.push(key);
    const newSelectedOptions = selectedOptions.slice(0, index);
    newSelectedOptions.push(selectedOption);

    if (!miniMode) { // 如果展示风格为复杂风格，则点击OK才进行onChange回调
      this.newValue = newValue;
      this.newSelectedOptions = newSelectedOptions;
    } else {
      this.onValueChange(newValue, newSelectedOptions);
    }

    let displayValue = newValue;
    if (!miniMode) {
      displayValue = [];
    }

    this.setState({
      value: newValue,
      selectedOptions: newSelectedOptions,
    });
    if (onSelect && (!hasChildren && (index + 1) < cascadeSize)) {
      if (!changeOnSelect) {
        displayValue = [];
      }
      this.setState({
        displayValue,
      });
      this.fetchOptions(newValue, key, (index + 1));
    } else {
      if (!hasChildren || (index + 1) >= cascadeSize) {
        if (miniMode) {
          hideSubmenu = true;
          showSubMenu = false;
        }
      }
      // 如果还没选完整,displayValue置空
      if (!(changeOnSelect || hideSubmenu || (newValue.length >= cascadeSize))) {
        displayValue = [];
      }
      this.setState({
        displayValue,
        showSubMenu,
      });
    }
  }

  onValueChange(value, selectedOptions) {
    const { onChange, isMustSelectLeaf, cascadeSize } = this.props;
    if (onChange) {
      if (isMustSelectLeaf) {
        if ((value && (value.length >= cascadeSize || value.length === 0)) ||
          (selectedOptions &&
            (
              (selectedOptions[selectedOptions.length - 1] && !selectedOptions[selectedOptions.length - 1].hasOwnProperty('children')) ||
              selectedOptions.length === 0
            )
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
      inputValue: null,
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

    let cpnt = (
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
    );

    if (this.props.displayMode === 'search') {
      cpnt = (
        <Search
          value={this.state.inputValue}
          text={displayText}
          disabled={disabled}
          placeholder={placeholder}
          searchOption={this.props.searchOption}
          onValueChange={(inputValue) => {
            this.setState({ inputValue });
          }}
          onSearchResultChange={(searchResult) => {
            this.setState({ searchResult, showSubMenu: true });
          }}
        />
      );
    }

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
          {cpnt}
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

  renderSelect2Options(opt) {
    if (this.options) {
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
    const { value, loading } = this.state;
    const { options } = this;
    const { cascadeSize } = this.props;
    const back = [];
    const relLoading = {};
    for (let i = 0; i < cascadeSize; i++) {
      const opt = getOptions(options, value, i);
      if (loading[value[i]]) {
        relLoading[i + 1] = true;
      }
      back.push((
        <div
          key={i}
          className={this.prefixCls('select-item-wrap')}
          style={{ width: `${(100 / cascadeSize).toFixed(1)}%` }}
        >
          <div className={this.prefixCls('internal-select-item-wrap')}>
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
                  selectedOptions[i] = opt.filter(item => `${item.value}_` === `${v}_`)[0];
                  stateValue = stateValue.slice(0, i + 1);
                  selectedOptions = selectedOptions.slice(0, i + 1);
                }
                if (!(selectedOptions[i].children && selectedOptions[i].children.length)) {
                  this.fetchOptions(stateValue, v, i + 1);
                }
                this.setState({ value: stateValue, selectedOptions }, () => {
                  this.onValueChange(stateValue, selectedOptions);
                });
              }}
              size={this.props.size}
            >
              {this.renderSelect2Options(opt)}
            </Select2>
            {
              relLoading[i] ?
                <span className={this.prefixCls('select-loading')} /> :
                null
            }
          </div>
        </div>
      ));
    }
    return <div className={this.prefixCls('select-wrap')}>{back}</div>;
  }

  renderSearchResult() {
    const { options } = this.props;
    return Search.renderResult(this.state.searchResult, (item) => {
      const selectedOptions = this.getSelectedOptions({
        value: [item.value],
        options,
      });
      let val = [];
      if (selectedOptions && selectedOptions.length) {
        val = selectedOptions.map(i => i.value);
      }
      this.setState({
        inputValue: null,
        searchResult: [],
        displayValue: val,
        value: val,
        selectedOptions,
      }, () => {
        this.props.onChange(val, selectedOptions);
      });
    });
  }

  getDomWidth(dom) {
    if (dom) {
      return parseFloat(getComputedStyle(dom).width);
    } else {
      return 0;
    }
  }

  render() {
    if (this.props.displayMode === 'select') {
      return this.renderSelect();
    }

    const {
      disabled,
      prefixCls,
      expandTrigger,
      cascadeSize,
      getPopupContainer,
      columnWidth,
      displayMode,
    } = this.props;
    const { options } = this;
    const { value, loading } = this.state;
    if (disabled) {
      return this.renderContent();
    }
    let submenu = (
      <div
        className={this.prefixCls('submenu-empty')}
        style={columnWidth ? { width: columnWidth * this.props.cascadeSize } : null}
      />
    );
    if (displayMode === 'search' && this.state.searchResult.length > 0) {
      submenu = this.renderSearchResult();
    } else if (options.length && !disabled) {
      submenu = (
        <CascadeSubmenu
          prefixCls={prefixCls}
          onItemClick={this.onSubmenuItemClick}
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
                inputValue: null,
              }, () => {
                delete this.newValue;
                delete this.newSelectedOptions;
                this.onValueChange(newValue, newSelectedOptions);
              });
            }
          }}
          columnWidth={this.props.columnWidth || this.getDomWidth(this.wrapper) / this.props.cascadeSize}
          size={this.props.size}
          loading={loading}
          className={this.prefixCls('submenu-warpper')}
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
  columnWidth: null,
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
  displayMode: PropTypes.oneOf(['dropdown', 'select', 'search']),
  getSelectPlaceholder: PropTypes.func,
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  isMustSelectLeaf: PropTypes.bool,
};

CascadeSelect.displayName = 'CascadeSelect';

module.exports = CascadeSelect;
