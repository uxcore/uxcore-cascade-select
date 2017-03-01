/**
* CascadeSelect Component for uxcore
* @author changming
*
* Copyright 2015-2016, Uxcore Team, Alinw.
* All rights reserved.
*/

import { find } from './util';

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
    const { value, options, expandTrigger, cascadeSize } = this.props;
    const submenu = [];
    const width = `${(100 / cascadeSize).toFixed()}%`;
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

  render() {
    return (
      <div className={this.prefixCls('submenu')}>
        <div className={this.prefixCls('submenu-wrap')}>
          {this.renderSubmenus()}
        </div>
      </div>
    );
  }
}

CascadeSubmenu.propTypes = {
  prefixCls: React.PropTypes.string,
  onItemClick: React.PropTypes.func,
  value: React.PropTypes.array,
  options: React.PropTypes.array,
};

CascadeSubmenu.defaultProps = {
  prefixCls: 'kuma-cascader',
  onItemClick() {},
  value: [],
  options: [],
};

export default CascadeSubmenu;
