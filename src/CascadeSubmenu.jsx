/**
* CascadeSelect Component for uxcore
* @author changming
*
* Copyright 2015-2017, Uxcore Team, Alinw.
* All rights reserved.
*/
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from 'uxcore-button';
import { find } from './util';
import i18n from './i18n';
import SuperComponent from './SuperComponent';

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

      if (item.value === key) {
        if (groupIndex === 0) {
          this.displayData = [item.label];
        } else {
          this.displayData[groupIndex] = item.label;
        }
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

  renderLoading() {
    return (
      <div className={`kuma-loading-s ${this.prefixCls('center-loading')}`} />
    );
  }

  renderSubmenus() {
    const { value, options, expandTrigger, cascadeSize, miniMode, loading } = this.props;
    const submenu = [];
    let columnSize = cascadeSize;
    if (!miniMode) {
      columnSize = cascadeSize + 1;
    }
    let unitWidth = `${(100 / columnSize).toFixed(1)}%`;
    const firstStyle = {};
    if (value && value.length > 0) {
      firstStyle.width = unitWidth;
    } else {
      firstStyle.width = '100%';
    }
    submenu.push(
      <ul
        className={classnames({
          [this.prefixCls('hoverable')]: expandTrigger === 'hover',
        })}
        key="firstMenu"
        style={firstStyle}
      >
        {this.renderUlList(options, value[0], 0)}
      </ul>
    );
    let prevSelected = null;
    value.forEach((key, index) => {
      const style = {};
      if (value && value.length > index + 1) {
        style.width = unitWidth;
      } else {
        style.width = `${((cascadeSize - value.length)/columnSize * 100).toFixed(1)}%`;
      }
      const parent = find(prevSelected || options, item => item.value === key);
      const renderArr = parent && parent.children;
      prevSelected = renderArr;
      if (renderArr || loading[key]) {
        submenu.push(
          <ul
            key={key}
            className={classnames({
              [this.prefixCls('hoverable')]: expandTrigger === 'hover' && index < cascadeSize - 1,
            })}
            style={style}
          >
            {
              loading[key] ? this.renderLoading() :
              this.renderUlList(renderArr, value[index + 1], index + 1)
            }
          </ul>
        );
      }
    });
    return submenu;
  }

  renderBottomBar() {
    const size = this.props.size;
    let btnSize = size === 'large' ? 'medium' : 'small';
    return (
      <div className={this.prefixCls('submenu-bottom-bar')}>
        <Button size={btnSize} onClick={this.props.onOkButtonClick}>
          {i18n[this.props.locale].confirm}
        </Button>
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
                <div key={idx} style={{ marginLeft: 12 * idx }}>
                  <i className="kuma-icon kuma-icon-chevron-right" /> {label}
                </div>
              ) :
              null
          }
        </div>
      </div>
    );
  }

  render() {
    const wrapStyle = {};
    if (this.props.columnWidth) {
      wrapStyle.width = this.props.columnWidth * this.props.cascadeSize;
      // if (!this.props.miniMode) {
      //   wrapStyle.width = this.props.columnWidth * (this.props.cascadeSize + 1);
      // }
    }
    return (
      <div className={this.props.className}>
        <div className={this.prefixCls(`submenu size-${this.props.size}`)} style={wrapStyle}>
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
      </div>
    );
  }
}

CascadeSubmenu.propTypes = {
  prefixCls: PropTypes.string,
  onItemClick: PropTypes.func,
  value: PropTypes.array,
  options: PropTypes.array,
  miniMode: PropTypes.bool,
  onOkButtonClick: PropTypes.func,
  columnWidth: PropTypes.number,
  cascadeSize: PropTypes.number,
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  className: PropTypes.string,
};

CascadeSubmenu.defaultProps = {
  prefixCls: 'kuma-cascader',
  onItemClick() { },
  value: [],
  options: [],
  miniMode: false,
  onOkButtonClick: () => { },
  size: 'large',
  className: '',
};

CascadeSubmenu.displayName = 'CascadeSubmenu';

export default CascadeSubmenu;
