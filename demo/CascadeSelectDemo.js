/**
 * CascadeSelect Component Demo for uxcore
 * @author changming
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');
const CascadeSelect = require('../src');

const options = [{
  value: 'alibaba',
  label: '阿里巴巴',
  children: [{
    value: 'platform',
    label: '信息平台',
    children: [{
      value: 'fe',
      label: '前端开发',
    }],
  }],
}, {
  value: 'beijing',
  label: '日本',
  children: [{
    value: 'xicheng',
    label: '西城',
    children: [{
      value: 'zhonggc',
      label: '中观村大街',
    }],
  }],
}, {
  value: 'tianjin',
  label: '天津',
  children: [{
    value: 'heping',
    label: '和平区',
    children: [{
      value: 'nanjinglu',
      label: '南京路',
    }],
  }, {
    value: 'hexi',
    label: '河西区',
    children: [{
      value: 'dagu',
      label: '大沽路',
    }],
  }],
}, {
  value: 'zhejiang',
  label: '浙江',
  children: [{
    value: 'hangzhou',
    label: '杭州',
    children: [{
      value: 'xihu',
      label: '西湖',
    }],
  }],
}, {
  value: 'jiangsu',
  label: '江苏',
  children: [{
    value: 'nanjing',
    label: '南京',
    children: [{
      value: 'zhonghuamen',
      label: '中华门',
    }],
  }],
}];

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      xValue : ['jiangsu', 'nanjing', 'zhonghuamen'],
      testValue: 1,
      value: ['alibaba'],
    };
  }

  handleChange(value) {
    this.setState({
      value,
    })
  }

  render() {
    return (
      <div className="demo-wrap">
        <h2>默认的</h2>
        <CascadeSelect
          value={this.state.value}
          options={options}
          onChange={this.handleChange.bind(this)}
        />
        <h2>可清空的</h2>
        <CascadeSelect
          defaultValue={['alibaba', 'platform', 'fe']}
          options={options}
          clearable
          onChange={(value, selected) => console.log(value, selected)}
        />
        <h2>禁用的</h2>
        <CascadeSelect
          defaultValue={['alibaba', 'platform', 'fe']}
          options={options}
          clearable
          disabled
          onChange={(value, selected) => console.log(value, selected)}
        />
        <h2>实时改变的</h2>
        <CascadeSelect
          defaultValue={['alibaba', 'platform', 'fe']}
          options={options}
          clearable
          changeOnSelect
          onChange={(value, selected) => console.log(value, selected)}
        />
        <h2>鼠标悬浮的</h2>
        <CascadeSelect
          defaultValue={['alibaba', 'platform', 'fe']}
          options={options}
          clearable
          expandTrigger="hover"
          onChange={(value, selected) => console.log(value, selected)}
        />
        <h2>改变value</h2>
        <CascadeSelect
          value={this.state.xValue}
          options={options}
          clearable
          expandTrigger="hover"
          onChange={(value, selected) => console.log(value, selected)}
        />
        <button
          onClick={() => this.setState({xValue: ['alibaba', 'platform', 'fe']})}
        >
          Change Value
        </button>
      </div>
    );
  }
}

module.exports = Demo;
