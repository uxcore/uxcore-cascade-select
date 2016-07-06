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
import CascadeSubmenu from './CascadeSubmenu';

let cascaderId = 1000;

class CascadeSelect extends React.Component {
  constructor(props) {
    super(props);
    const { defaultValue, options } = props;
    const selectedOptions = [];
    if (defaultValue.length) {
      let renderArr = null;
      let prevSelected = null;
      defaultValue.forEach((key, index) => {
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
    this.state = {
      displayValue: this.props.defaultValue || [],
      value: this.props.defaultValue || [],
      selectedOptions,
      showSubMenu: false,
    };
    this.hideFunc = this.hideSubmenu.bind(this);
  }

  componentDidMount() {
    $('body').on('click', this.hideFunc);
  }

  componentWillUnmount() {
    $('body').off('click', this.hideFunc);
  }

  hideSubmenu(e) {
    let $wrapper = $(e.target).parents('.uxcore-cascader-wrapper');
    let wrapper = this.refs.wrapper;
    if ($wrapper.attr('id') !== wrapper.id) {
      this.setState({showSubMenu: false});
    }
  }

  onSubmenuItemClick(key, index, selectedOption) {
    const { value, selectedOptions } = this.state;
    const { onChange, changeOnSelect, cascadeSize } = this.props;
    let showSubMenu = true;
    value.splice(index, 10, key, '');
    selectedOptions.splice(index, 10, selectedOption);
    if (selectedOptions.length >= cascadeSize) {
      showSubMenu = false;
    }
    if (onChange) {
      onChange(_.filter(value, item => item !== ''), selectedOptions);
    }
    if (changeOnSelect) {
      this.setState({
        displayValue: value,
        value,
        selectedOptions,
        showSubMenu
      });
    } else if (!showSubMenu) {
      this.setState({
        displayValue: value,
        value,
        selectedOptions,
        showSubMenu
      });
    } else {
      this.setState({
        value,
        selectedOptions
      });
    }
  }

  clearContent() {
    this.setState({
      displayValue: [],
      value : [],
      selectedOptions : []
    });
  }

  render() {
    const {
      placeholder,
      className,
      options,
      disabled,
      clearable,
      expandTrigger,
      cascadeSize
    } = this.props;
    const { value, selectedOptions, showSubMenu, displayValue } = this.state;
    return (
      <div
        id={++cascaderId}
        ref="wrapper"
        className={classnames({
          [prefixCls('wrapper')]: true,
          [className]: true,
          [prefixCls('disabled')]: disabled,
          [prefixCls('clearable')]: !disabled && clearable && displayValue.length > 0,
          [prefixCls('hoverable')]: expandTrigger === 'hover'
        })}
      >
        <div className={prefixCls('text')}>
          <div
            onClick={() => {
              if (!disabled) {
                this.setState({ showSubMenu: !showSubMenu })
              }
            }}
            className={prefixCls('trigger')}
          >
          {
            placeholder && !displayValue.length ?
            <div className={prefixCls('placeholder')}>
              {placeholder}
            </div> :
            null
          }
          {
            displayValue.length ?
            this.props.beforeRender(displayValue, selectedOptions) :
            null
          }
          </div>
          {
            options.length && showSubMenu && !disabled ?
            <CascadeSubmenu
              onItemClick={this.onSubmenuItemClick.bind(this)}
              options={options}
              defaultValue={value}
              expandTrigger={expandTrigger}
              cascadeSize={cascadeSize}
            /> :
            null
          }
        </div>
        <div
          className={classnames({
            [prefixCls('arrow')]: true,
            [prefixCls('arrow-reverse')]: showSubMenu,
          })}
        >
          <i className="kuma-icon kuma-icon-triangle-down"></i>
        </div>
        {
          <div
            className={prefixCls('close-wrap')}
          >
            <i onClick={this.clearContent.bind(this)} className="kuma-icon kuma-icon-error"></i>
          </div>
        }
      </div>
    );
  }

}

CascadeSelect.defaultProps = {
  className: '',
  placeholder: '请选择',
  options: [],
  defaultValue: [],
  onChange: (value, selectedOptions) => {},
  disabled: false,
  clearable: false,
  changeOnSelect: false,
  expandTrigger: 'click',
  cascadeSize: 3,
  beforeRender: (value, selectedOptions) => selectedOptions.map(o => o.label).join(' / '),
};

// http://facebook.github.io/react/docs/reusable-components.html
CascadeSelect.propTypes = {
  className: React.PropTypes.string,
  options: React.PropTypes.array,
  defaultValue: React.PropTypes.array,
  placeholder: React.PropTypes.string,
  onChange: React.PropTypes.func,
  disabled: React.PropTypes.bool,
  clearable: React.PropTypes.bool,
  changeOnSelect: React.PropTypes.bool,
  expandTrigger: React.PropTypes.string,
  beforeRender: React.PropTypes.func,
};

CascadeSelect.displayName = 'CascadeSelect';

module.exports = CascadeSelect;
