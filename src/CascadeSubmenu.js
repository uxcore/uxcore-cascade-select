/**
* CascadeSelect Component for uxcore
* @author changming
*
* Copyright 2015-2016, Uxcore Team, Alinw.
* All rights reserved.
*/

const React = require('react');
const classnames = require('classnames');
const _ = require('underscore');
import SuperComponent from './SuperComponent';

class CascadeSubmenu extends SuperComponent {
  onItemClick(item, groupIndex) {
    if (this.props.onItemClick) {
      this.props.onItemClick(item.value, groupIndex, item);
    }
  }

  onItemHover(item, groupIndex) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(function(){
      if (this.props.onItemClick) {
        this.props.onItemClick(item.value, groupIndex, item);
      }
    }.bind(this), 400);
  }

  renderUlList(data, key, groupIndex) {
    const { expandTrigger } = this.props;
    return (
      data.map(item => {
        let otherProps = {};
        if (expandTrigger === 'click') {
          otherProps.onClick = this.onItemClick.bind(this, item, groupIndex);
        } else if (expandTrigger === 'hover') {
          otherProps.onMouseOver = this.onItemHover.bind(this, item, groupIndex);
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
      })
    );
  }

  renderSubmenus() {
    const { defaultValue, options, expandTrigger, cascadeSize } = this.props;

    if (defaultValue.length === 0) {
      return (
        <ul className={classnames({
            [this.prefixCls('hoverable')] : expandTrigger === 'hover'
          })}
        >
          {this.renderUlList(options, null, 0)}
        </ul>
      );
    }

    let renderArr = null;
    let prevSelected = null;
    return defaultValue.map((key, index) => {
      if (index === 0) {
        renderArr = options;
      } else {
        renderArr = prevSelected.children;
      }
      prevSelected = _.find(renderArr, item => item.value === key);
      if (renderArr) {
        return (
          <ul
            key={key}
            className={classnames({
              [this.prefixCls('hoverable')] : expandTrigger === 'hover' && index < cascadeSize - 1
            })}
          >
            {this.renderUlList(renderArr, key, index)}
          </ul>
        );
      }
      return null;
    });
  }

  render() {
    return (
      <div className={this.prefixCls('submenu')}>
        { /* <div className={this.prefixCls('submenu-border')}></div> */ }
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
  defaultValue: React.PropTypes.array,
  options: React.PropTypes.array,
};

CascadeSubmenu.defaultProps = {
  prefixCls: 'kuma-cascader',
  onItemClick: function(){},
  defaultValue: [],
  options: []
};

export default CascadeSubmenu;
