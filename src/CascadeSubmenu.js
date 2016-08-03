/**
* CascadeSelect Component for uxcore
* @author changming
*
* Copyright 2015-2016, Uxcore Team, Alinw.
* All rights reserved.
*/

const React = require('react');
const classnames = require('classnames');
const SuperComponent = require('./SuperComponent');

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
    return data.map(item => {
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
    });
  }

  renderSubmenus() {
    const { value, options, expandTrigger, cascadeSize } = this.props;
    const submenu = []
    submenu.push(
      <ul 
        className={classnames({
          [this.prefixCls('hoverable')] : expandTrigger === 'hover'
        })}
        key="firstMenu"
      >
        {this.renderUlList(options, value[0], 0)}
      </ul>
    );

    let prevSelected = null;
    value.forEach((key, index) => {
      const renderArr = (prevSelected || options).find(item => item.value === key).children;
      prevSelected = renderArr;
      if (renderArr) {
        submenu.push(
          <ul
            key={key}
            className={classnames({
              [this.prefixCls('hoverable')] : expandTrigger === 'hover' && index < cascadeSize - 1
            })}
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
  value: React.PropTypes.array,
  options: React.PropTypes.array,
};

CascadeSubmenu.defaultProps = {
  prefixCls: 'kuma-cascader',
  onItemClick: function(){},
  value: [],
  options: []
};

export default CascadeSubmenu;
