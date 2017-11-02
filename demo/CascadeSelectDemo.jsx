/**
 * CascadeSelect Component Demo for uxcore
 * @author changming
 *
 * Copyright 2015-2017, Uxcore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');
const CascadeSelect = require('../src');

const options = [{
  value: 100224,
  label: 'IS',
  children: [{
    value: 100240,
    label: '通讯服务',
    children: [{
      value: 2815,
      label: '短信服务',
    }, {
      value: 2816,
      label: '互联网电话',
    }],
  }],
}, {
  value: 'alibaba',
  label: '阿里巴巴',
  children: [{
    value: 'platform',
    label: '信息平台',
    children: [{
      value: 'fe',
      label: '前端开发名称加长加长加长加长',
    }],
  }],
}, {
  value: 'beijing',
  label: '日本',
  children: [{
    value: 'xicheng',
    label: '西城',
    children: [
      // {
      //   value: 'zhonggc',
      //   label: '中观村大街',
      // },
    ],
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
      children: [{
        value: 'newbal',
        label: '新百伦',
      }],
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
      xValue: ['jiangsu', 'nanjing', 'zhonghuamen'],
      value: [2815],
      firstValue: ['zhonghuamen'],
    };
  }

  loadFirstOptions() {
    setTimeout(() => {
      this.setState({
        firstOptions: options,
      });
    }, 500);
  }

  handleChange(value) {
    console.log('onChange', value);
    if (value.length) {
      this.setState({
        firstValue: [value[value.length - 1]],
      });
    }
  }

  render() {
    return (
      <div className="demo-wrap">
        <h2>默认的</h2>
        <button onClick={this.loadFirstOptions.bind(this)}>点击加载options</button>
        <CascadeSelect
          value={this.state.firstValue}
          options={this.state.firstOptions}
          expandTrigger="hover"
          onChange={this.handleChange.bind(this)}
          getPopupContainer={() => {
            const div = document.createElement('div');
            div.className = 'uxcore';
            document.body.appendChild(div);
            return div;
          }}
          dropDownWidth={400}
          onChange={(value, selected) => {
            {/*console.log('Default', value, selected);*/}
          }}
          size="small"
        />
        <h2>Select 风格</h2>
        <CascadeSelect
          value={this.state.firstValue}
          options={options}
          getPopupContainer={() => {
            const div = document.createElement('div');
            div.className = 'uxcore';
            document.body.appendChild(div);
            return div;
          }}
          dropDownWidth={400}
          onChange={(value, selected) => {
            console.log('Select 风格', value, selected);
          }}
          displayMode="select"
          cascadeSize={3}
          size="small"
        />
        <h2>Clearable</h2>
        <CascadeSelect
          defaultValue={['alibaba', 'platform', 'fe']}
          options={options}
          clearable
          onChange={(value, selected) => {
            console.log('Clearable', value, selected);
          }}
          locale={'en_US'}
          miniMode={false}
          cascadeSize={3}
          size="small"
          displayMode="dropdown"
        />
        <h2>禁用的</h2>
        <CascadeSelect
          defaultValue={['alibaba', 'platform', 'fe']}
          options={options}
          clearable
          disabled
          onChange={(value, selected) => {}}
        />
        <h2>必须选到根节点</h2>
        <CascadeSelect
          defaultValue={['alibaba', 'platform', 'fe']}
          options={options}
          clearable
          onChange={(value, selected) => { console.log(value, selected); }}
          size="small"
          isMustSelectLeaf
        />
        <h2>鼠标悬浮的</h2>
        <CascadeSelect
          defaultValue={['alibaba', 'platform', 'fe']}
          options={options}
          clearable
          expandTrigger="hover"
          onChange={(value, selected) => {}}
        />
        <h2>改变value</h2>
        <CascadeSelect
          value={this.state.xValue}
          options={options}
          clearable
          expandTrigger="hover"
          onChange={(value, selected) => {}}
        />
        <button
          onClick={() => this.setState({ xValue: ['fe'] })}
        >
          设置一个不存在的值
        </button>
        <CascadeSelect
          value={this.state.xValue2}
          options={options}
          clearable
          expandTrigger="hover"
          onChange={(value, selected) => {}}
        />
        <button
          onClick={() => this.setState({ xValue2: ['fe'] })}
        >
          设置底层叶子节点
        </button>
      </div>
    );
  }
}

module.exports = Demo;
