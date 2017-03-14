/**
* CascadeSelect Component for uxcore
* @author changming
*
* Copyright 2015-2016, Uxcore Team, Alinw.
* All rights reserved.
*/

import { find } from './util';
import Button from 'uxcore-button';
import i18n from './i18n';

const React = require('react');
const classnames = require('classnames');
const SuperComponent = require('./SuperComponent');

const isNotEmpty = (arr) => {
  if (arr instanceof Array) {
    return arr.length;
  }
  return false;
};

class CascadeSubmenu extends SuperComponent {
  onItemClick(item, groupIndex, hasChildren) {
    if (this.props.onItemClick) {
      this.props.onItemClick(item.value, groupIndex, item, hasChildren);
    }
  }

  onItemHover(item, groupIndex, hasChildren) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.props.onItemClick) {
        this.props.onItemClick(item.value, groupIndex, item, hasChildren);
      }
    }, 400);
  }

  renderUlList(data, key, groupIndex) {
    const { expandTrigger } = this.props;
    return data.map(item => {
      const otherProps = {};
      if (expandTrigger === 'click') {
        otherProps.onClick =
          this.onItemClick.bind(this, item, groupIndex, isNotEmpty(item.children));
      } else if (expandTrigger === 'hover') {
        otherProps.onMouseOver =
          this.onItemHover.bind(this, item, groupIndex, isNotEmpty(item.children));
      }

      if (!this.displayData) {
        this.displayData = [];
      }

      if (item.value === key) {
        this.displayData[groupIndex] = item.label;
      }

      return (
        <li
          key={item.value}
          title={item.label}
          className={classnames({ active: item.value === key })}
          {...otherProps}
        >
          {item.label}
        </li>
      );
    });
  }

  renderSubmenus() {
    const { value, options, expandTrigger, cascadeSize, miniMode } = this.props;
    const submenu = [];

    let width = `${(100 / cascadeSize).toFixed(1)}%`;
    if (!miniMode) {
      width = `${(100 / (cascadeSize + 1)).toFixed(1)}%`;
    }

    const style = { width };
    submenu.push(
      <ul
        className={classnames({
          [this.prefixCls('hoverable')]: expandTrigger === 'hover',
        })}
        key="firstMenu"
        style={style}
      >
        {this.renderUlList(options, value[0], 0)}
      </ul>
    );

    let prevSelected = null;
    value.forEach((key, index) => {
      const parent = find(prevSelected || options, item => item.value === key);
      const renderArr = parent && parent.children;
      prevSelected = renderArr;
      if (renderArr) {
        submenu.push(
          <ul
            key={key}
            className={classnames({
              [this.prefixCls('hoverable')]: expandTrigger === 'hover' && index < cascadeSize - 1,
            })}
            style={style}
          >
            {this.renderUlList(renderArr, value[index + 1], index + 1)}
          </ul>
        );
      }
    });
    return submenu;
  }

  renderBottomBar() {
    return (
      <div className={this.prefixCls('submenu-bottom-bar')}>
        <Button onClick={this.props.onOkButtonClick}>{i18n[this.props.locale].confirm}</Button>
      </div>
    );
  }

  renderAllSelection() {
    const width = `${(100 / (this.props.cascadeSize + 1)).toFixed(1)}%`;
    return (
      <div style={{ width }} className={this.prefixCls('submenu-all-selection')}>
        <div className={this.prefixCls('submenu-all-selection-title')}>
          {i18n[this.props.locale].alreadyChoosed}
        </div>
        <div className={this.prefixCls('submenu-all-body')}>
          {
            this.displayData ?
              this.displayData.map((label, idx) =>
                <div style={{ marginLeft: 12 * idx }}>
                  <i className="kuma-icon kuma-icon-triangle-right" /> {label}
                </div>
              ) :
              null
          }
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={this.prefixCls('submenu')}>
        <div className={this.prefixCls('submenu-wrap')}>
          {this.renderSubmenus()}

          {
            this.props.miniMode ? null :
              this.renderAllSelection()
          }
        </div>
        {
          this.props.miniMode ? null :
            this.renderBottomBar()
        }
      </div>
    );
  }
}

CascadeSubmenu.propTypes = {
  prefixCls: React.PropTypes.string,
  onItemClick: React.PropTypes.func,
  value: React.PropTypes.array,
  options: React.PropTypes.array,
  miniMode: React.PropTypes.bool,
  onOkButtonClick: React.PropTypes.func,
};

CascadeSubmenu.defaultProps = {
  prefixCls: 'kuma-cascader',
  onItemClick() { },
  value: [],
  options: [],
  miniMode: false,
  onOkButtonClick: () => { },
};

export default CascadeSubmenu;
