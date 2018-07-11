/**
 * CascadeSelect Component Demo for uxcore
 * @author changming
 *
 * Copyright 2015-2017, Uxcore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');
const CascadeSelect = require('../src');

const options2 = [{ "value": "1", "code": "A50", "label": "[测试] 阿里巴巴(中国)有限公司", "children": [{ "value": "1-1", "code": "A50-1", "label": "[测试]信息平台事业部" }] }, { "value": "2", "code": "A51", "label": "[测试] 蚂蚁金服有限公司", "children": [{ "value": "2-1", "code": "A51-1", "label": "[测试]花呗事业部" }] }];  // eslint-disable-line

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
  description: '阿里巴巴中国有限公司',
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

const asyncOptions = [
  {
    value: '0',
    label: '0',
    children: [
      {
        value: '0-1',
        label: '0-1',
        children: [
          {
            value: '0-2',
            label: '0-2',
          },
        ],
      },
    ],
  },
  {
    value: '1',
    label: '1',
  },
];

const optionsGenerator = (key, level) => {
  const childrenOptions = [];
  for (let i = 0; i <= level; i += 1) {
    childrenOptions.push({
      label: `label-${key}-${i}`,
      value: `${key}-${i}`,
    });
  }
  return childrenOptions;
};

class ShowSearchWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options,
    };
  }

  render() {
    return (
      <CascadeSelect
        options={this.state.options}
        showSearch
        onSearch={(keywords) => {
          setTimeout(() => {
            this.setState({ options: asyncOptions });
          }, 200);
        }}
      />
    );
  }
}

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      xValue: ['jiangsu', 'nanjing', 'zhonghuamen'],
      value: [2815],
      firstValue: ['zhonghuamen'],
      asyncValue: ['nanjinglu'],
      asyncOptions: [],
      options,
      xxOptions: undefined,
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

  handleAsyncChange = (value, selected) => {
    console.log('AsyncChange', value, selected);
    // 异步时候设置value请设置完整,如['1', '1-1', '1-1-0'],
    if (value.length) {
      this.setState({
        asyncValue: value,
      });
    }
  }

  render() {
    return (
      <div className="demo-wrap" style={{ width: "300px" }}>
        <h2>no default options</h2>
        <CascadeSelect
          value={['fe']}
          locale={'en_US'}
          miniMode={false}
          options={this.state.xxOptions}
        />
        <button
          onClick={() => {
            this.setState({ xxOptions: options });
          }}
        >设置</button>

        <h2>searchOptions</h2>
        <CascadeSelect
          options={options}
          locale={'en_US'}
          miniMode={false}
          displayMode="search"
          searchOption={{
            doSearch(keyword, afterSearch) {
              afterSearch([
                {
                  label: 'test1',
                  value: 'ID_TEST1',
                },
                {
                  label: '前端开发',
                  value: 'fe',
                },
                {
                  label: 'test3 test3 test3 test3 test3 test3 test3 test3 test3 test3',
                  value: 'ID_TEST3',
                },
              ]);
            },
          }}
        />

        <h2>showSearch</h2>

        <ShowSearchWrapper />

        <CascadeSelect
          value={this.state.xValue}
          options={this.state.options}
          clearable
          showSearch
          onChange={(value, selected) => {
            console.log(value);
          }}
          columnWidth={150}
          miniMode={false}
          dropdownClassName="my-custom"
          isMustSelectLeaf
          onSearch={(keywords) => {
            setTimeout(() => {
              this.setState({
                options: [
                  {
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
                  },
                ],
              });
            });
          }}
        />

        <h2>默认的</h2>
        <CascadeSelect
          options={options2}
          cascadeSize={2}
          isMustSelectLeaf={false}
        />

        <h2>异步 <small>value先有，options 异步加载，常用于数据回填</small></h2>
        <button
          onClick={() => {
            this.setState({
              asyncOptions: options,
            });
          }}
        >加载options</button>
        <CascadeSelect
          value={this.state.asyncValue}
          options={this.state.asyncOptions}
          expandTrigger="click"
          isMustSelectLeaf
          onChange={this.handleAsyncChange.bind(this)}
          columnWidth={150}
          size="middle"
        />


        <h2>异步Select 风格</h2>
        <CascadeSelect
          value={this.state.asyncValue}
          options={asyncOptions}
          getPopupContainer={() => {
            const div = document.createElement('div');
            div.className = 'uxcore';
            document.body.appendChild(div);
            return div;
          }}
          dropDownWidth={400}
          onChange={this.handleAsyncChange.bind(this)}
          displayMode="select"
          cascadeSize={3}
          size="small"
          onSelect={(resolve, reject, key, level) => {
            setTimeout(() => {
              if (key === '1-0') {
                reject();
              }
              resolve(optionsGenerator(key, level));
            }, 1000);
          }}
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
            this.setState({
              firstValue: [value[value.length - 1]],
            });
          }}
          displayMode="select"
          cascadeSize={3}
          size="small"
        />
        <h2>Clearable</h2>
        <CascadeSelect
          defaultValue={['fe']}
          options={options}
          clearable
          onChange={(value, selected) => {
            console.log('Clearable', value, selected);
          }}
          locale={'en_US'}
          miniMode={false}
          cascadeSize={3}
          columnWidth={150}
        />
        <CascadeSelect
          defaultValue={['fe']}
          options={options}
          miniMode={false}
          cascadeSize={3}
          displayMode="search"
        />
        <h2>禁用的</h2>
        <CascadeSelect
          defaultValue={['alibaba', 'platform', 'fe']}
          options={options}
          clearable
          disabled
          onChange={(value, selected) => { }}
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
          onChange={(value, selected) => { }}
        />
        <h2>改变value</h2>
        <CascadeSelect
          value={this.state.xValue}
          options={options}
          clearable
          expandTrigger="hover"
          onChange={(value, selected) => { }}
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
          onChange={(value, selected) => { }}
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




