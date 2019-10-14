/*
 * File Created: 2019-04-04 20:08:56
 * Author: changming.zy (changming.zy@alibaba-inc.com)
 * Copyright 2019 Alibaba Group
 */
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
import { polyfill } from 'react-lifecycles-compat';
import Menu from 'uxcore-menu';
import i18n from './i18n';
import CascadeSubmenu from './CascadeSubmenu';
import SuperComponent from './SuperComponent';
import Search from './Search';
import Util from './util';

const {
  find,
  getArrayLeafItemContains,
  deepCopy,
  getOptions,
  stringify,
  searchArrayOfOptions,
  isEmptyArray,
} = Util;

const noop = function noop() { };

function getDomWidth(dom) {
  if (dom) {
    return parseFloat(getComputedStyle(dom).width);
  }
  return 0;
}

class CascadeSelect extends SuperComponent {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: [],
      selectedOptions: [],
      showSubMenu: false,
      loading: {},
      searchResult: [],
      inputValue: null,
      options: props.options.slice(),
      preOptions: props.options.slice(),
      value: props.value || props.defaultValue || [],
      preValue: props.value || [],
      loadedOptions: {},
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

    this.getSelectPlaceholder = props.getSelectPlaceholder
      || function getSelectPlaceholder() { return i18n[this.locale].placeholder; };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const { onSelect } = nextProps;
    let { options, value } = nextProps;
    if (!options) {
      options = [];
    }
    if (!value) {
      value = [];
    }
    let newState = {};
    let judgeValue = stringify(value) !== stringify(preState.preValue);
    const judgeOptions = stringify(options) !== stringify(preState.preOptions);

    if (preState.preValue && value && value.length
      && preState.preValue.length > value.length && preState.preValue.includes(value[0])
    ) {
      judgeValue = false;
    }

    if (judgeOptions) {
      newState.options = options;
      newState.preOptions = options;
      newState.loadedOptions = {};
    }
    if (judgeValue) {
      newState.value = value;
      newState.preValue = value;
    }
    if (judgeValue || judgeOptions) {
      if (!onSelect) {
        let theOptions = preState.options;
        if (newState && newState.options) {
          theOptions = newState.options;
        }
        const selectedOptions = CascadeSelect.getSelectedOptions(nextProps, { options: theOptions });
        const state = CascadeSelect.returnMultiState(selectedOptions) || {};
        if (newState && newState.options) {
          state.options = newState.options;
          state.preOptions = newState.preOptions;
          state.loadedOptions = newState.loadedOptions;
        }
        if (newState && newState.value) {
          // 判断计算得出的 state.value 是否包含 newState.value 的值
          // 如果 state.value 长度大于 newState.value 并且 newState.value 存在 state.value 中
          // 则说明是用户自主设置得某不确定的节点，并且此节点有值，此时使用 state.value 渲染才是正确的
          if (state.value.length > newState.value.length) {
            if (state.value.includes(newState.value[0])) {
              // do nothing
            } else {
              state.preValue = state.value;
              state.value = newState.value;
              state.displayValue = newState.value;
            }
          } else {
            state.preValue = state.value;
            state.value = newState.value;
            state.displayValue = newState.value;
          }
        }
        newState = state;
        if (!newState.preValue) {
          newState.preValue = newState.value;
        }
      }
    }
    return Object.keys(newState).length ? newState : null;
  }


  static getSelectedOptions(props, state) {
    let selectedOptions = [];
    const { value, defaultValue } = props;
    const { options } = state;
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

  componentDidMount() {
    this.setValue(this.props);
  }

  componentDidUpdate(preProps) {
    const { options, value } = preProps;
    const { onSelect } = this.props;
    const judgeValue = stringify((value && deepCopy(value))) !== stringify(deepCopy(this.props.value));
    const judgeOptions = stringify(options) !== stringify(this.props.options);
    if (
      onSelect && (judgeValue || judgeOptions)
    ) {
      this.getAsyncSelectedOptions(this.props, (selectedOptions) => {
        this.setMultiState(selectedOptions);
      });
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
    let node = this.state.options;
    const { loading } = this.state;
    if (this.state.loadedOptions[key]) {
      return Promise.resolve('n');
    }
    const { onSelect, cascadeSize } = this.props;
    if (onSelect && level < cascadeSize) {
      return new Promise((resolve, reject) => {
        loading[key] = true;
        this.setState({ loading });
        onSelect(resolve, reject, key, level);
      }).then((children) => {
        this.state.loadedOptions[key] = true;
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

  static returnMultiState(selectedOptions) {
    let value;
    if (selectedOptions && selectedOptions.length) {
      value = selectedOptions.map(item => item.value);
    }
    return {
      displayValue: value || [],
      value: value || [],
      selectedOptions,
    };
  }

  setValue(props) {
    const { onSelect } = props;
    if (onSelect) {
      this.getAsyncSelectedOptions(props, (selectedOptions) => {
        this.setMultiState(selectedOptions);
      });
    } else {
      const selectedOptions = CascadeSelect.getSelectedOptions(props, this.state);
      this.setMultiState(selectedOptions);
    }
  }

  getAsyncSelectedOptions(props, callback = noop) {
    let selectedOptions = [];
    const { value, defaultValue, cascadeSize } = props;
    const { options } = this.state;
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

  onSubmenuItemClick = (key, index, selectedOption, hasChildren) => {
    const { value, selectedOptions } = this.state;
    const {
      changeOnSelect, cascadeSize, miniMode, onSelect,
    } = this.props;
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
      inputValue: null,
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
        if ((value && (value.length >= cascadeSize || value.length === 0))
          || (selectedOptions
            && (
              (selectedOptions[selectedOptions.length - 1] && isEmptyArray(selectedOptions[selectedOptions.length - 1].children))
              || selectedOptions.length === 0
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
      showSearch,
      onSearch,
    } = this.props;

    const { selectedOptions, showSubMenu, displayValue } = this.state;

    let { placeholder } = this.props;
    if (!placeholder) {
      placeholder = i18n[this.locale].placeholder;
    }
    const displayText = displayValue.length
      ? this.props.beforeRender(displayValue, selectedOptions)
      : '';

    let cpnt = (
      <div
        className={this.prefixCls('trigger')}
        title={displayText}
      >
        {
          placeholder && !displayValue.length
            ? (
              <div className={this.prefixCls('placeholder')}>
                {placeholder}
              </div>
            )
            : displayText
        }
      </div>
    );

    if (this.props.displayMode === 'search' || this.props.showSearch) { // TODO: remove this.props.displayMode === 'search'
      cpnt = (
        <Search
          value={this.state.inputValue}
          text={displayText}
          disabled={disabled}
          placeholder={placeholder}
          searchOption={this.props.searchOption}
          showSearch={showSearch}
          onSearch={onSearch}
          onValueChange={(inputValue) => {
            this.setState({ inputValue, showSubMenu: true });
            if (this.props.onSearch) {
              this.props.onSearch(inputValue);
            }
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
    if (this.state.options) {
      return opt.map(optionItem => (
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
    const { value, loading, options } = this.state;
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
              onChange={(v) => {
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
              relLoading[i]
                ? <span className={this.prefixCls('select-loading')} />
                : null
            }
          </div>
        </div>
      ));
    }
    return (
      <div className={this.prefixCls('select-wrap')}>
        {back}
      </div>
    );
  }

  // @deprecated 废弃函数
  renderSearchResult() {
    const { options } = this.props;
    return Search.renderResult(this.state.searchResult, (item) => {
      const selectedOptions = CascadeSelect.getSelectedOptions({
        value: [item.value],
        options,
      }, this.state);
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

  /** 渲染快速搜索结果 https://github.com/uxcore/uxcore-cascade-select/issues/26 */
  renderFastResult() {
    const { options, inputValue } = this.state;
    let { displayValue } = this.state;
    const {
      optionFilterProps,
      optionFilterCount,
      showSearch,
      changeOnSelect,
      onSelect,
      cascadeSize,
    } = this.props;
    const data = searchArrayOfOptions({
      options,
      keywords: inputValue,
      filterProps: optionFilterProps,
      filterCount: optionFilterCount,
    });
    return (
      <Menu className={this.prefixCls('menu')}>
        {data.map(d => (
          <Menu.Item
            key={d.id}
            onClick={() => {
              this.setState({
                inputValue: null,
              });
              const selectedOptions = CascadeSelect.getSelectedOptions({ value: d.value }, this.state);
              this.setMultiState(selectedOptions);
              this.onValueChange(d.value, selectedOptions);
              if (showSearch) { // 如果存在异步加载，搜索选中之后自动调用异步加载
                if (onSelect && d.value.length < cascadeSize) {
                  if (!changeOnSelect) {
                    displayValue = [];
                  }
                  this.setState({
                    displayValue,
                  });
                  this.fetchOptions(d.value, d.value[d.value.length - 1], d.value.length);
                }
              }
            }}
          >
            <span
              dangerouslySetInnerHTML={{ // eslint-disable-line
                __html: d.label.replace(inputValue, str => `<span class="brand-danger">${str}</span>`),
              }}
            />
          </Menu.Item>
        ))}
      </Menu>
    );
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
      dropdownClassName,
      onSearch,
    } = this.props;
    const {
      value, loading, options, inputValue,
    } = this.state;
    if (disabled) {
      return this.renderContent();
    }
    let submenu = (
      <div
        className={this.prefixCls('submenu-empty')}
        style={columnWidth ? { width: columnWidth * this.props.cascadeSize } : null}
      />
    );
    let minOverlayWidthMatchTrigger = false;
    if (displayMode === 'search' && this.state.searchResult.length > 0) {
      submenu = this.renderSearchResult();
    } else if (options.length && !disabled && inputValue && !onSearch) {
      submenu = this.renderFastResult();
      minOverlayWidthMatchTrigger = true;
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
            if (this.props.isMustSelectLeaf) {
              if ((newValue && newValue.length < this.props.cascadeSize)
                && (newSelectedOptions
                && (newSelectedOptions[newSelectedOptions.length - 1] &&
                  !isEmptyArray(newSelectedOptions[newSelectedOptions.length - 1].children))
                )
              ) {
                return;
              }
            }
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
          columnWidth={
            this.props.columnWidth || (getDomWidth(this.wrapper) / this.props.cascadeSize)
          }
          size={this.props.size}
          loading={loading}
          className={`${this.prefixCls('submenu-warpper')} ${dropdownClassName}`}
          cascaderHeight={this.props.cascaderHeight}
        />
      );
    }
    return (
      <Dropdown
        overlay={submenu}
        trigger={['click']}
        onVisibleChange={this.onDropDownVisibleChange.bind(this)}
        getPopupContainer={getPopupContainer}
        minOverlayWidthMatchTrigger={minOverlayWidthMatchTrigger}
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
  defaultValue: null,
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
  dropdownClassName: '',
  showSearch: false,
  onSearch: null,
  optionFilterProps: ['label'],
  optionFilterCount: 20,
  cascaderHeight: 0,
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
  dropdownClassName: PropTypes.string,
  showSearch: PropTypes.bool,
  onSearch: PropTypes.func,
  optionFilterProps: PropTypes.arrayOf(PropTypes.string),
  optionFilterCount: PropTypes.number,
  cascaderHeight: PropTypes.number,
};

CascadeSelect.displayName = 'CascadeSelect';
polyfill(CascadeSelect);

CascadeSelect.CascadeSubmenu = ({ ...props }) => (
  <div className="kuma-cascader-submenu-warpper">
    <CascadeSubmenu
      prefixCls="kuma-dropdown-menu"
      {...props}
      onItemClick={(key, index) => {
        let { value } = props;
        if (!value) {
          value = [];
        } else {
          value = value.slice(0, index);
        }
        value[index] = key;
        props.onChange(value);
      }}
    />
  </div>
);
CascadeSelect.CascadeSubmenu.displayName = 'CascadeSelectCascadeSubmenu';

module.exports = CascadeSelect;
