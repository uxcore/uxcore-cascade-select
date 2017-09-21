/**
* CascadeSelect Component for uxcore
* @author changming
*
* Copyright 2015-2017, Uxcore Team, Alinw.
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

  renderSubmenus() {
    const { value, options, expandTrigger, cascadeSize, miniMode } = this.props;
    const submenu = [];

    let width = `${(100 / cascadeSize).toFixed(1)}%`;
    if (!miniMode) {
      width = `${(100 / (cascadeSize + 1)).toFixed(1)}%`;
    }

    let style = { width };
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
        if (index + 1 >= cascadeSize - 1) {
          style = {
            width,
            border: 'none',
          };
        }

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
      if (!this.props.miniMode) {
        wrapStyle.width = this.props.columnWidth * (this.props.cascadeSize + 1);
      }
    }

    return (
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
  columnWidth: React.PropTypes.number,
  cascadeSize: React.PropTypes.number,
  size: React.PropTypes.oneOf(['large', 'middle', 'small']),
};

CascadeSubmenu.defaultProps = {
  prefixCls: 'kuma-cascader',
  onItemClick() { },
  value: [],
  options: [],
  miniMode: false,
  onOkButtonClick: () => { },
  size: 'large',
};

export default CascadeSubmenu;
