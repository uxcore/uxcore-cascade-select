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
const prefixCls = function (name) {
  return `uxcore-cascader-${name}`;
};

class CascadeSubmenu extends React.Component {
  _renderUlList(data, key, groupIndex) {
    return (
      data.map(item =>
        <li
          key={item.value}
          onClick={() => { this.props.onItemClick(item.value, groupIndex, item) }}
          title={item.label}
          className={ classnames({'active' : item.value === key})}>
          {item.label}
        </li>
      )
    );
  }

  _renderSubmenus() {
    let {defaultValue, options} = this.props;
    if (defaultValue.length === 0) {
      return (
        <ul>
          { this._renderUlList(options, null, 0) }
        </ul>
      );
    } else {
      let renderArr = null;
      let prevSelected = null;
      return defaultValue.map( (key, index) => {
        if (index === 0) {
          renderArr = options;
        } else {
          renderArr = prevSelected.children;
        }
        prevSelected = _.find(renderArr, item => item.value === key);
        if (renderArr) {
          return (
            <ul key={key}>
              { this._renderUlList(renderArr, key, index) }
            </ul>
          )
        }
        return null;
      });
    }
  }

  render() {
    return (
      <div className={ prefixCls('submenu') }>
        <div className={ prefixCls('submenu-border') }></div>
        <div className={ prefixCls('submenu-wrap') }>
          {this._renderSubmenus()}
        </div>
      </div>
    )
  }
}

class CascadeSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      displayValue : '',
      value : this.props.defaultValue || [],
      selectedOptions : [],
      showSubMenu : false
    }
  }

  componentDidMount() {
    let {defaultValue, options} = this.props;
    let {selectedOptions} = this.state;
    if (defaultValue.length) {
      let renderArr = null;
      let prevSelected = null;
      defaultValue.forEach( (key, index) => {
        if (index === 0) {
          renderArr = options;
        } else {
          renderArr = prevSelected.children;
        }
        prevSelected = _.find(renderArr, item => item.value === key);
        if (renderArr) {
          selectedOptions[index] = prevSelected;
        }
      });
    }
    this.setState({selectedOptions});
  }

  _onSubmenuItemClick(key, index, selectedOption) {
    let {value,selectedOptions} = this.state;
    let {onChange} = this.props;
    value.splice(index, 10, key, '');
    selectedOptions.splice(index, 10, selectedOption);
    if (onChange) {
      onChange(_.filter(value, item => item !== ''), selectedOptions)
    }
    this.setState({value, selectedOptions});
  }

  render() {
    let {placeholder, className, options} = this.props;
    let {value,selectedOptions,showSubMenu} = this.state;
    return (
      <div className={classnames(prefixCls('wrapper'), className)}>
        <div className={prefixCls('text')}>
          <div onClick={() => this.setState({showSubMenu : !showSubMenu})}
            className={prefixCls('trigger')}>
            {
              placeholder && !value.length ?
              <div className={prefixCls('placeholder')}>{placeholder}</div> :
              null
            }
            {
              selectedOptions.length ?
              this.props.beforeRender(value,selectedOptions) :
              null
            }
          </div>
          {
            options.length && showSubMenu ?
            <CascadeSubmenu
              onItemClick={this._onSubmenuItemClick.bind(this)}
              options={options}
              defaultValue={value} /> :
            null
          }
        </div>
        <div className={classnames({
            [prefixCls('arrow')] : true,
            [prefixCls('arrow-reverse')] : showSubMenu
          })}>
          <i className="kuma-icon kuma-icon-triangle-down"></i>
        </div>
      </div>
    );
  }

}

CascadeSelect.defaultProps = {
  className : '',
  placeholder : '请选择',
  options : [],
  defaultValue : [],
  onChange : function(value, selectedOptions){},
  disabled : false,    // TODO
  clearable : false,   // TODO
  changeOnSelect : false, // TODO
  expandTrigger : 'click', // TODO
  beforeRender : function(value, selectedOptions){ return selectedOptions.map(o => o.label).join(' / ') }
};

// http://facebook.github.io/react/docs/reusable-components.html
CascadeSelect.propTypes = {
  className : React.PropTypes.string,
  options : React.PropTypes.array,
  defaultValue : React.PropTypes.array,
  placeholder : React.PropTypes.string,
  onChange : React.PropTypes.func,
  disabled : React.PropTypes.bool,
  clearable : React.PropTypes.bool,
  changeOnSelect : React.PropTypes.bool,
  expandTrigger : React.PropTypes.string,
  beforeRender : React.PropTypes.func
};

CascadeSelect.displayName = 'CascadeSelect';

module.exports = CascadeSelect;
