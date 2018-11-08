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
    const { expandTrigger, renderCustomItem } = this.props;
    return data.map((item) => {
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
          if (item.description) {
            this.descArr = [item.description];
          } else if (this.descArr) {
            this.descArr = [];
          }
        } else {
          this.displayData[groupIndex] = item.label;
          if (item.description) {
            if (!this.descArr) {
              this.descArr = [];
            }
            this.descArr[groupIndex] = item.description;
          } else if (this.descArr) {
            this.descArr[groupIndex] = null;
          }
        }
      }

      return (
        <li
          key={item.value}
          title={item.label}
          className={classnames({ active: item.value === key })}
          {...otherProps}
        >
          {
            renderCustomItem ? renderCustomItem(item) : item.label
          }
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
    const unitWidth = (1 / columnSize).toFixed(4);
    const firstStyle = {};
    if (value && value.length > 0) {
      firstStyle.width = `${unitWidth * 100}%`;
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
        style.width = `${unitWidth * 100}%`;
      } else {
        style.width = `${(1 - unitWidth * value.length) * 100}%`;
        // style.width = `${((cascadeSize - value.length) / columnSize * 100).toFixed(1)}%`;
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

  renderItemDescription() {
    // options[].description 存在则渲染
    if (this.descArr && this.props.value && this.props.value.length) {
      const label = this.displayData[this.displayData.length - 1];
      const desc = this.descArr[this.descArr.length - 1];
      if (desc) {
        return (
          <div className={this.prefixCls('item-description-wrap')}>
            {label}: {desc || i18n[this.props.locale].noDesc}
          </div>
        );
      }
    }
    return null;
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
    }
    const submenuStyle = {};
    if (this.props.cascaderHeight) {
      submenuStyle.height = this.props.cascaderHeight;
    }
    return (
      <div className={this.props.className}>
        <div className={this.prefixCls(`submenu size-${this.props.size}`)} style={wrapStyle}>
          <div className={this.prefixCls('submenu-wrap')} style={submenuStyle}>
            {this.renderSubmenus()}
            {
              this.props.miniMode ? null :
                this.renderAllSelection()
            }
          </div>
          {
            this.props.miniMode ? null :
              this.renderItemDescription()
          }
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
  locale: PropTypes.oneOf(['zh-cn', 'en-us']),
  expandTrigger: PropTypes.oneOf(['click', 'hover']),
  loading: PropTypes.object,
  cascaderHeight: PropTypes.number,
  renderCustomItem: PropTypes.func,
};

CascadeSubmenu.defaultProps = {
  prefixCls: 'kuma-cascader',
  onItemClick() { },
  value: [],
  options: [],
  miniMode: true,
  onOkButtonClick: () => { },
  size: 'large',
  className: '',
  locale: 'zh-cn',
  expandTrigger: 'click',
  loading: {},
  cascadeSize: 3,
  cascaderHeight: 0,
  renderCustomItem: null,
};

CascadeSubmenu.displayName = 'CascadeSubmenu';

export default CascadeSubmenu;
